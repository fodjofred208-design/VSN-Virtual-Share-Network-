// VSN — iOS Packet Tunnel Provider (Network Extension)
// The iOS data-plane tunnel. Subclass NEPacketTunnelProvider and run the
// VSN WireGuard tunnel (wireguard-go) after receiving the config from the
// control plane via the `providerConfiguration`.
//
// The agent core (agent/src/tunnel) generates the WireGuard config; this Swift
// extension receives it and hands it to wireguard-go.
import NetworkExtension

class VSNPacketTunnelProvider: NEPacketTunnelProvider {

    private var wg: VSNWireGuardTunnel?

    override func startTunnel(options: [String : NSObject]? = nil) -> Void {
        // The control plane ships the tunnel config (peer public key, preshared
        // key, addressing, endpoint) here. Token from the app extension.
        guard let conf = protocolConfiguration.providerConfiguration?["vsnConfig"] as? [String: Any] else {
            // Invalid config → stop with error.
            return
        }
        wg = VSNWireGuardTunnel(provider: self, config: conf)
        wg?.start()
    }

    override func stopTunnel(with reason: NEProviderStopReason) -> Void {
        wg?.stop()
        cancelTunnel(with: .userInitiated)
    }
}

// Placeholder WireGuard iOS runner — wraps wireguard-go (compiled for iOS).
// In the full build this integrates the WireGuard iOS library.
final class VSNWireGuardTunnel {
    private let provider: NEPacketTunnelProvider
    private let config: [String: Any]

    init(provider: NEPacketTunnelProvider, config: [String: Any]) {
        self.provider = provider
        self.config = config
    }

    func start() {
        let netSettings = NEPacketTunnelNetworkSettings(tunnelRemoteAddress: (config["endpoint"] as? String) ?? "10.0.0.1")
        // Configure routes/DNS here, then setTunnelNetworkSettings.
        provider.setTunnelNetworkSettings(netSettings) { error in
            if error == nil {
                // Tunnel up: route traffic through it (receptor).
            } else {
                self.provider.cancelTunnel(with: .configurationFailed)
            }
        }
    }

    func stop() {}
}
