import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "18-Wheeler Accident Lawyers | Free Consultation",
    template: "%s | 18-Wheeler Accident Lawyers",
  },
  description:
    "Injured in an 18-wheeler crash? Our truck accident lawyers fight for maximum compensation. Free consultation. No fee unless you win. Call now.",
  keywords: [
    "18 wheeler accident lawyer",
    "truck accident attorney",
    "semi truck crash lawyer",
    "trucking accident lawyer",
    "big rig accident attorney",
  ],
  authors: [{ name: "18-Wheeler Lawyers" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "18-Wheeler Accident Lawyers",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
