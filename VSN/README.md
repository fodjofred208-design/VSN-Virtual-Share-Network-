# VSN — Virtual Share Network Professional Suite

## 🌎 Overview
VSN is a high-performance cross-platform networking application designed to facilitate voluntary internet connectivity sharing through secure, encrypted virtual tunnels. It allows "Donors" with stable high-speed connections to securely bridge "Receptors" with limited access, effectively acting as a decentralized virtual ISP.

---

## 🏗️ Detailed Architecture

### 1. Control Plane (The Orchestrator)
- **Role**: Handles authentication, device registration, donor discovery, signaling, and session management.
- **Security**: The Control Plane **never** holds private cryptographic keys and cannot decrypt user traffic.
- **Protocol**: HTTPS / WebSocket for real-time signaling.

### 2. Data Plane (The Tunnel)
- **Role**: The actual transit path for internet packets between Receptor and Donor.
- **Technology**: **WireGuard** (Userspace implementation).
- **Encryption**: ChaCha20-Poly1305 with Noise protocol handshake.
- **Path**: Direct Peer-to-Peer (UDP Hole Punching) with fallback to encrypted relay servers.

### 3. Geographic Globe Engine
- **Role**: Real-time visualization of the global network topology.
- **Engine**: Three.js / React Three Fiber.
- **Logic**: Maps actual IANA timezones and geographic coordinates to a 3D interactive sphere.

---

## 🛠️ Technology Stack & Languages

| Layer | Technology | Language |
|-------|------------|----------|
| **Frontend UI** | Next.js 16 (App Router) | TypeScript / React |
| **Styling** | Tailwind CSS 4.0 | CSS / Utility Classes |
| **3D Rendering** | Three.js / R3F / Drei | JavaScript / GLSL |
| **Animations** | Framer Motion | JavaScript |
| **ORM** | Drizzle ORM | TypeScript |
| **Database** | PostgreSQL | SQL |
| **Networking** | WireGuard / STUN / ICE | Go / C (conceptual) |
| **Icons** | Lucide React | SVG |

---

## 📦 Master Dependency List

To run VSN, you must install the following core packages:

### 1. Framework & Core
- `next`: React framework for production.
- `react`, `react-dom`: UI library.
- `typescript`: Type safety.
- `zod`: Schema validation.

### 2. Database & State
- `drizzle-orm`: Type-safe SQL client.
- `pg`: PostgreSQL driver.
- `dotenv`: Environment variable management.

### 3. Visuals & UI
- `three`: 3D engine.
- `@react-three/fiber`, `@react-three/drei`: React-Three integration.
- `framer-motion`: Smooth layout transitions.
- `lucide-react`: Professional icon set.
- `clsx`, `tailwind-merge`: Class name management.

### 4. Development Tools
- `drizzle-kit`: Database migration & schema push tool.
- `tailwindcss`, `postcss`: Modern CSS styling.
- `eslint`: Code linting.

---

## 📅 VS Code Development Plan (Milestones)

### Phase 1: Environment Setup
- Configure `.env` with `DATABASE_URL`.
- Initialize Drizzle schema (`npx drizzle-kit push`).
- Verify Next.js build pipeline.

### Phase 2: Core UI Implementation
- Build the "Soft Desktop" layout with Windows 11 aesthetics.
- Implement the Hamburger Drawer and Notification Hub.
- Integrate the interactive 3D Globe with auto-rotation.

### Phase 3: Cryptographic Logic
- Implement Ed25519 keypair generation on the client.
- Set up API routes for Device Registration and Nonce-based Challenge-Response.

### Phase 4: Network Bridge (The Real Work)
- Integrate `wireguard-go` or `libwg` for the userspace tunnel.
- Configure TUN adapter permissions per OS (Windows/Linux/Android).
- Implement NAT Traversal (STUN/ICE/Relay).

### Phase 5: Hardening & Isolation
- Apply `iptables` / `nftables` rules on the donor side.
- Implement per-receptor bandwidth quotas and session limits.

---

## 🚀 Getting Started

1. **Install Dependencies**: `npm install`
2. **Setup Database**: Ensure PostgreSQL is running and update `.env`.
3. **Push Schema**: `npx drizzle-kit push`
4. **Run Dev**: `npm run dev`
5. **Production Build**: `npm run build`

**Developed by FRED**
