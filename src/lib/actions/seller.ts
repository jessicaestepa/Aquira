"use server";

import { sellerSchema } from "@/lib/schemas/seller";
import { supabaseAdmin } from "@/lib/supabase/client";
import { getResend, notificationEmail } from "@/lib/email/resend";
import { sellerEmailHtml } from "@/lib/email/templates";

export async function submitSellerForm(formData: FormData) {
  const raw = {
    locale: formData.get("locale"),
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    company_name: formData.get("company_name"),
    website: formData.get("website") || undefined,
    country: formData.get("country"),
    business_type: formData.get("business_type"),
    industry: formData.get("industry") || undefined,
    monthly_revenue: formData.get("monthly_revenue") || undefined,
    monthly_profit: formData.get("monthly_profit") || undefined,
    annual_revenue_optional:
      formData.get("annual_revenue_optional") || undefined,
    team_size: formData.get("team_size") || undefined,
    asking_price: formData.get("asking_price") || undefined,
    reason_for_selling: formData.get("reason_for_selling") || undefined,
    additional_notes: formData.get("additional_notes") || undefined,
    consent_checkbox: formData.get("consent_checkbox") === "on",
  };

  const result = sellerSchema.safeParse(raw);

  if (!result.success) {
    return { success: false, error: "Validation failed. Please check your inputs." };
  }

  const { error } = await supabaseAdmin
    .from("seller_leads")
    .insert(result.data);

  if (error) {
    console.error("Seller insert error:", error);
    return { success: false, error: "Failed to submit. Please try again." };
  }

  // Send notification email (fire-and-forget, don't block the user)
  try {
    const resend = getResend();
    if (resend && notificationEmail) {
      await resend.emails.send({
        from: "Akira <onboarding@resend.dev>",
        to: notificationEmail,
        subject: "New seller submission - Akira",
        html: sellerEmailHtml(result.data),
      });
    }
  } catch (emailError) {
    console.error("Seller notification email error:", emailError);
  }

  return { success: true };
}
