import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Google Analytics Measurement ID - set in Vercel environment variables
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Default OG Image - 18-wheeler truck on highway
const DEFAULT_OG_IMAGE = 'https://cdn.sanity.io/images/54bwni5t/production/8391509ade1b30502407263f03b21aad42eaedcb-1376x768.jpg';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://trucking-accident-site.vercel.app"),
  title: {
    default: "Truck Injury Lawyers | Free Consultation",
    template: "%s | Truck Injury Lawyers",
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
  authors: [{ name: "Truck Injury Lawyers" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Truck Injury Lawyers",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1376,
        height: 768,
        alt: "18-wheeler semi-truck on highway - Truck Injury Lawyers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

// WebSite structured data for search engines
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Truck Injury Lawyers',
  url: 'https://trucking-accident-site.vercel.app',
  description: 'National legal referral service connecting truck accident victims with experienced 18-wheeler accident lawyers.',
  publisher: {
    '@type': 'Organization',
    name: 'Truck Injury Lawyers',
    url: 'https://trucking-accident-site.vercel.app',
    logo: {
      '@type': 'ImageObject',
      url: DEFAULT_OG_IMAGE,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
      </body>
    </html>
  );
}
