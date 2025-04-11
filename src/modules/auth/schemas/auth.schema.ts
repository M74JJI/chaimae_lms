import { z } from "zod";

// Helper regex patterns
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^\+([1-9]{1,4})\d{6,14}$/;
const passwordSpecialChars = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;
const nameRegex =
  /^(?!.*(\s{2}|['-]{2}))[A-Za-zÀ-ÿ]+([ \p{L}'-]+[A-Za-zÀ-ÿ])?$/u;

export const SignupSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, { message: "First name must be at least 2 characters long." })
      .max(50, { message: "First name cannot exceed 50 characters." })
      .regex(nameRegex, {
        message:
          "First name must start and end with a letter. Only letters, spaces, hyphens (-), and apostrophes (') are allowed.",
      }),

    lastName: z
      .string()
      .trim()
      .min(2, { message: "Last name must be at least 2 characters long." })
      .max(50, { message: "Last name cannot exceed 50 characters." })
      .regex(nameRegex, {
        message:
          "Last name must start and end with a letter. Only letters, spaces, hyphens (-), and apostrophes (') are allowed.",
      }),

    email: z
      .string()
      .trim()
      .min(1, { message: "Email address is required." })
      .regex(emailRegex, {
        message: "Please enter a valid email address (e.g., user@example.com).",
      }),

    phoneNumber: z.string().trim().regex(phoneRegex, {
      message:
        "Please enter a valid phone number with the country code (e.g., +1234567890).",
    }),

    password: z
      .string()
      .trim()
      .min(8, { message: "Password must be at least 8 characters long." })
      .max(100, { message: "Password cannot exceed 100 characters." })
      .regex(/[A-Z]/, {
        message:
          "Your password must include at least one uppercase letter (A-Z).",
      })
      .regex(/[a-z]/, {
        message:
          "Your password must include at least one lowercase letter (a-z).",
      })
      .regex(/\d/, {
        message: "Your password must include at least one number (0-9).",
      })
      .regex(passwordSpecialChars, {
        message:
          "Your password must include at least one special character (e.g., !@#$%^&*).",
      })
      .refine((pwd) => !/\s/.test(pwd), {
        message: "Password cannot contain spaces.",
      }),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "The passwords you entered do not match. Please try again.",
    path: ["confirmPassword"],
  });

export const SignInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email address is required." })
    .max(254, { message: "Email address cannot exceed 254 characters." })
    .regex(emailRegex, {
      message: "Please enter a valid email address (e.g., user@example.com).",
    }),

  password: z.string().min(1, { message: "Password is required." }),
});

export const EmailSignInLinkSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email address is required." })
    .max(254, { message: "Email address cannot exceed 254 characters." })
    .regex(emailRegex, {
      message: "Please enter a valid email address (e.g., user@example.com).",
    }),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .trim()
      .min(8, { message: "Password must be at least 8 characters long." })
      .max(100, { message: "Password cannot exceed 100 characters." })
      .regex(/[A-Z]/, {
        message:
          "Your password must include at least one uppercase letter (A-Z).",
      })
      .regex(/[a-z]/, {
        message:
          "Your password must include at least one lowercase letter (a-z).",
      })
      .regex(/\d/, {
        message: "Your password must include at least one number (0-9).",
      })
      .regex(passwordSpecialChars, {
        message:
          "Your password must include at least one special character (e.g., !@#$%^&*).",
      })
      .refine((pwd) => !/\s/.test(pwd), {
        message: "Password cannot contain spaces.",
      }),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "The passwords you entered do not match. Please try again.",
    path: ["confirmPassword"],
  });

export type SignupSchemaType = z.infer<typeof SignupSchema>;
export type SignInSchemaType = z.infer<typeof SignInSchema>;
export type EmailSignInLinkSchemaType = z.infer<typeof EmailSignInLinkSchema>;
export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;
