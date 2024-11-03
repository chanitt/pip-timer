import type { Metadata } from "next";
import "./globals.css";
import { GeistMono } from "geist/font/mono";

const geistMono = GeistMono;

export const metadata: Metadata = {
  title: "PiP Timer",
  description: "A simple timer for Picture-in-Picture mode",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
