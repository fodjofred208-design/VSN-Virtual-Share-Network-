import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/components/i18n-provider";

export const metadata: Metadata = {
  title: "VSN — Virtual Share Network",
  description: "Connect. Share. Reach the Internet. Secure encrypted virtual network sharing platform. Made by Fodjo Fodjo Fred.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased min-h-screen" style={{ backgroundColor: "var(--vsn-bg)", color: "var(--vsn-text)" }}>
        <ThemeProvider>
          <I18nProvider>
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
