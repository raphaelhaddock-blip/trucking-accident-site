'use client';

import { useActionState } from 'react';
import { submitContactForm, type FormState } from '@/app/contact/actions';
import { stateOptions, accidentTypeOptions } from '@/lib/validation/contact-schema';
import { CheckCircle } from '@/components/ui/Icon';

const initialState: FormState = {
  success: false,
  message: '',
};

interface CaseEvaluationFormProps {
  source?: string;
  compact?: boolean;
  darkMode?: boolean;
  title?: string;
  subtitle?: string;
}

export default function CaseEvaluationForm({
  source = 'embedded-form',
  compact = false,
  darkMode = true,
  title = 'Get Your Free Case Review',
  subtitle,
}: CaseEvaluationFormProps) {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

  const inputClasses = darkMode
    ? 'w-full rounded-md border border-ink-700 bg-ink-900 px-4 py-3 text-white placeholder-steel-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 focus:outline-none'
    : 'w-full rounded-md border border-line bg-white px-4 py-3 text-ink-strong placeholder-ink-muted/60 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 focus:outline-none';

  const labelClasses = darkMode
    ? 'block text-sm font-medium text-steel-300 mb-2'
    : 'block text-sm font-medium text-ink-body mb-2';

  const selectClasses = inputClasses;

  const cardClasses = darkMode
    ? 'rounded-2xl border border-ink-700 bg-ink-850 p-6 md:p-7'
    : 'rounded-2xl border border-line bg-white p-6 md:p-7 shadow-md';

  if (state.success) {
    return (
      <div className={cardClasses}>
        <div className={`text-center ${darkMode ? '' : 'rounded-lg border border-green-200 bg-green-50 p-6'}`}>
          <CheckCircle className={`mx-auto mb-4 h-16 w-16 ${darkMode ? 'text-amber-500' : 'text-green-600'}`} />
          <p className={`mb-2 text-xl font-semibold ${darkMode ? 'text-white' : 'text-ink-strong'}`}>
            Thank You!
          </p>
          <p className={darkMode ? 'text-steel-300' : 'text-ink-muted'}>{state.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cardClasses}>
      {title && (
        <h3 className={`mb-1.5 text-xl font-bold ${darkMode ? 'text-white' : 'text-ink-strong'}`}>
          {title}
        </h3>
      )}
      {subtitle && (
        <p className={`mb-5 text-sm ${darkMode ? 'text-steel-400' : 'text-ink-muted'}`}>
          {subtitle}
        </p>
      )}

      <form action={formAction} className={compact ? 'space-y-3' : 'space-y-4'}>
        <input type="hidden" name="source" value={source} />

        {state.message && !state.success && (
          <div
            className={`rounded-lg border p-3 text-sm ${
              darkMode
                ? 'border-signal-500/50 bg-signal-500/10 text-signal-400'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            {state.message}
          </div>
        )}

        {/* Name */}
        <div>
          <label htmlFor={`name-${source}`} className={labelClasses}>
            Full Name *
          </label>
          <input
            type="text"
            id={`name-${source}`}
            name="name"
            required
            className={inputClasses}
            placeholder="John Smith"
          />
          {state.errors?.name && (
            <p className="mt-1 text-sm text-red-400">{state.errors.name[0]}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor={`phone-${source}`} className={labelClasses}>
            Phone Number *
          </label>
          <input
            type="tel"
            id={`phone-${source}`}
            name="phone"
            required
            className={inputClasses}
            placeholder="(555) 123-4567"
          />
          {state.errors?.phone && (
            <p className="mt-1 text-sm text-red-400">{state.errors.phone[0]}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor={`email-${source}`} className={labelClasses}>
            Email Address *
          </label>
          <input
            type="email"
            id={`email-${source}`}
            name="email"
            required
            className={inputClasses}
            placeholder="john@example.com"
          />
          {state.errors?.email && (
            <p className="mt-1 text-sm text-red-400">{state.errors.email[0]}</p>
          )}
        </div>

        {/* State & Accident Type - side by side on larger screens when compact */}
        <div className={compact ? 'grid grid-cols-1 gap-3 sm:grid-cols-2' : 'space-y-4'}>
          {/* State */}
          <div>
            <label htmlFor={`state-${source}`} className={labelClasses}>
              State *
            </label>
            <select id={`state-${source}`} name="state" required className={selectClasses}>
              <option value="">Select state...</option>
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
          <div className={compact ? '' : 'mt-4 sm:mt-0'}>
            <label htmlFor={`accidentType-${source}`} className={labelClasses}>
              Accident Type *
            </label>
            <select id={`accidentType-${source}`} name="accidentType" required className={selectClasses}>
              <option value="">Select type...</option>
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
        </div>

        {/* Description */}
        <div>
          <label htmlFor={`description-${source}`} className={labelClasses}>
            {compact ? 'What happened? *' : 'Describe Your Accident *'}
          </label>
          <textarea
            id={`description-${source}`}
            name="description"
            rows={compact ? 3 : 4}
            required
            className={`${inputClasses} resize-none`}
            placeholder={compact ? 'Briefly describe your accident...' : 'Please describe what happened, including the date, location, your injuries, and any other relevant details...'}
          />
          {state.errors?.description && (
            <p className="mt-1 text-sm text-red-400">{state.errors.description[0]}</p>
          )}
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
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Submitting...
            </span>
          ) : (
            'Get Free Case Review'
          )}
        </button>

        <p className={`text-center text-xs ${darkMode ? 'text-steel-500' : 'text-ink-muted'}`}>
          By submitting, you agree to our privacy policy. No fee unless you win.
        </p>
      </form>
    </div>
  );
}
