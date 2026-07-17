import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import Script from "next/script";

export const metadata: Metadata = {
  title: "MANNA KITCHEN",
  description: "Crafted For Cravings",

  manifest: "/manifest.json",

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MANNA KITCHEN",
  },

  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export const viewport = {
  themeColor: "#f97316",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        {children}
        <Toaster position="top-right" richColors closeButton />
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
