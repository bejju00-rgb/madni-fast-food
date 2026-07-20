import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^03\d{9}$/, "Enter valid Pakistani phone (03XXXXXXXXX)"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
});

export const signInSchema = z.object({
  phone: z.string().regex(/^03\d{9}$/, "Enter valid Pakistani phone (03XXXXXXXXX)"),
  password: z.string().optional(),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^03\d{9}$/, "Enter valid phone number"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  landmark: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(["JAZZCASH", "EASYPAISA", "CASH_ON_DELIVERY"]),
  couponCode: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  categoryId: z.string(),
  available: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export const dealSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  items: z.array(z.string()).min(1),
  active: z.boolean().default(true),
});

export const couponSchema = z.object({
  code: z.string().min(3).toUpperCase(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().positive(),
  minOrder: z.number().default(0),
  maxUses: z.number().optional(),
  expiresAt: z.string().optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
