import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlyRank AI - Streaming Chat Interface (FE-06)",
  description:
    "Real-time streaming AI chat interface with Vercel AI SDK, Google Gemini free tier, auto-scroll heuristics, and resilient stop/recovery controls.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#020617",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-slate-950 text-slate-100 min-h-[100dvh] flex flex-col">
        {children}
      </body>
    </html>
  );
}
