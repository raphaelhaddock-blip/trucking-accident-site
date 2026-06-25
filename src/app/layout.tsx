import type { Metadata } from "next";
import { Inter, Newsreader, IBM_Plex_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileStickyCTA from "@/components/MobileStickyCTA";

// Google Analytics Measurement ID - set in Vercel environment variables
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Default OG Image - 18-wheeler truck on highway
const DEFAULT_OG_IMAGE = 'https://trucking-accident-site.vercel.app/brand/og-default.png';

// Body / UI — neutral grotesque with tabular figures for data
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Display / headlines — editorial records serif for authority + gravitas
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

// Eyebrows, stat units, data labels — instrument-panel mono
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://trucking-accident-site.vercel.app"),
  title: {
    default: "18-Wheeler Accident Lawyers | Free Consultation",
    template: "%s",
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
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={`${inter.variable} ${newsreader.variable} ${plexMono.variable} antialiased min-h-screen flex flex-col has-sticky-cta`}
      >
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <MobileStickyCTA />
        {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
      </body>
    </html>
  );
}
