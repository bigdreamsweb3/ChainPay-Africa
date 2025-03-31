import type { Metadata } from "next";
import "./globals.css";
import { Layout } from "@/component/layout/Layout";

export const metadata: Metadata = {
  title: "ChainPay Africa - Pay Bills with Crypto",
  description:
    "ChainPay Africa is a blockchain-powered payment platform that lets you pay for airtime, data, electricity, and other services using USDC or BNB on Binance Smart Chain. Enjoy fast, secure, and borderless transactions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Theme color for browser toolbar/status bar */}
        <meta name="theme-color" content="#E6F0FF" /> 
        {/* For mobile browsers (e.g., Chrome on Android) */}
        <meta name="mobile-web-app-capable" content="yes" />
        {/* For iOS Safari status bar */}
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="antialiased">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
