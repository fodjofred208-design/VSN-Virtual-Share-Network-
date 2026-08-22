# VSN — R8/ProGuard rules
-keep class com.wireguard.android.** { *; }
-keep class com.vsn.app.** { *; }
-keepclassmembers class * extends android.net.VpnService { *; }
