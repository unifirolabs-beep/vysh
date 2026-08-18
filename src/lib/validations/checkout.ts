import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  email: z.email("Please enter a valid email address"),
  address: z.string().min(5, "Street address must be at least 5 characters"),
  landmark: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z
    .string()
    .min(1, "State is required")
    .refine((val) => val !== "Select State", "Please select a state"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  paymentMethod: z.enum(["upi", "netbanking", "wallet", "card"]),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
