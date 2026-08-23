// VSN Agent — NAT traversal / peer connection (data plane)
//
// Two devices (donor & receptor) are usually behind NAT/CGNAT, so they can't
// always reach each other directly. This module implements the discovery +
// connection strategy, in order:
//
//   1. DIRECT      — both endpoints are publicly reachable (no NAT).
//   2. STUN/ICE    — discover the public mapped IP:port and attempt UDP hole
//                    punching so the two peers connect directly.
//   3. RELAY       — when hole punching fails (common on mobile/CGNAT), fall
//                    back to an encrypted relay that forwards opaque WireGuard
//                    packets. The relay does NOT decrypt anything.
//
// State carried on each candidate. The candidates are exchanged over the
// control-plane signaling channel (protocol/messages/traversal.ts).
import { createSocket, type Socket } from "node:dgram";

export type ConnType = "direct" | "hole_punched" | "relay";

export interface Candidate {
  ip: string;
  port: number;
  type: "host" | "srflx" | "relay";
}

export interface HolePunchResult {
  connType: ConnType;
  candidate?: Candidate;
  relayId?: string;
}

export interface NatTraversalOptions {
  /** list of STUN servers, e.g. ["stun.l.google.com:19302"]. */
  stunServers?: string[];
  /** UDP socket to bind (optional; created lazily). */
  socket?: Socket;
}

/** Minimal STUN binding request (RFC 5389) — message type 0x0001. */
function buildStunRequest(transactionId?: string): Buffer {
  const txn = Buffer.from(transactionId ?? cryptoRandomString(12), "utf8");
  const header = Buffer.alloc(20);
  header.writeUInt16BE(0x0001, 0); // Binding request
  header.writeUInt16BE(0, 2); // length
  header.writeUInt32BE(0x2112a442, 4); // magic cookie
  txn.copy(header, 8);
  return header;
}

function cryptoRandomString(len: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

/** Parse the STUN response and extract the mapped (XOR) address → candidate. */
function parseStunMappedAddress(buf: Buffer): Candidate | null {
  if (buf.length < 20) return null;
  const type = buf.readUInt16BE(0);
  if (type !== 0x0101) return null; // not binding success
  let offset = 20;
  while (offset + 4 <= buf.length) {
    const attrType = buf.readUInt16BE(offset);
    const attrLen = buf.readUInt16BE(offset + 2);
    const valueStart = offset + 4;
    if (attrType === 0x0020 && attrLen >= 8) {
      // XOR-MAPPED-ADDRESS
      const family = buf.readUInt8(valueStart + 1);
      const port = buf.readUInt16BE(valueStart + 2) ^ 0x2112;
      if (family === 0x01) {
        const ip = `${buf.readUInt8(valueStart + 4) ^ 0x21}.${buf.readUInt8(valueStart + 5) ^ 0xa4}.${buf.readUInt8(valueStart + 6) ^ 0x21}.${buf.readUInt8(valueStart + 7) ^ 0xa4}`;
        return { ip, port, type: "srflx" };
      }
    }
    if (attrType === 0x0001 && attrLen >= 4) {
      // MAPPED-ADDRESS (non-XOR fallback)
      const family = buf.readUInt8(valueStart + 1);
      const port = buf.readUInt16BE(valueStart + 2);
      if (family === 0x01) {
        const ip = `${buf.readUInt8(valueStart + 4)}.${buf.readUInt8(valueStart + 5)}.${buf.readUInt8(valueStart + 6)}.${buf.readUInt8(valueStart + 7)}`;
        return { ip, port, type: "srflx" };
      }
    }
    offset = valueStart + attrLen + (attrLen % 4 === 0 ? 0 : 4 - (attrLen % 4));
  }
  return null;
}

export class NatTraversal {
  private readonly stunServers: string[];
  private readonly socket: Socket;

  constructor(opts: NatTraversalOptions = {}) {
    this.stunServers = opts.stunServers ?? ["stun.l.google.com:19302", "stun.cloudflare.com:3478"];
    this.socket = opts.socket ?? createSocket("udp4");
  }

  /** Ask a STUN server for our public address (server-reflexive candidate). */
  async discoverPublicCandidate(): Promise<Candidate> {
    const host = this.stunServers[0].split(":")[0];
    const port = Number(this.stunServers[0].split(":")[1] ?? 3478);
    const req = buildStunRequest();
    return new Promise<Candidate>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.socket.off("message", onMsg);
        reject(new Error("STUN timeout"));
      }, 2500);
      const onMsg = (msg: Buffer) => {
        const candidate = parseStunMappedAddress(msg);
        if (!candidate) return;
        clearTimeout(timeout);
        this.socket.off("message", onMsg);
        resolve(candidate);
      };
      this.socket.on("message", onMsg);
      this.socket.send(req, port, host, (err) => {
        if (err) {
          clearTimeout(timeout);
          this.socket.off("message", onMsg);
          reject(err);
        }
      });
    });
  }

  /**
   * Attempt UDP hole punching to the peer's candidate. Sends a probe to the
   * peer's public endpoint so its NAT creates the mapping, then reports success.
   */
  async holePunch(peer: Candidate): Promise<HolePunchResult> {
    const payload = Buffer.from("VSN-HOLE-PUNCH");
    return new Promise<HolePunchResult>((resolve) => {
      const onMsg = (msg: Buffer) => {
        if (msg.toString().includes("VSN-HOLE-PUNCH")) {
          this.socket.off("message", onMsg);
          resolve({ connType: "hole_punched", candidate: peer });
        }
      };
      this.socket.on("message", onMsg);
      // Send a few probes (UDP is unreliable; NATs may drop the first).
      for (let i = 0; i < 3; i++) {
        setTimeout(() => this.socket.send(payload, peer.port, peer.ip, () => undefined), i * 150);
      }
      setTimeout(() => {
        this.socket.off("message", onMsg);
        // Hole punching failed → fall through to relay.
        resolve({ connType: "relay" });
      }, 4000);
    });
  }

  close(): void {
    try {
      this.socket.close();
    } catch {
      // already closed
    }
  }

  /** Pick the best connection type given the two candidates. */
  static plan(hostLocal: Candidate, peer: Candidate): ConnType {
    // Both have server-reflexive (public) addresses → try direct/hole-punch.
    if (peer.type === "srflx" || peer.type === "host") return "hole_punched";
    return "relay";
  }
}
