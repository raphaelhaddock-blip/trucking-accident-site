import { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';

// Default OG image
const DEFAULT_OG_IMAGE = 'https://cdn.sanity.io/images/54bwni5t/production/8391509ade1b30502407263f03b21aad42eaedcb-1376x768.jpg';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Truck Injury Lawyers. Learn how we collect, use, and protect your personal information.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | Truck Injury Lawyers',
    description: 'Privacy policy for Truck Injury Lawyers. Learn how we collect, use, and protect your personal information.',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1376, height: 768, alt: 'Truck Injury Lawyers - Privacy Policy' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [DEFAULT_OG_IMAGE],
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
            Before sharing your information, we evaluate the attorney&apos;s qualifications and track record
            to ensure they meet our standards for handling truck accident cases.
          </p>
          <p className="mt-4">
            We do not sell your personal information to third parties for marketing purposes.
            We may share information with service providers who assist in operating our website
            and processing your requests, including hosting providers, email service providers,
            and analytics services. These service providers are contractually obligated to protect
            your information and use it only for the purposes we specify.
          </p>
          <p className="mt-4">
            We may also disclose your information when required by law, such as in response to
            a subpoena, court order, or other legal process. We may also disclose information
            when we believe in good faith that disclosure is necessary to protect our rights,
            protect your safety or the safety of others, investigate fraud, or respond to a
            government request.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to improve your experience on our website,
            analyze website traffic, and understand where our visitors come from. You can control
            cookie settings through your browser preferences.
          </p>
          <p className="mt-4">
            <strong>Types of cookies we use:</strong>
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Essential cookies:</strong> Required for basic website functionality, such as page navigation and form submissions.</li>
            <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our website so we can improve our services. We use Google Analytics to collect anonymous usage data.</li>
            <li><strong>Functional cookies:</strong> Remember your preferences and settings to provide a more personalized experience.</li>
            <li><strong>Advertising cookies:</strong> May be used to deliver relevant advertisements and track campaign effectiveness.</li>
          </ul>
          <p>
            Most web browsers allow you to control cookies through their settings. You can typically
            choose to block all cookies, accept all cookies, or receive a notification when a cookie
            is being set. Note that disabling cookies may affect the functionality of our website.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your
            personal information against unauthorized access, alteration, disclosure, or
            destruction. These measures include encryption of data in transit using SSL/TLS
            technology, secure data storage, access controls, and regular security assessments.
          </p>
          <p className="mt-4">
            However, no method of transmission over the Internet or method of electronic storage
            is 100% secure. While we strive to use commercially acceptable means to protect your
            personal information, we cannot guarantee its absolute security. If you have reason
            to believe that your interaction with us is no longer secure, please contact us immediately.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Data Retention</h2>
          <p>
            We retain your personal information only for as long as necessary to fulfill the
            purposes for which it was collected, including to satisfy any legal, accounting,
            or reporting requirements. For case evaluation requests, we typically retain
            information for the duration of the referral process and a reasonable period thereafter
            to address any follow-up questions or issues.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt out of certain data processing activities</li>
            <li>Receive a copy of your personal information in a portable format</li>
            <li>Withdraw consent for processing where consent was the basis for processing</li>
            <li>Object to processing of your personal information</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us using the information provided
            below. We will respond to your request within a reasonable timeframe and in accordance
            with applicable law. Please note that we may need to verify your identity before
            processing certain requests.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">California Privacy Rights</h2>
          <p>
            If you are a California resident, you have additional rights under the California
            Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA). These include:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Right to Know:</strong> You have the right to request information about the categories and specific pieces of personal information we have collected about you, as well as the sources, purposes, and third parties with whom we share that information.</li>
            <li><strong>Right to Delete:</strong> You have the right to request that we delete the personal information we have collected from you, subject to certain exceptions.</li>
            <li><strong>Right to Opt-Out:</strong> You have the right to opt out of the &quot;sale&quot; or &quot;sharing&quot; of your personal information. Note that we do not sell your personal information in the traditional sense.</li>
            <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising any of your privacy rights.</li>
          </ul>
          <p>
            To submit a request or designate an authorized agent to submit a request on your behalf,
            please contact us using the information below.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Children&apos;s Privacy</h2>
          <p>
            Our website and services are not directed to children under the age of 18. We do not
            knowingly collect personal information from children under 18. If you are a parent or
            guardian and believe we may have collected information from your child, please contact
            us immediately, and we will take steps to delete such information.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, our data practices, or wish to
            exercise your privacy rights, please contact us:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>By phone: 1-800-555-0123</li>
            <li>Through our website contact form</li>
            <li>By mail: [Address provided upon request]</li>
          </ul>
          <p>
            We take privacy concerns seriously and will respond to your inquiry as quickly as possible.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices,
            technology, legal requirements, and other factors. We will notify you of any material
            changes by posting the new policy on this page with an updated effective date. We encourage
            you to review this Privacy Policy periodically for the latest information on our privacy practices.
          </p>
        </div>
      </div>
    </div>
  );
}
