import { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'Legal Disclaimer',
  description: 'Legal disclaimer for Truck Injury Advocate. Important information about our referral service and attorney advertising.',
  alternates: {
    canonical: '/disclaimer',
  },
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Legal Disclaimer' },
          ]}
        />

        <h1 className="text-4xl font-bold text-navy-900 mb-8">Legal Disclaimer</h1>

        <div className="prose prose-lg max-w-none text-gray-700">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-8">
            <p className="font-bold text-navy-900">IMPORTANT NOTICE</p>
            <p className="mt-2">
              This website is an ADVERTISEMENT for legal services. The information on this
              website is for general informational purposes only and does not constitute legal advice.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">No Attorney-Client Relationship</h2>
          <p>
            Viewing this website, submitting a contact form, or calling our phone number does NOT
            create an attorney-client relationship. An attorney-client relationship is only
            established when you sign a formal engagement agreement with a specific attorney
            who agrees to represent you.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Referral Service Disclosure</h2>
          <p>
            Truck Injury Advocate is a legal referral service, not a law firm. When you
            contact us, we may share your information with one or more attorneys or law firms
            in our network who handle truck accident cases. These attorneys are independent
            practitioners who make their own decisions about whether to accept your case.
          </p>
          <p className="mt-4">
            We may receive compensation from attorneys who receive referrals through our service.
            Any such compensation does not increase the cost of legal services to you.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">No Guarantee of Results</h2>
          <p>
            <strong>PRIOR RESULTS DO NOT GUARANTEE A SIMILAR OUTCOME.</strong> Every truck accident
            case is different. The outcome of any case depends on a variety of factors unique to
            that case. Information about past verdicts and settlements on this website is provided
            for informational purposes only and should not be construed as a promise or guarantee
            of any particular result in your case.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Not Legal Advice</h2>
          <p>
            The information provided on this website, including articles about truck accident law,
            FMCSA regulations, and personal injury claims, is intended to be general educational
            information. It is not intended as legal advice for your specific situation. Laws vary
            by state and change over time. You should consult with a qualified attorney licensed
            in your state about your specific legal questions.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Statute of Limitations Warning</h2>
          <p className="bg-red-50 border-l-4 border-red-500 p-4">
            <strong>TIME LIMITS APPLY TO LEGAL CLAIMS.</strong> Every state has laws called
            &quot;statutes of limitations&quot; that set deadlines for filing lawsuits. If you miss
            these deadlines, you may lose your right to recover compensation forever. Do not
            delay in consulting with an attorney about your truck accident claim.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">State-Specific Notices</h2>
          <p>
            This website may be considered attorney advertising in some states. The choice of a
            lawyer is an important decision and should not be based solely on advertisements.
            Free consultations do not necessarily mean free representation. Fee arrangements
            vary by attorney and case.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Accuracy of Information</h2>
          <p>
            While we make reasonable efforts to ensure the information on this website is accurate
            and current, we make no warranties or representations about the accuracy, completeness,
            or timeliness of any information provided. Laws, regulations, and legal standards
            change frequently, and information may become outdated.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">External Links</h2>
          <p>
            This website may contain links to external websites, including government agencies
            like the FMCSA, court systems, and other resources. We are not responsible for the
            content or accuracy of any external websites. Links are provided for convenience only.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Jurisdiction</h2>
          <p>
            The attorneys in our referral network are licensed in various states. Not all
            attorneys are licensed to practice in all states. When you contact us, we will
            attempt to connect you with an attorney licensed in the state where your accident
            occurred or where you reside.
          </p>

          <h2 className="text-2xl font-bold text-navy-900 mt-8 mb-4">Contact Information</h2>
          <p>
            If you have questions about this disclaimer or our services, please contact us
            at 1-800-555-0123.
          </p>
        </div>
      </div>
    </div>
  );
}
