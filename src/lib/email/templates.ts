import type { SellerFormData } from "@/lib/schemas/seller";
import type { BuyerFormData } from "@/lib/schemas/buyer";

function formatCurrency(value?: number) {
  if (!value) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function row(label: string, value: string | number | boolean | undefined | null) {
  const display = value === undefined || value === null || value === ""
    ? "—"
    : String(value);
  return `<tr><td style="padding:6px 12px 6px 0;color:#666;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0;vertical-align:top">${display}</td></tr>`;
}

export function sellerEmailHtml(data: SellerFormData): string {
  return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
  <h2 style="font-size:20px;font-weight:600;margin-bottom:4px">New Seller Submission</h2>
  <p style="color:#666;font-size:14px;margin-top:0">A new company has been submitted on Akira.</p>
  <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0" />
  <table style="font-size:14px;border-collapse:collapse;width:100%">
    ${row("Name", data.full_name)}
    ${row("Email", data.email)}
    ${row("Company", data.company_name)}
    ${row("Website", data.website)}
    ${row("Country", data.country)}
    ${row("Business type", data.business_type)}
    ${row("Industry", data.industry)}
    ${row("Monthly revenue", formatCurrency(data.monthly_revenue))}
    ${row("Monthly profit", formatCurrency(data.monthly_profit))}
    ${row("Annual revenue", formatCurrency(data.annual_revenue_optional))}
    ${row("Team size", data.team_size)}
    ${row("Asking price", formatCurrency(data.asking_price))}
    ${row("Reason for selling", data.reason_for_selling)}
    ${row("Notes", data.additional_notes)}
    ${row("Locale", data.locale)}
  </table>
  <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0" />
  <p style="color:#999;font-size:12px">This is an automated notification from Akira.</p>
</div>`;
}

export function buyerEmailHtml(data: BuyerFormData): string {
  return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
  <h2 style="font-size:20px;font-weight:600;margin-bottom:4px">New Buyer Submission</h2>
  <p style="color:#666;font-size:14px;margin-top:0">A new buyer has requested access on Akira.</p>
  <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0" />
  <table style="font-size:14px;border-collapse:collapse;width:100%">
    ${row("Name", data.full_name)}
    ${row("Email", data.email)}
    ${row("Firm", data.firm_name_optional)}
    ${row("Buyer type", data.buyer_type)}
    ${row("Website / LinkedIn", data.website_or_linkedin_optional)}
    ${row("Geographies", data.preferred_geographies?.join(", "))}
    ${row("Sectors", data.preferred_sectors?.join(", "))}
    ${row("Min check size", formatCurrency(data.min_check_size))}
    ${row("Max check size", formatCurrency(data.max_check_size))}
    ${row("Target revenue range", data.target_revenue_range)}
    ${row("Acquisition interest", data.acquisition_interest)}
    ${row("Notes", data.additional_notes)}
    ${row("Locale", data.locale)}
  </table>
  <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0" />
  <p style="color:#999;font-size:12px">This is an automated notification from Akira.</p>
</div>`;
}
