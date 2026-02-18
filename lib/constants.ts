export const AGENCY_NAME = process.env.NEXT_PUBLIC_AGENCY_NAME || 'EduAgency';
export const AGENCY_TAGLINE = process.env.NEXT_PUBLIC_AGENCY_TAGLINE || 'Learn. Grow. Succeed.';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const PAYMENT = {
  BKASH: process.env.BKASH_NUMBER || '01XXXXXXXXX',
  NAGAD: process.env.NAGAD_NUMBER || '01XXXXXXXXX',
};

export const SOCIAL = {
  FACEBOOK: process.env.NEXT_PUBLIC_FACEBOOK_URL || '',
  WHATSAPP: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '',
};