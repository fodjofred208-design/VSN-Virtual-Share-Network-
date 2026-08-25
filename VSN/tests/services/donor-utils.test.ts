import { describe, it, expect } from "vitest";
import {
  generateDonorId,
  generatePairCode,
  formatBandwidth,
  formatBytes,
  formatDuration,
} from "../../src/lib/utils";

describe("donor id / pair code generation", () => {
  it("builds a donor id matching VSN-XX-XXXXX", () => {
    const id = generateDonorId("fr");
    expect(id).toMatch(/^VSN-FR-[A-Z0-9]{5}$/);
  });

  it("builds a pair code with two dashes (XXXX-XXXX-XX)", () => {
    const code = generatePairCode();
    expect(code).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{2}$/);
    expect(code.split("-")).toHaveLength(3);
  });

  it("generates unique-ish codes", () => {
    const a = generatePairCode();
    const b = generatePairCode();
    expect(a).not.toBe(b);
  });
});

describe("formatting helpers", () => {
  it("formats bandwidth", () => {
    expect(formatBandwidth(500)).toBe("500 Kbps");
    expect(formatBandwidth(10240)).toBe("10.2 Mbps");
  });

  it("formats bytes", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(1536)).toBe("1.5 KB");
  });

  it("formats duration", () => {
    expect(formatDuration(45)).toBe("45m");
    expect(formatDuration(90)).toBe("1h 30m");
  });
});
