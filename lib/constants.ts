/**
 * Centralized application constants.
 * These are primarily driven by environment variables for easy rebranding.
 */

export const AGENCY_NAME = process.env.NEXT_PUBLIC_AGENCY_NAME || 'EduAgency';
export const AGENCY_TAGLINE = process.env.NEXT_PUBLIC_AGENCY_TAGLINE || 'Transforming Education for the Digital Age';

export const PAYMENT_BKASH_NUMBER = process.env.NEXT_PUBLIC_BKASH_NUMBER || '01700-000000';
export const PAYMENT_NAGAD_NUMBER = process.env.NEXT_PUBLIC_NAGAD_NUMBER || '01800-000000';

export const SOCIAL_LINKS = {
  facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || 'https://facebook.com/eduagency',
  whatsapp: process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP || 'https://wa.me/8801700000000',
  github: process.env.NEXT_PUBLIC_SOCIAL_GITHUB || 'https://github.com/eduagency',
  linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || 'https://linkedin.com/company/eduagency'
};

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const SUPPORT_EMAIL = 'support@eduagency.io';