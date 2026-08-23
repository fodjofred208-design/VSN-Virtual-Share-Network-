// VSN — Virtual Share Network: Settings Page (phone-style, categories + i18n)
"use client";

import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { useI18n } from "@/components/i18n-provider";
import { LANGUAGES, type Language } from "@/lib/i18n/locales";
import {
  User,
  Moon,
  Sun,
  Earth,
  Bell,
  Shield,
  Zap,
  HardDrive,
  Clock,
  Users,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  Info,
  Languages,
  Check,
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
    <div
      className="flex items-center justify-between p-3.5 rounded-xl"
      style={{ backgroundColor: "var(--vsn-bg)", border: "1px solid var(--vsn-border)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "var(--vsn-glow)", color: "var(--vsn-accent)" }}
        >
          {icon}
        </div>
        <div>
          <div className="text-sm font-medium" style={{ color: "var(--vsn-text)" }}>
            {title}
          </div>
          <div className="text-[10px]" style={{ color: "var(--vsn-text-muted)" }}>
            {description}
          </div>
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

function SettingRow({
  icon,
  title,
  right,
}: {
  icon: React.ReactNode;
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between p-3.5 rounded-xl"
      style={{ backgroundColor: "var(--vsn-bg)", border: "1px solid var(--vsn-border)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "var(--vsn-glow)", color: "var(--vsn-accent)" }}
        >
          {icon}
        </div>
        <span className="text-sm font-medium" style={{ color: "var(--vsn-text)" }}>
          {title}
        </span>
      </div>
      {right ?? <ChevronRight size={16} style={{ color: "var(--vsn-text-muted)" }} />}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="vsn-card p-4">
      <h3
        className="text-[11px] font-black uppercase tracking-widest mb-3"
        style={{ color: "var(--vsn-text-muted)" }}
      >
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useI18n();
  const [showLanguages, setShowLanguages] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    autoReconnect: true,
    hiddenDonor: false,
    encryptedDns: true,
    startOnBoot: false,
    killSwitch: true,
  });
  const toggle = (key: keyof typeof settings) => setSettings((p) => ({ ...p, [key]: !p[key] }));
  const currentLang = LANGUAGES.find((l) => l.code === lang);

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--vsn-text)" }}>
          {t("settings")}
        </h1>
        <p className="text-sm" style={{ color: "var(--vsn-text-muted)" }}>
          Customize VSN
        </p>
      </div>

      {/* Appearance */}
      <SectionCard title={t("appearance")}>
        <div
          className="flex items-center justify-between p-3.5 rounded-xl"
          style={{ backgroundColor: "var(--vsn-bg)", border: "1px solid var(--vsn-border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--vsn-glow)", color: "var(--vsn-accent)" }}
            >
              {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
            </div>
            <span className="text-sm font-medium" style={{ color: "var(--vsn-text)" }}>
              {t("theme")}
            </span>
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
              🌑 {t("dark")}
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
              ☀️ {t("light")}
            </button>
          </div>
        </div>
      </SectionCard>

      {/* Language */}
      <SectionCard title={t("language")}>
        <button onClick={() => setShowLanguages(!showLanguages)} className="w-full">
          <SettingRow
            icon={<Languages size={16} />}
            title={t("settingsLang")}
            right={
              <span className="text-xs font-medium" style={{ color: "var(--vsn-accent)" }}>
                {currentLang?.flag} {currentLang?.label}
              </span>
            }
          />
        </button>
        {showLanguages && (
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--vsn-border)" }}>
            <p
              className="px-3.5 pt-3 text-[11px] font-black uppercase tracking-widest"
              style={{ color: "var(--vsn-text-muted)" }}
            >
              {t("selectLanguage")}
            </p>
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code);
                  setShowLanguages(false);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-sm hover:bg-white/10"
                style={{ color: "var(--vsn-text)" }}
              >
                <span>
                  {l.flag} {l.label}
                </span>
                {lang === l.code && <Check size={16} style={{ color: "var(--vsn-accent)" }} />}
              </button>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Account */}
      <SectionCard title={t("account")}>
        <SettingRow icon={<User size={16} />} title="Profile" />
        <SettingRow icon={<Shield size={16} />} title="Security" />
        <SettingRow icon={<Users size={16} />} title="Devices" />
      </SectionCard>

      {/* Network */}
      <SectionCard title={t("network")}>
        <ToggleSetting
          icon={<Zap size={16} />}
          title="Auto Reconnect"
          description="Reconnect if the tunnel drops"
          enabled={settings.autoReconnect}
          onToggle={() => toggle("autoReconnect")}
        />
        <ToggleSetting
          icon={<Earth size={16} />}
          title="Encrypted DNS"
          description="DNS-over-HTTPS (no leakage)"
          enabled={settings.encryptedDns}
          onToggle={() => toggle("encryptedDns")}
        />
        <ToggleSetting
          icon={<Shield size={16} />}
          title="Hidden Donor Mode"
          description="Relay masks donor IP"
          enabled={settings.hiddenDonor}
          onToggle={() => toggle("hiddenDonor")}
        />
      </SectionCard>

      {/* Security */}
      <SectionCard title={t("security")}>
        <ToggleSetting
          icon={<Shield size={16} />}
          title="Kill Switch"
          description="Block traffic if tunnel drops"
          enabled={settings.killSwitch}
          onToggle={() => toggle("killSwitch")}
        />
        <SettingRow icon={<User size={16} />} title="Device Identity" />
      </SectionCard>

      {/* Notifications */}
      <SectionCard title={t("notifications")}>
        <ToggleSetting
          icon={<Bell size={16} />}
          title="Connection Alerts"
          description="Notify on connect/disconnect"
          enabled={settings.notifications}
          onToggle={() => toggle("notifications")}
        />
        <ToggleSetting
          icon={<Shield size={16} />}
          title="Security Alerts"
          description="Suspicious activity"
          enabled={true}
          onToggle={() => {}}
        />
      </SectionCard>

      {/* Donor defaults */}
      <SectionCard title="Donor Defaults">
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: <Users size={14} />, label: "Max Receptors", value: "3" },
            { icon: <HardDrive size={14} />, label: "Bandwidth", value: "10 Mbps" },
            { icon: <Clock size={14} />, label: "Max Session", value: "2h" },
            { icon: <HardDrive size={14} />, label: "Data Quota", value: "1 GB" },
          ].map((it) => (
            <div
              key={it.label}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ backgroundColor: "var(--vsn-bg)", border: "1px solid var(--vsn-border)" }}
            >
              <div className="flex items-center gap-2" style={{ color: "var(--vsn-text-muted)" }}>
                {it.icon}
                <span className="text-xs">{it.label}</span>
              </div>
              <span className="text-sm font-semibold" style={{ color: "var(--vsn-text)" }}>
                {it.value}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Advanced */}
      <SectionCard title={t("advanced")}>
        <SettingRow icon={<Zap size={16} />} title="Diagnostics" />
        <SettingRow icon={<Info size={16} />} title="Logs" />
        <ToggleSetting
          icon={<Zap size={16} />}
          title="Start on Boot"
          description="Launch VSN automatically"
          enabled={settings.startOnBoot}
          onToggle={() => toggle("startOnBoot")}
        />
      </SectionCard>

      {/* About */}
      <SectionCard title={t("about")}>
        <SettingRow
          icon={<Info size={16} />}
          title={t("version")}
          right={
            <span className="text-xs font-mono" style={{ color: "var(--vsn-accent)" }}>
              v0.1.0
            </span>
          }
        />
        <SettingRow icon={<Info size={16} />} title={t("terms")} />
        <p className="text-center text-[10px] pt-2 tracking-widest" style={{ color: "var(--vsn-accent)" }}>
          {t("madeBy")}
        </p>
      </SectionCard>
    </div>
  );
}
