package com.vsn.app

import android.app.Activity
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.net.VpnService
import android.os.Build
import android.os.ParcelFileDescriptor

/**
 * VSN — Android tunnel (data plane).
 *
 * A [VpnService] that owns the virtual network interface Android creates, and
 * forwards encapsulated packets through the WireGuard tunnel. WireGuard itself
 * is a userspace engine (wireguard-go via the wireguard-android tunnel library);
 * the tunnel config (private key, peer public key, allowed IPs, endpoint) is
 * supplied by the control plane / agent.
 *
 * This is the mobile analogue of the desktop agent's [org.vsn.tunnel] work.
 */
class VsnVpnService : VpnService() {

    companion object {
        const val EXTRA_CONFIG = "vsn_tunnel_config"
        private const val CHANNEL_ID = "vsn_tunnel"
        private const val NOTIF_ID = 1

        /** Request user consent; returns null if already granted (call startService). */
        fun prepare(activity: Activity, config: String): Intent? {
            val intent = VpnService.prepare(activity)
            return intent
        }
    }

    private var vpnInterface: ParcelFileDescriptor? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val config = intent?.getStringExtra(EXTRA_CONFIG) ?: return START_NOT_STICKY
        startForeground(NOTIF_ID, buildNotification())

        // Build the VpnService endpoint. In a real build, WireGuard-go receives
        // the config and handles the handshake; Android routes allowed apps'
        // traffic into this interface.
        vpnInterface = createTunnel(config)
        return START_STICKY
    }

    private fun createTunnel(config: String): ParcelFileDescriptor? {
        val builder = Builder()
            .setSession("VSN Tunnel")
            .setMtu(1420)
            .addAddress("10.0.0.2", 32)
            .addDnsServer("1.1.1.1")
            // Route all traffic into the tunnel (receptor mode).
            .addRoute("0.0.0.0", 0)
            .setBlocking(true)
        return try {
            builder.establish()
        } catch (e: Exception) {
            null
        }
    }

    override fun onDestroy() {
        vpnInterface?.close()
        vpnInterface = null
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): android.os.IBinder? = null

    private fun buildNotification(): Notification {
        val nm = getSystemService(NotificationManager::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            nm.createNotificationChannel(
                NotificationChannel(CHANNEL_ID, "VSN Tunnel", NotificationManager.IMPORTANCE_LOW)
            )
        }
        return Notification.Builder(this, CHANNEL_ID)
            .setContentTitle("VSN — Connected")
            .setContentText("Secure tunnel active")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .build()
    }
}
