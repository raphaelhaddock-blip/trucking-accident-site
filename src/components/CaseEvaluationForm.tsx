'use client';

import { useActionState } from 'react';
import { submitContactForm, type FormState } from '@/app/contact/actions';
import { stateOptions, accidentTypeOptions } from '@/lib/validation/contact-schema';

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
    ? 'w-full rounded-md border-0 bg-navy-700 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:outline-none'
    : 'w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:outline-none';

  const labelClasses = darkMode
    ? 'block text-sm font-medium text-gray-300 mb-2'
    : 'block text-sm font-medium text-gray-700 mb-2';

  const selectClasses = darkMode
    ? 'w-full rounded-md border-0 bg-navy-700 px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none'
    : 'w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-amber-500 focus:outline-none';

  if (state.success) {
    return (
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-navy-800' : 'bg-white'}`}>
        <div className={`text-center ${darkMode ? '' : 'border border-green-200 bg-green-50 rounded-lg p-6'}`}>
          <svg
            className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-green-500' : 'text-green-600'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Thank You!
          </p>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{state.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-6 ${darkMode ? 'bg-navy-800' : 'bg-white shadow-lg'}`}>
      {title && (
        <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-navy-900'}`}>
          {title}
        </h3>
      )}
      {subtitle && (
        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {subtitle}
        </p>
      )}

      <form action={formAction} className={compact ? 'space-y-3' : 'space-y-4'}>
        <input type="hidden" name="source" value={source} />

        {state.message && !state.success && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 text-red-200 text-sm">
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
        <div className={compact ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'space-y-4'}>
          {/* State */}
          <div>
            <label htmlFor={`state-${source}`} className={labelClasses}>
              State *
            </label>
            <select
              id={`state-${source}`}
              name="state"
              required
              className={selectClasses}
            >
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
            <select
              id={`accidentType-${source}`}
              name="accidentType"
              required
              className={selectClasses}
            >
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
          className="w-full rounded-md bg-amber-500 px-6 py-4 text-lg font-semibold text-navy-900 shadow-lg hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
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

        <p className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          By submitting, you agree to our privacy policy. No fee unless you win.
        </p>
      </form>
    </div>
  );
}
