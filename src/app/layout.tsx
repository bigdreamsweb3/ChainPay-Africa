import type { Metadata } from "next";
import "./globals.css";
import { Layout } from "@/component/layout/Layout";

export const metadata: Metadata = {
  title: "ChainPay Africa - Pay Bills with Crypto",
  description:
    "ChainPay Africa is a blockchain-powered payment platform that lets you pay for airtime, data, electricity, and other services using USDC or BNB on Binance Smart Chain. Enjoy fast, secure, and borderless transactions.",
  themeColor: "#0066FF",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
