import type { Metadata } from "next";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Karnataka Congress — Official Digital Platform | ಕರ್ನಾಟಕ ಪ್ರದೇಶ ಕಾಂಗ್ರೆಸ್ ಸಮಿತಿ",
  description:
    "Official digital leadership, governance and citizen engagement platform of the Karnataka Pradesh Congress Committee (KPCC). Documenting executive leadership portfolios, flagship welfare guarantees, and verifiable public service records.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "Karnataka Congress — Official Digital Platform",
    description: "Official executive leadership, verified departmental portfolios, and flagship 5 Guarantees citizen welfare platform.",
    url: "/",
    siteName: "Karnataka Congress Digital Platform",
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
      <body className="min-h-full flex flex-col bg-[#F8F6F2] text-[#17191B]">
        {children}
      </body>
    </html>
  );
}
