import type { Metadata } from "next";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "UCreates Leadership Studio — Karnataka Edition",
  description:
    "A structured, source-aware digital publication platform documenting public leadership, career milestones, and verified service records across Karnataka, India.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "UCreates Leadership Studio — Karnataka Edition",
    description: "Public Leadership. Clearly Documented. Verified records and sourced public milestones.",
    url: "/",
    siteName: "UCreates Leadership Studio",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#F7F7F4] text-[#191A1C]">
        {children}
      </body>
    </html>
  );
}
