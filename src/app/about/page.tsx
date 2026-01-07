import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'About Us | Truck Accident Legal Referral Service',
  description: 'Learn about Truck Injury Lawyers, a legal referral service connecting truck accident victims with experienced attorneys nationwide.',
  alternates: {
    canonical: '/about',
  },
};

const PHONE_NUMBER = '1-800-555-0123';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-navy-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'About Us' },
            ]}
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
          <p className="text-xl text-gray-300">
            Connecting truck accident victims with experienced attorneys who fight
            for maximum compensation.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Truck Injury Lawyers exists for one purpose: to help victims of
            devastating truck accidents find the legal representation they deserve.
            When an 80,000-pound semi-truck collides with a passenger vehicle, the
            results are often catastrophic. Victims face mounting medical bills,
            lost wages, and complex legal battles against well-funded trucking companies.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            We believe that every truck accident victim deserves access to experienced
            legal counsel&mdash;regardless of where they live or their financial situation.
            That&apos;s why we&apos;ve built a nationwide network of truck accident attorneys
            who work on a contingency fee basis: you pay nothing unless you win.
          </p>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-8">How Our Referral Service Works</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-navy-900 font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">You Contact Us</h3>
                <p className="text-gray-700">
                  Call our toll-free number or complete our online case evaluation form.
                  Tell us about your accident, injuries, and what happened.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-navy-900 font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">We Review Your Case</h3>
                <p className="text-gray-700">
                  Our team evaluates the details of your accident to understand your
                  situation and identify the type of legal help you need.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-navy-900 font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">We Connect You</h3>
                <p className="text-gray-700">
                  Based on your location and case type, we connect you with an experienced
                  truck accident attorney in our network who can help.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-navy-900 font-bold">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">Free Consultation</h3>
                <p className="text-gray-700">
                  The attorney provides a free, no-obligation consultation to evaluate
                  your case and explain your legal options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Truck Accidents Are Different */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-6">
            Why Truck Accident Cases Require Specialized Attorneys
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-navy-900 mb-3">Federal Regulations</h3>
              <p className="text-gray-700">
                Trucking companies must follow extensive FMCSA regulations. Violations
                of hours-of-service rules, maintenance requirements, and driver
                qualifications can prove negligence in your case.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-navy-900 mb-3">Multiple Liable Parties</h3>
              <p className="text-gray-700">
                Unlike car accidents, truck crashes often involve multiple defendants:
                the driver, trucking company, cargo loaders, maintenance providers,
                and manufacturers.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-navy-900 mb-3">Critical Evidence</h3>
              <p className="text-gray-700">
                Electronic logging devices, black boxes, driver logs, and inspection
                records can prove your case&mdash;but trucking companies often try to
                hide or destroy this evidence.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-navy-900 mb-3">Higher Stakes</h3>
              <p className="text-gray-700">
                Truck accident injuries are typically more severe, resulting in higher
                medical costs, longer recoveries, and greater compensation potential.
                Insurance companies fight harder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-navy-900 mb-6">Our Commitment to Transparency</h2>
          <p className="text-lg text-gray-700 mb-6">
            We believe you should understand exactly how our service works:
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>We are a referral service, not a law firm.</strong> We connect you
                with independent attorneys who make their own decisions about accepting cases.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>Our service is free to you.</strong> We may receive compensation
                from attorneys in our network, but this does not increase your legal costs.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>No guarantees.</strong> Every case is different. We cannot promise
                any particular outcome. Past results do not guarantee future success.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
              <span className="text-gray-700">
                <strong>Your choice matters.</strong> You are never obligated to hire any
                attorney we refer. The consultation is free with no strings attached.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Legal Help?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            If you or a loved one has been injured in a truck accident, contact us
            for a free, no-obligation case evaluation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="bg-amber-500 text-navy-900 font-bold px-8 py-4 rounded-lg hover:bg-amber-400 transition"
            >
              Call {PHONE_NUMBER}
            </a>
            <Link
              href="/contact"
              className="bg-white text-navy-900 font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition"
            >
              Free Case Evaluation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
