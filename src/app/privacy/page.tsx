import { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for 18-Wheeler Accident Lawyers. Learn how we collect, use, and protect your personal information.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Privacy Policy' },
          ]}
        />

        <h1 className="text-4xl font-bold text-navy-900 mb-8">Privacy Policy</h1>

        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="text-gray-600 mb-8">
            <strong>Last Updated:</strong> January 2026
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Information We Collect</h2>
          <p>
            When you use our website or contact us for a free case evaluation, we may collect
            the following information:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Name and contact information (phone number, email address)</li>
            <li>Details about your accident and injuries</li>
            <li>Location information (city, state)</li>
            <li>Information about the trucking company or parties involved</li>
            <li>Website usage data through cookies and analytics</li>
          </ul>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Connect you with qualified truck accident attorneys in your area</li>
            <li>Respond to your case evaluation request</li>
            <li>Improve our website and services</li>
            <li>Communicate with you about your inquiry</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Information Sharing</h2>
          <p>
            We are a legal referral service. When you submit a case evaluation request, your
            information may be shared with one or more attorneys or law firms who may be able
            to assist you. These attorneys are independent practitioners, not employees of our service.
          </p>
          <p className="mt-4">
            We do not sell your personal information to third parties for marketing purposes.
            We may share information with service providers who assist in operating our website
            and processing your requests.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to improve your experience on our website,
            analyze website traffic, and understand where our visitors come from. You can control
            cookie settings through your browser preferences.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your
            personal information against unauthorized access, alteration, disclosure, or
            destruction. However, no method of transmission over the Internet is 100% secure.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt out of certain data processing activities</li>
          </ul>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or our data practices, please
            contact us through our website or call us at 1-800-555-0123.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any
            material changes by posting the new policy on this page with an updated effective date.
          </p>
        </div>
      </div>
    </div>
  );
}
