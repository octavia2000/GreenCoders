<<<<<<< HEAD
import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
=======
import { z } from "zod";

// Login validation schema
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
>>>>>>> upstream/main
});

// Register validation schema
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
<<<<<<< HEAD
    .regex(/^\+234\d{10}$/, 'Nigerian phone number must be in format +234XXXXXXXXXX (e.g., +2348158667115)')
    .min(14, 'Phone number must be at least 14 characters (+234XXXXXXXXXX)')
    .max(14, 'Phone number must be exactly 14 characters (+234XXXXXXXXXX)'),
=======
    .regex(/^\+234[\s\-]?\d{3}[\s\-]?\d{3}[\s\-]?\d{4}$/, 'Nigerian phone number must be in format +234 XXX XXX XXXX (e.g., +234 815 866 7115)')
    .refine((val) => {
      // Remove spaces and hyphens to check if it's a valid Nigerian number
      const cleaned = val.replace(/[\s\-]/g, '');
      return cleaned === '+234' + cleaned.slice(4) && cleaned.length === 14;
    }, 'Invalid Nigerian phone number format'),
>>>>>>> upstream/main
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  referralCode: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
<<<<<<< HEAD
    message: 'You must agree to the terms and conditions'
  })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

// Forgot password validation schema
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
});

// Reset password validation schema
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});
=======
    message: 'You must agree to the terms and conditionss',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Forgot password validation schema
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

// Reset password validation schema
export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
>>>>>>> upstream/main

// OTP validation schema
export const otpSchema = z.object({
  otp: z
    .string()
<<<<<<< HEAD
    .min(4, 'OTP must be 4 digits')
    .max(4, 'OTP must be 4 digits')
    .regex(/^\d{4}$/, 'OTP must contain only numbers')
=======
    .min(4, "OTP must be 4 digits")
    .max(4, "OTP must be 4 digits")
    .regex(/^\d{4}$/, "OTP must contain only numbers"),
>>>>>>> upstream/main
});

// Phone number (national part) validation schema
// Accept 4 to 14 digits to cover most national numbers across countries
export const nationalPhoneSchema = z
  .string()
<<<<<<< HEAD
  .min(4, 'Phone number is too short')
  .max(14, 'Phone number is too long')
  .regex(/^\d+$/, 'Phone number must contain only numbers');
=======
  .min(4, "Phone number is too short")
  .max(14, "Phone number is too long")
  .regex(/^\d+$/, "Phone number must contain only numbers");
>>>>>>> upstream/main

// Personal details validation schema
export const personalDetailsSchema = z.object({
  fullName: z
    .string()
<<<<<<< HEAD
    .min(1, 'Full name is required')
    .min(2, 'Full name must be at least 2 characters'),
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  webUser: z
    .string()
    .min(1, 'Web user is required'),
  country: z
    .string()
    .min(1, 'Country is required')
=======
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters"),
  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  webUser: z.string().min(1, "Web user is required"),
  country: z.string().min(1, "Country is required"),
>>>>>>> upstream/main
});

// Search validation schema
export const searchSchema = z.object({
  query: z
    .string()
<<<<<<< HEAD
    .min(1, 'Search query is required')
    .min(2, 'Search query must be at least 2 characters')
    .max(100, 'Search query must be less than 100 characters')
=======
    .min(1, "Search query is required")
    .min(2, "Search query must be at least 2 characters")
    .max(100, "Search query must be less than 100 characters"),
>>>>>>> upstream/main
});

// Contact form validation schema
export const contactSchema = z.object({
  name: z
    .string()
<<<<<<< HEAD
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .min(5, 'Subject must be at least 5 characters'),
  message: z
    .string()
    .min(1, 'Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
=======
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  subject: z
    .string()
    .min(1, "Subject is required")
    .min(5, "Subject must be at least 5 characters"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
>>>>>>> upstream/main
});

// Newsletter signup validation schema
export const newsletterSchema = z.object({
<<<<<<< HEAD
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
=======
  email: z.string().min(1, "Email is required").email("Invalid email address"),
>>>>>>> upstream/main
});

// Password strength checker utility
export const getPasswordStrength = (password) => {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasNumber = /\d/.test(password);
<<<<<<< HEAD
  
  return { hasMinLength, hasUppercase, hasLowercase, hasSpecialChar, hasNumber };
};
=======

  return {
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasSpecialChar,
    hasNumber,
  };
};

// payment validation

export const paymentSchema = z.object({
  method: z.enum(["cash", "paypal", "bank", "card", "google"]),
  cardNumber: z.string().optional(),
  nameOnCard: z.string().optional(),
  expiry: z.string().optional(),
  cvv: z.string().optional(),
});
>>>>>>> upstream/main
