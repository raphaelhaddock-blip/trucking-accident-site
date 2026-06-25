'use client';

import { useActionState } from 'react';
import { submitContactForm, type FormState } from './actions';
import Breadcrumb from '@/components/Breadcrumb';
import CommandHero from '@/components/CommandHero';
import Section from '@/components/ui/Section';
import { stateOptions, accidentTypeOptions } from '@/lib/validation/contact-schema';
import { Phone, ArrowRight, CheckCircle, Clock, ShieldCheck, Scale, Users } from '@/components/ui/Icon';

const initialState: FormState = {
  success: false,
  message: '',
};

const PHONE_NUMBER = '1-800-555-0123';
const PHONE_DISPLAY = '(800) 555-0123';

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

const whyContact = [
  { Icon: CheckCircle, title: '100% Free Consultation', body: 'No cost, no obligation to speak with us' },
  { Icon: ShieldCheck, title: 'No Fee Unless You Win', body: 'We only get paid if we recover for you' },
  { Icon: Scale, title: 'Experienced Truck Accident Attorneys', body: 'Specialized knowledge of FMCSA regulations' },
  { Icon: Clock, title: '24/7 Availability', body: "We're here when you need us" },
];

const inputClasses =
  'w-full rounded-md border border-ink-700 bg-ink-900 px-4 py-3 text-white placeholder-steel-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 focus:outline-none';
