'use server';

import { sanityClient } from '@/lib/sanity/client';
import { contactFormSchema, type ContactFormData } from '@/lib/validation/contact-schema';

export type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function submitContactForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Extract form data
  const rawData = {
    name: formData.get('name') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
    state: formData.get('state') as string,
    accidentType: formData.get('accidentType') as string,
    description: formData.get('description') as string,
  };

  // Validate with Zod
  const validationResult = contactFormSchema.safeParse(rawData);

  if (!validationResult.success) {
    const errors: Record<string, string[]> = {};
    validationResult.error.issues.forEach((issue) => {
      const field = issue.path[0] as string;
      if (!errors[field]) {
        errors[field] = [];
      }
      errors[field].push(issue.message);
    });

    return {
      success: false,
      message: 'Please correct the errors below.',
      errors,
    };
  }

  // Create lead in Sanity
  try {
    const lead = await sanityClient.create({
      _type: 'lead',
      name: validationResult.data.name,
      phone: validationResult.data.phone,
      email: validationResult.data.email,
      state: validationResult.data.state,
      accidentType: validationResult.data.accidentType,
      description: validationResult.data.description,
      submittedAt: new Date().toISOString(),
      status: 'new',
      source: (formData.get('source') as string) || 'contact-page',
    });

    console.log('Lead created:', lead._id);

    return {
      success: true,
      message: 'Thank you! We have received your information and will contact you within 24 hours.',
    };
  } catch (error) {
    console.error('Error creating lead:', error);

    // Check if it's a token/auth error
    if (error instanceof Error && error.message.includes('token')) {
      return {
        success: false,
        message: 'Configuration error. Please try calling us directly.',
      };
    }

    return {
      success: false,
      message: 'Something went wrong. Please try again or call us directly.',
    };
  }
}
