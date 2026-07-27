import { z } from 'zod';

export const mongo_id_schema = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId format.');

export const phone_schema = z.object({
  country_code: z
    .string()
    .trim()
    .regex(
      /^\+\d{1,4}$/,
      "Country code must start with '+' followed by 1 to 4 digits."
    ),
  number: z
    .string()
    .trim()
    .regex(/^\d{7,15}$/, 'Phone number must be between 7 and 15 digits.'),
});

export const email_schema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Please enter a valid email address.')
  .max(255, 'Email cannot exceed 255 characters.');

export const full_name_schema = z
  .string()
  .trim()
  .min(2, 'Full name must be at least 2 characters long.')
  .max(50, 'Full name cannot exceed 50 characters.')
  .regex(
    /^[a-zA-Z\s'-]+$/,
    'Name can only contain letters, spaces, hyphens, and apostrophes.'
  );

export const password_schema = z
  .string()
  .min(8, 'Password must be at least 8 characters long.')
  .max(128, 'Password cannot exceed 128 characters.');

export const otp_schema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, 'OTP must be a 6-digit number.');

export const sign_up_schema = z.object({
  full_name: full_name_schema,
  email: email_schema,
  password: password_schema,
  phone: phone_schema,
});

export const sign_in_schema = z
  .object({
    email: email_schema.optional(),
    phone: phone_schema.optional(),
    password: z.string().min(1, 'Password is required.'),
  })
  .refine((data) => data.email || data.phone, {
    message: 'Either email or phone is required for sign in.',
    path: ['email'],
  });

export const update_name_schema = z.object({
  full_name: full_name_schema,
});

export const update_email_schema = z.object({
  new_email: email_schema,
  otp: otp_schema.optional(),
});

export const update_phone_schema = z.object({
  new_phone: phone_schema,
  otp: otp_schema.optional(),
});

export const add_address_schema = z.object({
  tag: z.string().trim().min(1, 'Tag is required (e.g., home, work).'),
  line_1: z.string().trim().min(1, 'Address line 1 is required.'),
  line_2: z.string().trim().optional(),
  landmark: z.string().trim().optional(),
  state: z.string().trim().min(1, 'State is required.'),
  pincode: z.string().trim().min(1, 'Pincode is required.'),
  country: z
    .string()
    .trim()
    .min(1, 'Country is required.')
    .optional()
    .default('india'),
  is_default: z.boolean().optional().default(false),
});

export const update_address_schema = z.object({
  _id: mongo_id_schema,
  tag: z.string().trim().min(1, 'Tag cannot be empty.').optional(),
  line_1: z
    .string()
    .trim()
    .min(1, 'Address line 1 cannot be empty.')
    .optional(),
  line_2: z.string().trim().optional(),
  landmark: z.string().trim().optional(),
  state: z.string().trim().min(1, 'State cannot be empty.').optional(),
  pincode: z.string().trim().min(1, 'Pincode cannot be empty.').optional(),
  country: z.string().trim().min(1, 'Country cannot be empty.').optional(),
  is_default: z.boolean().optional(),
});

export const delete_address_schema = z.object({
  _id: mongo_id_schema,
});

export const delete_account_schema = z.object({
  password: z.string().optional(),
  confirm: z.boolean().optional(),
});

export const refresh_token_schema = z.object({
  refresh_token: z.string().trim().optional(),
});

export const logout_otp_request_schema = z
  .object({
    email: email_schema.optional(),
    phone: phone_schema.optional(),
  })
  .refine((data) => data.email || data.phone, {
    message: 'Either email or phone is required to request logout OTP.',
    path: ['email'],
  });

export const logout_otp_verify_schema = z
  .object({
    email: email_schema.optional(),
    phone: phone_schema.optional(),
    otp: otp_schema,
  })
  .refine((data) => data.email || data.phone, {
    message: 'Either email or phone is required to verify logout OTP.',
    path: ['email'],
  });

export const update_settings_schema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  currency: z.string().trim().min(1, 'Currency cannot be empty.').optional(),
  language: z.string().trim().min(1, 'Language cannot be empty.').optional(),
  notifications: z
    .object({
      email: z.boolean().optional(),
      sms: z.boolean().optional(),
      push: z.boolean().optional(),
    })
    .optional(),
});
