import { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for Truck Injury Advocate. Read our terms and conditions for using our legal referral services.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Terms of Service' },
          ]}
        />

        <h1 className="text-4xl font-bold text-navy-900 mb-8">Terms of Service</h1>

        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="text-gray-600 mb-8">
            <strong>Last Updated:</strong> January 2026
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Acceptance of Terms</h2>
          <p>
            By accessing and using the Truck Injury Advocate website, you accept and agree
            to be bound by these Terms of Service. If you do not agree to these terms, please
            do not use our website or services.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Nature of Our Service</h2>
          <p>
            Truck Injury Advocate operates as a legal referral service. We connect individuals
            who have been injured in truck accidents with attorneys who may be able to help them.
            Important points to understand:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>We are not a law firm and do not provide legal advice</li>
            <li>No attorney-client relationship is created by using this website</li>
            <li>The attorneys we refer you to are independent practitioners</li>
            <li>Any attorney-client relationship is formed directly with the referred attorney</li>
            <li>We do not guarantee that any attorney will accept your case</li>
          </ul>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">No Guarantee of Results</h2>
          <p>
            Past results do not guarantee future outcomes. Every legal case is different, and the
            results depend on the specific facts and circumstances. We make no promises or guarantees
            about the outcome of any legal matter.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Information Accuracy</h2>
          <p>
            While we strive to provide accurate and up-to-date information about truck accident law,
            FMCSA regulations, and related topics, this information is provided for educational
            purposes only. Laws change, and information may become outdated. Always consult with
            a qualified attorney about your specific situation.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">User Responsibilities</h2>
          <p>When using our website and services, you agree to:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Provide accurate and truthful information</li>
            <li>Not use the website for any unlawful purpose</li>
            <li>Not attempt to interfere with the website&apos;s operation</li>
            <li>Not submit false or misleading information about accidents or injuries</li>
          </ul>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Truck Injury Advocate shall not be liable
            for any indirect, incidental, special, consequential, or punitive damages resulting from
            your use of or inability to use our website or services. Our total liability shall not
            exceed the amount you paid to use our services (if any).
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, and images, is the property
            of Truck Injury Advocate or our content providers and is protected by copyright
            and other intellectual property laws.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We are not responsible for the
            content, privacy practices, or terms of service of any linked websites.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. Changes will be
            effective immediately upon posting. Your continued use of the website after changes
            constitutes acceptance of the modified terms.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Governing Law</h2>
          <p>
            These Terms of Service shall be governed by and construed in accordance with the laws
            of the United States, without regard to conflict of law principles.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Contact</h2>
          <p>
            If you have questions about these Terms of Service, please contact us at 1-800-555-0123
            or through our contact page.
          </p>
        </div>
      </div>
    </div>
  );
}
