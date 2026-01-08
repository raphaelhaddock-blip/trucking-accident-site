import { Metadata } from 'next';

// Default OG image
const DEFAULT_OG_IMAGE = 'https://cdn.sanity.io/images/54bwni5t/production/8391509ade1b30502407263f03b21aad42eaedcb-1376x768.jpg';

export const metadata: Metadata = {
  title: 'Free Case Evaluation | Contact Truck Injury Lawyers',
  description:
    'Get a free case evaluation for your 18-wheeler accident. Our experienced attorneys are ready to help. No fee unless you win. Call now or fill out our form.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Free Case Evaluation | Contact Truck Injury Lawyers',
    description: 'Get a free case evaluation for your 18-wheeler accident. Our experienced attorneys are ready to help. No fee unless you win.',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1376, height: 768, alt: 'Free Truck Accident Case Evaluation' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Case Evaluation | Truck Injury Lawyers',
    description: 'Get a free case evaluation for your 18-wheeler accident. No fee unless you win.',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
