import type { Metadata } from "next";
import "./globals.css";
import { Layout } from "@/component/layout/Layout";

export const metadata: Metadata = {
  title: "ChainPay Africa - Pay Bills with Crypto",
  description:
    "ChainPay Africa is a blockchain-powered payment platform that lets you pay for airtime, data, electricity, and other services using USDC or BNB on Binance Smart Chain. Enjoy fast, secure, and borderless transactions.",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0A1025" }
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ChainPay Africa",
    startupImage: [
      {
        url: "/splashscreens/apple-splash-dark-2048x2732.jpg",
        media: "(prefers-color-scheme: dark) and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      },
      {
        url: "/splashscreens/apple-splash-light-2048x2732.jpg",
        media: "(prefers-color-scheme: light) and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      },
      {
        url: "/splashscreens/apple-splash-dark-1668x2388.jpg",
        media: "(prefers-color-scheme: dark) and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      },
      {
        url: "/splashscreens/apple-splash-light-1668x2388.jpg",
        media: "(prefers-color-scheme: light) and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      },
      {
        url: "/splashscreens/apple-splash-dark-1290x2796.jpg",
        media: "(prefers-color-scheme: dark) and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      },
      {
        url: "/splashscreens/apple-splash-light-1290x2796.jpg",
        media: "(prefers-color-scheme: light) and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      }
    ]
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover"
  },
  applicationName: "ChainPay Africa",
  keywords: ["crypto payments", "blockchain", "airtime", "bill payments", "africa", "web3"],
  authors: [{ name: "ChainPay Africa Team" }],
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "ChainPay Africa",
    "apple-mobile-web-app-status-bar-style": "black-translucent"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* iOS meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Chrome, Firefox OS and Opera */}
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#FFFFFF" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0A1025" />

        {/* Windows Phone */}
        <meta name="msapplication-navbutton-color" content="#0066FF" />
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
