// VSN — Virtual Share Network: Settings Page

"use client";

import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import {
  Settings,
  Moon,
  Sun,
  Globe,
  Bell,
  Shield,
  Zap,
  HardDrive,
  Clock,
  Users,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

interface ToggleSettingProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

function ToggleSetting({ icon, title, description, enabled, onToggle }: ToggleSettingProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: "var(--vsn-bg)", border: "1px solid var(--vsn-border)" }}>
      <div className="flex items-center gap-3">
        <div style={{ color: "var(--vsn-accent)" }}>{icon}</div>
        <div>
          <div className="text-sm font-medium" style={{ color: "var(--vsn-text)" }}>{title}</div>
          <div className="text-[10px]" style={{ color: "var(--vsn-text-muted)" }}>{description}</div>
        </div>
      </div>
      <button onClick={onToggle} className="flex-shrink-0">
        {enabled ? (
          <ToggleRight size={24} style={{ color: "var(--vsn-accent)" }} />
        ) : (
          <ToggleLeft size={24} style={{ color: "var(--vsn-text-muted)" }} />
        )}
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    notifications: true,
    autoReconnect: true,
    hiddenDonor: false,
    encryptedDns: true,
    startOnBoot: false,
    killSwitch: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--vsn-text)" }}>Settings</h1>
        <p className="text-sm" style={{ color: "var(--vsn-text-muted)" }}>Application preferences, connection settings, and privacy configuration</p>
      </div>

      {/* Appearance */}
      <div className="vsn-card p-6">
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--vsn-text)" }}>Appearance</h3>
        <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: "var(--vsn-bg)", border: "1px solid var(--vsn-border)" }}>
          <div className="flex items-center gap-3">
            <div style={{ color: "var(--vsn-accent)" }}>
              {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
            </div>
            <div>
              <div className="text-sm font-medium" style={{ color: "var(--vsn-text)" }}>Theme</div>
              <div className="text-[10px]" style={{ color: "var(--vsn-text-muted)" }}>Switch between dark and light mode</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => theme === "light" && toggleTheme()}
              className="px-3 py-1.5 rounded-l-lg text-xs font-medium"
              style={{
                backgroundColor: theme === "dark" ? "var(--vsn-accent)" : "var(--vsn-bg-card)",
                color: theme === "dark" ? "white" : "var(--vsn-text-muted)",
                border: "1px solid var(--vsn-border)",
              }}
            >
              🌑 Dark
            </button>
            <button
              onClick={() => theme === "dark" && toggleTheme()}
              className="px-3 py-1.5 rounded-r-lg text-xs font-medium"
              style={{
                backgroundColor: theme === "light" ? "var(--vsn-accent)" : "var(--vsn-bg-card)",
                color: theme === "light" ? "white" : "var(--vsn-text-muted)",
                border: "1px solid var(--vsn-border)",
              }}
            >
              ☀️ Light
            </button>
          </div>
        </div>
      </div>

      {/* Connection */}
      <div className="vsn-card p-6">
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--vsn-text)" }}>Connection</h3>
        <div className="space-y-2">
          <ToggleSetting
            icon={<Zap size={18} />}
            title="Auto Reconnect"
            description="Automatically reconnect if the tunnel drops"
            enabled={settings.autoReconnect}
            onToggle={() => toggle("autoReconnect")}
          />
          <ToggleSetting
            icon={<Shield size={18} />}
            title="Kill Switch"
            description="Block all traffic if the VSN tunnel disconnects unexpectedly"
            enabled={settings.killSwitch}
            onToggle={() => toggle("killSwitch")}
          />
          <ToggleSetting
            icon={<Globe size={18} />}
            title="Encrypted DNS"
            description="Use DNS-over-HTTPS to prevent DNS leakage to the donor"
            enabled={settings.encryptedDns}
            onToggle={() => toggle("encryptedDns")}
          />
          <ToggleSetting
            icon={<Shield size={18} />}
            title="Hidden Donor Mode"
            description="Connect through a relay so the donor's public IP stays masked"
            enabled={settings.hiddenDonor}
            onToggle={() => toggle("hiddenDonor")}
          />
        </div>
      </div>

      {/* Donor Defaults */}
      <div className="vsn-card p-6">
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--vsn-text)" }}>Donor Defaults</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: <Users size={16} />, label: "Max Receptors", value: "3" },
            { icon: <HardDrive size={16} />, label: "Bandwidth/Receptor", value: "10 Mbps" },
            { icon: <Clock size={16} />, label: "Max Session", value: "2 hours" },
            { icon: <HardDrive size={16} />, label: "Data Quota", value: "1 GB" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: "var(--vsn-bg)", border: "1px solid var(--vsn-border)" }}>
              <div className="flex items-center gap-2" style={{ color: "var(--vsn-text-muted)" }}>
                {item.icon}
                <span className="text-xs">{item.label}</span>
              </div>
              <span className="text-sm font-semibold" style={{ color: "var(--vsn-text)" }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="vsn-card p-6">
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--vsn-text)" }}>Notifications</h3>
        <div className="space-y-2">
          <ToggleSetting
            icon={<Bell size={18} />}
            title="Connection Alerts"
            description="Notify when receptors connect or disconnect"
            enabled={settings.notifications}
            onToggle={() => toggle("notifications")}
          />
          <ToggleSetting
            icon={<Shield size={18} />}
            title="Security Alerts"
            description="Notify about authentication failures and suspicious activity"
            enabled={true}
            onToggle={() => {}}
          />
        </div>
      </div>

      {/* System */}
      <div className="vsn-card p-6">
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--vsn-text)" }}>System</h3>
        <div className="space-y-2">
          <ToggleSetting
            icon={<Zap size={18} />}
            title="Start on Boot"
            description="Launch VSN automatically when the system starts"
            enabled={settings.startOnBoot}
            onToggle={() => toggle("startOnBoot")}
          />
          <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: "var(--vsn-bg)", border: "1px solid var(--vsn-border)" }}>
            <div>
              <div className="text-sm font-medium" style={{ color: "var(--vsn-text)" }}>Version</div>
              <div className="text-[10px]" style={{ color: "var(--vsn-text-muted)" }}>Current application version</div>
            </div>
            <span className="text-xs font-mono" style={{ color: "var(--vsn-accent)" }}>v0.1.0 — Prototype</span>
          </div>
        </div>
      </div>
    </div>
  );
}
