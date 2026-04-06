import { z } from "zod/v4";

export const sellerSchema = z.object({
  locale: z.string(),
  full_name: z.string().min(1, "Required"),
  email: z.email("Invalid email"),
  company_name: z.string().min(1, "Required"),
  website: z.string().url().optional().or(z.literal("")),
  country: z.string().min(1, "Required"),
  business_type: z.string().min(1, "Required"),
  industry: z.string().optional().or(z.literal("")),
  monthly_revenue: z.coerce.number().nonnegative().optional(),
  monthly_profit: z.coerce.number().optional(),
  annual_revenue_optional: z.coerce.number().nonnegative().optional(),
  team_size: z.coerce.number().int().nonnegative().optional(),
  asking_price: z.coerce.number().nonnegative().optional(),
  reason_for_selling: z.string().optional().or(z.literal("")),
  additional_notes: z.string().optional().or(z.literal("")),
  consent_checkbox: z.literal(true, {
    error: "You must consent to continue",
  }),
});

export type SellerFormData = z.infer<typeof sellerSchema>;
