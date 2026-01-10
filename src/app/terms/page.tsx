import { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';

// Default OG image
const DEFAULT_OG_IMAGE = 'https://cdn.sanity.io/images/54bwni5t/production/8391509ade1b30502407263f03b21aad42eaedcb-1376x768.jpg';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for Truck Injury Lawyers. Read our terms and conditions for using our legal referral services.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms of Service | Truck Injury Lawyers',
    description: 'Terms of service for Truck Injury Lawyers. Read our terms and conditions for using our legal referral services.',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1376, height: 768, alt: 'Truck Injury Lawyers - Terms of Service' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [DEFAULT_OG_IMAGE],
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
            By accessing and using the Truck Injury Lawyers website, you accept and agree
            to be bound by these Terms of Service. If you do not agree to these terms, please
            do not use our website or services.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Nature of Our Service</h2>
          <p>
            Truck Injury Lawyers operates as a legal referral service. We connect individuals
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
            about the outcome of any legal matter. The information provided on this website about
            settlements, verdicts, and case results is intended for general informational purposes
            only and should not be construed as a promise or guarantee of similar results in your case.
          </p>
          <p className="mt-4">
            The outcome of your case will depend on numerous factors, including the specific facts
            of your accident, the severity of your injuries, the evidence available, the applicable
            law in your jurisdiction, the parties involved, and many other variables unique to your
            situation. An attorney can provide you with a more accurate assessment after reviewing
            the details of your case.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Information Accuracy</h2>
          <p>
            While we strive to provide accurate and up-to-date information about truck accident law,
            FMCSA regulations, state-specific laws, and related topics, this information is provided
            for educational purposes only and should not be relied upon as legal advice. Laws change
            frequently, regulations are updated, and court interpretations evolve. Information on this
            website may become outdated without notice.
          </p>
          <p className="mt-4">
            Always consult with a qualified attorney about your specific situation. The general
            information provided here cannot substitute for personalized legal advice from an
            attorney who understands the particular facts and circumstances of your case and the
            current state of the law in your jurisdiction.
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
            To the fullest extent permitted by law, Truck Injury Lawyers shall not be liable
            for any indirect, incidental, special, consequential, or punitive damages resulting from
            your use of or inability to use our website or services. This includes but is not limited
            to damages for loss of profits, goodwill, data, or other intangible losses, even if we
            have been advised of the possibility of such damages.
          </p>
          <p className="mt-4">
            Our total liability shall not exceed the amount you paid to use our services (if any).
            Some jurisdictions do not allow the exclusion or limitation of incidental or consequential
            damages, so these limitations may not apply to you. In such jurisdictions, our liability
            is limited to the greatest extent permitted by law.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Truck Injury Lawyers, its officers,
            directors, employees, agents, and affiliates from and against any and all claims, damages,
            obligations, losses, liabilities, costs, and expenses (including reasonable attorney&apos;s fees)
            arising from: (a) your use of the website or services; (b) your violation of these Terms;
            (c) your violation of any rights of another party; or (d) any claim that information you
            provided caused damage to a third party.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, images, audio clips,
            digital downloads, data compilations, and software, is the property of Truck Injury
            Lawyers or our content providers and is protected by United States and international
            copyright, trademark, and other intellectual property laws.
          </p>
          <p className="mt-4">
            You may not reproduce, distribute, modify, create derivative works of, publicly display,
            publicly perform, republish, download, store, or transmit any of the material on our
            website without our prior written consent, except for personal, non-commercial use.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites or services that are not owned
            or controlled by Truck Injury Lawyers. We have no control over, and assume no
            responsibility for, the content, privacy policies, or practices of any third-party
            websites or services. We do not warrant the offerings of any of these entities or
            individuals or their websites.
          </p>
          <p className="mt-4">
            You acknowledge and agree that we shall not be responsible or liable, directly or
            indirectly, for any damage or loss caused or alleged to be caused by or in connection
            with the use of or reliance on any such content, goods, or services available on or
            through any such third-party websites or services.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Dispute Resolution</h2>
          <p>
            Any dispute arising out of or relating to these Terms of Service or your use of our
            website or services shall first be attempted to be resolved through good-faith negotiations.
            If the dispute cannot be resolved through negotiations within thirty (30) days, either
            party may pursue resolution through binding arbitration or small claims court, as appropriate.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Severability</h2>
          <p>
            If any provision of these Terms of Service is held to be invalid, illegal, or unenforceable
            by a court of competent jurisdiction, such invalidity, illegality, or unenforceability
            shall not affect any other provision of these Terms, which shall remain in full force
            and effect. The invalid or unenforceable provision shall be modified to the minimum
            extent necessary to make it valid and enforceable.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time at our sole discretion.
            Changes will be effective immediately upon posting on this page with an updated effective
            date. Your continued use of the website after changes constitutes your acceptance of the
            modified terms. We encourage you to review these Terms periodically to stay informed of
            any updates.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Governing Law</h2>
          <p>
            These Terms of Service shall be governed by and construed in accordance with the laws
            of the United States and the state in which our principal place of business is located,
            without regard to conflict of law principles. You agree to submit to the personal and
            exclusive jurisdiction of the courts located within that state for resolution of any
            disputes arising from these Terms.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Contact</h2>
          <p>
            If you have questions about these Terms of Service, please contact us:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>By phone: 1-800-555-0123</li>
            <li>Through our website contact page</li>
            <li>By mail: [Address provided upon request]</li>
          </ul>
          <p>
            We are committed to addressing any concerns you may have about these Terms or our services.
          </p>
        </div>
      </div>
    </div>
  );
}
