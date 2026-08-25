package com.vsn.app

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder

/**
 * VSN — Background agent service (control-plane coordination).
 *
 * Runs in the foreground so the tunnel stays up while the app is backgrounded.
 * It communicates with the VSN control server (signaling) to discover donors,
 * accept/reject connections, and drive the [VsnVpnService] up/down.
 *
 * It binds to the control-plane WebSocket signaling endpoint (res/values/strings.xml).
 */
class VsnAgentService : Service() {

    companion object {
        const val CHANNEL_ID = "vsn_agent"
        const val NOTIF_ID = 2
    }

    override fun onCreate() {
        super.onCreate()
        startForeground(NOTIF_ID, buildNotification())
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Connect to signaling server and register this device. In a full build
        // this resolves the device identity, connects to the control plane, and
        // reacts to donor_online / connection_request / tunnel_ready events.
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        super.onDestroy()
    }

    private fun buildNotification(): Notification {
        val nm = getSystemService(NotificationManager::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            nm.createNotificationChannel(
                NotificationChannel(CHANNEL_ID, "VSN Agent", NotificationManager.IMPORTANCE_LOW)
            )
        }
        return Notification.Builder(this, CHANNEL_ID)
            .setContentTitle("VSN Agent")
            .setContentText("Ready to share or connect")
            .setSmallIcon(android.R.drawable.ic_menu_compass)
            .build()
    }
}
