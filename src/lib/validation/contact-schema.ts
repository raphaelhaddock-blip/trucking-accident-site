import { z } from 'zod';
import { ACCIDENT_SLUGS } from '@/lib/accidents-content/types';
import { STATE_SLUGS } from '@/lib/states-content/types';

// Phone validation regex - accepts common US phone formats
const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),

  phone: z
    .string()
    .regex(phoneRegex, 'Please enter a valid phone number'),

  email: z
    .string()
    .email('Please enter a valid email address'),

  state: z
    .string()
    .min(1, 'Please select a state'),

  accidentType: z
    .string()
    .min(1, 'Please select an accident type'),

  description: z
    .string()
    .min(20, 'Please provide at least 20 characters describing your situation')
    .max(2000, 'Description must be less than 2000 characters'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Export lists for form dropdowns
export const stateOptions = STATE_SLUGS.map(slug => ({
  value: slug,
  label: slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}));

export const accidentTypeOptions = ACCIDENT_SLUGS.map(slug => ({
  value: slug,
  label: slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}));
