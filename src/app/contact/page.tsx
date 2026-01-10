'use client';

import { useActionState } from 'react';
import { submitContactForm, type FormState } from './actions';
import Breadcrumb from '@/components/Breadcrumb';
import { stateOptions, accidentTypeOptions } from '@/lib/validation/contact-schema';

const initialState: FormState = {
  success: false,
  message: '',
};

const contactFaqs = [
  {
    question: 'How quickly will you contact me?',
    answer: 'We aim to respond to all inquiries within 24 hours. For urgent matters, please call us directly at 1-800-555-0123.',
  },
  {
    question: 'Is the consultation really free?',
    answer: 'Yes, absolutely. We offer a 100% free, no-obligation consultation to discuss your case. There is never any cost to speak with us about your accident.',
  },
  {
    question: 'What information should I have ready?',
    answer: 'It helps to have details about the accident (date, location, what happened), information about your injuries and medical treatment, the trucking company name if known, and any photos or police reports you have.',
  },
  {
    question: 'Do I have to pay anything upfront?',
    answer: 'No. We work on a contingency fee basis, which means you pay nothing unless we win your case. Our fee comes from the settlement or verdict we obtain for you.',
  },
  {
    question: 'What if I\'m not sure I have a case?',
    answer: 'That\'s exactly what the free consultation is for. We\'ll review your situation and honestly tell you whether you have a viable case. There\'s no pressure and no obligation.',
  },
];

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'ContactPage',
                '@id': '#contactpage',
                name: 'Contact Us | Free Truck Accident Case Evaluation',
                description: 'Get a free case evaluation for your 18-wheeler accident. Our experienced attorneys are ready to help. No fee unless you win.',
                url: 'https://trucking-accident-site.vercel.app/contact',
              },
              {
                '@type': 'FAQPage',
                '@id': '#faqpage',
                mainEntity: contactFaqs.map((faq) => ({
                  '@type': 'Question',
                  name: faq.question,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer,
                  },
                })),
              },
            ],
          }),
        }}
      />

      {/* Hero Section */}
      <section className="bg-navy-900 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[{ label: 'Contact' }]}
          />

          <div className="mt-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Free Truck Accident Case Evaluation
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Injured in an 18-wheeler accident? Get your free, no-obligation case review today.
              Our experienced attorneys have recovered millions for truck accident victims.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:1-800-555-0123"
                className="inline-flex items-center justify-center rounded-md bg-amber-500 px-8 py-4 text-lg font-semibold text-navy-900 shadow-lg hover:bg-amber-400 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Call 1-800-555-0123
              </a>
              <span className="text-gray-400 self-center">or fill out the form below</span>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-navy-800 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">
                Tell Us About Your Case
              </h2>

              {state.success ? (
                <div className="bg-green-900/50 border border-green-500 rounded-lg p-6 text-center">
                  <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xl text-white font-semibold mb-2">Thank You!</p>
                  <p className="text-gray-300">{state.message}</p>
                </div>
              ) : (
                <form action={formAction} className="space-y-6">
                  {state.message && !state.success && (
                    <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 text-red-200">
                      {state.message}
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full rounded-md border-0 bg-navy-700 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      placeholder="John Smith"
                    />
                    {state.errors?.name && (
                      <p className="mt-1 text-sm text-red-400">{state.errors.name[0]}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="w-full rounded-md border-0 bg-navy-700 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      placeholder="(555) 123-4567"
                    />
                    {state.errors?.phone && (
                      <p className="mt-1 text-sm text-red-400">{state.errors.phone[0]}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full rounded-md border-0 bg-navy-700 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      placeholder="john@example.com"
                    />
                    {state.errors?.email && (
                      <p className="mt-1 text-sm text-red-400">{state.errors.email[0]}</p>
                    )}
                  </div>

                  {/* State */}
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-2">
                      State Where Accident Occurred *
                    </label>
                    <select
                      id="state"
                      name="state"
                      required
                      className="w-full rounded-md border-0 bg-navy-700 px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value="">Select a state...</option>
                      {stateOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {state.errors?.state && (
                      <p className="mt-1 text-sm text-red-400">{state.errors.state[0]}</p>
                    )}
                  </div>

                  {/* Accident Type */}
                  <div>
                    <label htmlFor="accidentType" className="block text-sm font-medium text-gray-300 mb-2">
                      Type of Accident *
                    </label>
                    <select
                      id="accidentType"
                      name="accidentType"
                      required
                      className="w-full rounded-md border-0 bg-navy-700 px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value="">Select accident type...</option>
                      {accidentTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {state.errors?.accidentType && (
                      <p className="mt-1 text-sm text-red-400">{state.errors.accidentType[0]}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                      Describe Your Accident *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      required
                      className="w-full rounded-md border-0 bg-navy-700 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
                      placeholder="Please describe what happened, including the date, location, your injuries, and any other relevant details..."
                    />
                    {state.errors?.description && (
                      <p className="mt-1 text-sm text-red-400">{state.errors.description[0]}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full rounded-md bg-amber-500 px-6 py-4 text-lg font-semibold text-navy-900 shadow-lg hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      'Get Free Case Evaluation'
                    )}
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    By submitting this form, you agree to our privacy policy. Your information will be kept confidential.
                  </p>
                </form>
              )}
            </div>

            {/* Trust Elements & Info */}
            <div className="space-y-8">
              {/* Why Choose Us */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-navy-900 mb-6">
                  Why Contact Us?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-navy-900 font-bold text-sm mr-3 mt-0.5">
                      1
                    </span>
                    <div>
                      <strong className="text-navy-900">100% Free Consultation</strong>
                      <p className="text-gray-600 text-sm">No cost, no obligation to speak with us</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-navy-900 font-bold text-sm mr-3 mt-0.5">
                      2
                    </span>
                    <div>
                      <strong className="text-navy-900">No Fee Unless You Win</strong>
                      <p className="text-gray-600 text-sm">We only get paid if we recover for you</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-navy-900 font-bold text-sm mr-3 mt-0.5">
                      3
                    </span>
                    <div>
                      <strong className="text-navy-900">Experienced Truck Accident Attorneys</strong>
                      <p className="text-gray-600 text-sm">Specialized knowledge of FMCSA regulations</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-navy-900 font-bold text-sm mr-3 mt-0.5">
                      4
                    </span>
                    <div>
                      <strong className="text-navy-900">24/7 Availability</strong>
                      <p className="text-gray-600 text-sm">We&apos;re here when you need us</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div className="bg-navy-900 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <a
                    href="tel:1-800-555-0123"
                    className="flex items-center text-lg hover:text-amber-400 transition-colors"
                  >
                    <svg className="w-6 h-6 mr-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    1-800-555-0123
                  </a>
                  <p className="flex items-center text-gray-300">
                    <svg className="w-6 h-6 mr-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                    </svg>
                    Available 24 hours a day, 7 days a week
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-navy-700">
                  <p className="text-sm text-gray-400">
                    Serving truck accident victims nationwide. We handle cases in all 50 states.
                  </p>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-xs text-gray-500">
                  <strong>Disclaimer:</strong> The information on this website is for general information purposes only.
                  Nothing on this site should be taken as legal advice for any individual case or situation.
                  Contacting us does not create an attorney-client relationship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-navy-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {contactFaqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-navy-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-amber-500 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-navy-900 mb-4">
            Don&apos;t Wait - Time Limits Apply
          </h2>
          <p className="text-navy-800 mb-6">
            Statutes of limitations restrict how long you have to file a claim. Contact us today for a free evaluation.
          </p>
          <a
            href="tel:1-800-555-0123"
            className="inline-flex items-center justify-center rounded-md bg-navy-900 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-navy-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            Call Now: 1-800-555-0123
          </a>
        </div>
      </section>
    </>
  );
}
