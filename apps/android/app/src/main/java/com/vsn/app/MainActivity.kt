package com.vsn.app

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

/**
 * VSN — Android entry point.
 *
 * Loads the VSN control-plane app (Next.js UI + API) in a WebView. The actual
 * tunnel/data-plane work is performed by [VsnVpnService] (WireGuard via
 * VpnService) and orchestrated by the background [VsnAgentService].
 *
 * The control URL is configured in res/values/strings.xml (control_url).
 * For development, point it at your VSN server (e.g. http://10.0.2.2:3000 to
 * reach the host machine's localhost from the Android emulator).
 */
class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.settings.allowFileAccess = true
        webView.settings.mediaPlaybackRequiresUserGesture = false

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                // Allow navigation to the control server; external links open in browser.
                return false
            }
        }

        val controlUrl = getString(R.string.control_url)
        webView.loadUrl(controlUrl)
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) webView.goBack() else super.onBackPressed()
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        // VPN consent result → start the tunnel service.
        if (requestCode == REQUEST_VPN && resultCode == RESULT_OK) {
            val config = pendingConfig ?: getString(R.string.control_url)
            startService(Intent(this, VsnVpnService::class.java).putExtra(VsnVpnService.EXTRA_CONFIG, config))
        }
    }

    /** Called by the Web app (JS bridge) to request the tunnel. Requests OS VPN consent. */
    fun startTunnel(config: String) {
        pendingConfig = config
        val prepareIntent = VpnService.prepare(this)
        if (prepareIntent != null) {
            // Native "VPN consent" prompt — this is the OS deep-link / system dialog.
            startActivityForResult(prepareIntent, REQUEST_VPN)
        } else {
            startService(Intent(this, VsnVpnService::class.java).putExtra(VsnVpnService.EXTRA_CONFIG, config))
        }
    }

    companion object {
        private const val REQUEST_VPN = 1001
        private var pendingConfig: String? = null
    }
}