const labelClasses = 'block text-sm font-medium text-steel-300 mb-2';

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

  return (
    <>
      {/* JSON-LD Schema — preserved verbatim */}
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

      {/* Hero */}
      <CommandHero
        eyebrow="Free Case Review"
        title="Free Truck Accident Case Evaluation"
        subtitle={
          <>
            Injured in an 18-wheeler accident? Get your free, no-obligation case review today.
            Our experienced attorneys have recovered millions for truck accident victims.
          </>
        }
        breadcrumb={<Breadcrumb items={[{ label: 'Contact' }]} />}
      >
        <a href={`tel:${PHONE_NUMBER}`} className="btn btn-primary">
          <Phone className="h-5 w-5" />
          Call {PHONE_DISPLAY}
        </a>
        <a href="#case-form" className="btn btn-ghost-ink">
          Fill out the form
          <ArrowRight className="h-5 w-5 rotate-90" />
        </a>
      </CommandHero>

      {/* Form + trust */}
      <Section tone="paper-2" id="case-form">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Form */}
          <div className="rounded-2xl border border-ink-700 bg-ink-850 p-6 shadow-lg md:p-8">
            <h2 className="mb-6 text-2xl font-bold text-white">Tell Us About Your Case</h2>

            {state.success ? (
              <div className="rounded-lg border border-green-500/50 bg-green-900/30 p-6 text-center">
                <CheckCircle className="mx-auto mb-4 h-16 w-16 text-amber-500" />
                <p className="mb-2 text-xl font-semibold text-white">Thank You!</p>
                <p className="text-steel-300">{state.message}</p>
              </div>
            ) : (
              <form action={formAction} className="space-y-5">
                {state.message && !state.success && (
                  <div className="rounded-lg border border-signal-500/50 bg-signal-500/10 p-4 text-signal-400">
                    {state.message}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label htmlFor="name" className={labelClasses}>Full Name *</label>
                  <input type="text" id="name" name="name" required className={inputClasses} placeholder="John Smith" />
                  {state.errors?.name && <p className="mt-1 text-sm text-red-400">{state.errors.name[0]}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className={labelClasses}>Phone Number *</label>
                  <input type="tel" id="phone" name="phone" required className={inputClasses} placeholder="(555) 123-4567" />
                  {state.errors?.phone && <p className="mt-1 text-sm text-red-400">{state.errors.phone[0]}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className={labelClasses}>Email Address *</label>
                  <input type="email" id="email" name="email" required className={inputClasses} placeholder="john@example.com" />
                  {state.errors?.email && <p className="mt-1 text-sm text-red-400">{state.errors.email[0]}</p>}
                </div>

                {/* State */}
                <div>
                  <label htmlFor="state" className={labelClasses}>State Where Accident Occurred *</label>
                  <select id="state" name="state" required className={inputClasses}>
                    <option value="">Select a state...</option>
                    {stateOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  {state.errors?.state && <p className="mt-1 text-sm text-red-400">{state.errors.state[0]}</p>}
                </div>

                {/* Accident Type */}
                <div>
                  <label htmlFor="accidentType" className={labelClasses}>Type of Accident *</label>
                  <select id="accidentType" name="accidentType" required className={inputClasses}>
                    <option value="">Select accident type...</option>
                    {accidentTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  {state.errors?.accidentType && <p className="mt-1 text-sm text-red-400">{state.errors.accidentType[0]}</p>}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className={labelClasses}>Describe Your Accident *</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    className={`${inputClasses} resize-none`}
                    placeholder="Please describe what happened, including the date, location, your injuries, and any other relevant details..."
                  />
                  {state.errors?.description && <p className="mt-1 text-sm text-red-400">{state.errors.description[0]}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn btn-primary w-full !py-4 !text-base disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isPending ? (
                    <span className="flex items-center justify-center">
                      <svg className="-ml-1 mr-3 h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Get Free Case Evaluation'
                  )}
                </button>

                <p className="text-center text-xs text-steel-500">
                  By submitting this form, you agree to our privacy policy. Your information will be kept confidential.
                </p>
              </form>
            )}
          </div>

          {/* Trust + info */}
          <div className="space-y-6">
            <div className="card p-8">
              <h3 className="mb-6 text-xl font-bold text-ink-strong">Why Contact Us?</h3>
              <ul className="space-y-5">
                {whyContact.map(({ Icon, title, body }) => (
                  <li key={title} className="flex items-start gap-3">
                    <Icon className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />
                    <div>
                      <strong className="text-ink-strong">{title}</strong>
                      <p className="text-sm text-ink-muted">{body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-ink-900 p-8 text-white">
              <p className="eyebrow eyebrow-on-ink">Contact Information</p>
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="mt-4 flex items-center gap-3 text-lg font-semibold transition-colors hover:text-amber-400"
              >
                <Phone className="h-6 w-6 text-amber-500" />
                {PHONE_DISPLAY}
              </a>
              <p className="mt-4 flex items-center gap-3 text-steel-300">
                <Clock className="h-6 w-6 shrink-0 text-amber-500" />
                Available 24 hours a day, 7 days a week
              </p>
              <div className="mt-6 border-t border-ink-700 pt-6">
                <p className="flex items-start gap-3 text-sm text-steel-400">
                  <Users className="h-5 w-5 shrink-0 text-steel-400" />
                  Serving truck accident victims nationwide. We handle cases in all 50 states.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-line bg-paper-3/40 p-4">
              <p className="text-xs leading-relaxed text-ink-muted">
                <strong>Disclaimer:</strong> The information on this website is for general information purposes only.
                Nothing on this site should be taken as legal advice for any individual case or situation.
                Contacting us does not create an attorney-client relationship.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section tone="white" eyebrow="Questions" title="Frequently Asked Questions" center>
        <div className="mx-auto max-w-3xl space-y-4">
          {contactFaqs.map((faq, index) => (
            <div key={index} className="card signpost p-6">
              <h3 className="mb-2 text-lg font-bold text-ink-strong">{faq.question}</h3>
              <p className="text-ink-muted">{faq.answer}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Final urgency CTA */}
      <section className="relative overflow-hidden bg-ink-950">
        <div className="hazard-strip" />
        <div className="container-page py-16 text-center">
          <p className="eyebrow eyebrow-on-ink justify-center !text-signal-400">
            <Clock className="h-4 w-4" /> Time Limits Apply
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-[length:var(--text-display-md)] text-white">
            Don&apos;t Wait — Statutes of Limitations Restrict Your Time to File
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-steel-200">
            Contact us today for a free evaluation. The sooner you act, the more evidence we can preserve.
          </p>
          <div className="mt-8 flex justify-center">
            <a href={`tel:${PHONE_NUMBER}`} className="btn btn-primary">
              <Phone className="h-5 w-5" />
              Call Now: {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
