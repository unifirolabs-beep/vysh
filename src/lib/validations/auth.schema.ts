import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const phoneOtpSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number format invalid"),
});

export const verifyOtpSchema = z.object({
  phoneNumber: z.string().min(10, "Invalid phone number"),
  code: z.string().min(4, "OTP must be at least 4 digits").max(6, "OTP format invalid"),
});
