"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { submitSellerForm } from "@/lib/actions/seller";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

interface SellerFormProps {
  locale: Locale;
  dict: Dictionary;
}

const countries = [
  "mexico", "brazil", "colombia", "chile", "argentina", "peru", "other",
] as const;

const businessTypes = [
  "saas", "ecommerce", "agency", "marketplace", "fintech", "healthtech", "edtech", "other",
] as const;

export function SellerForm({ locale, dict }: SellerFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [consent, setConsent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (consent) {
      formData.set("consent_checkbox", "on");
    } else {
      formData.delete("consent_checkbox");
    }

    const result = await submitSellerForm(formData);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || dict.common.error);
    }
    setLoading(false);
  }

  const t = dict.sell;

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5">
          <CheckCircle className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">{dict.thank_you.title}</h2>
        <p className="mt-3 text-muted-foreground">{t.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="locale" value={locale} />

      <p className="text-sm text-muted-foreground border-l-2 border-primary/30 pl-3">
        {t.note}
      </p>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="full_name">{t.fields.full_name} *</Label>
          <Input id="full_name" name="full_name" required placeholder={t.placeholders.full_name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t.fields.email} *</Label>
          <Input id="email" name="email" type="email" required placeholder={t.placeholders.email} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company_name">{t.fields.company_name} *</Label>
          <Input id="company_name" name="company_name" required placeholder={t.placeholders.company_name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">{t.fields.website}</Label>
          <Input id="website" name="website" type="url" placeholder={t.placeholders.website} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">{t.fields.country} *</Label>
          <select
            id="country"
            name="country"
            required
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">{dict.common.select_country}</option>
            {countries.map((c) => (
              <option key={c} value={c}>{dict.common.countries[c]}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="business_type">{t.fields.business_type} *</Label>
          <select
            id="business_type"
            name="business_type"
            required
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">{dict.common.select_type}</option>
            {businessTypes.map((bt) => (
              <option key={bt} value={bt}>{dict.common.business_types[bt]}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry">{t.fields.industry}</Label>
          <Input id="industry" name="industry" placeholder={t.placeholders.industry} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="team_size">{t.fields.team_size}</Label>
          <Input id="team_size" name="team_size" type="number" min="0" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="monthly_revenue">{t.fields.monthly_revenue}</Label>
          <Input id="monthly_revenue" name="monthly_revenue" type="number" min="0" step="0.01" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="monthly_profit">{t.fields.monthly_profit}</Label>
          <Input id="monthly_profit" name="monthly_profit" type="number" step="0.01" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="annual_revenue_optional">{t.fields.annual_revenue}</Label>
          <Input id="annual_revenue_optional" name="annual_revenue_optional" type="number" min="0" step="0.01" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="asking_price">{t.fields.asking_price}</Label>
          <Input id="asking_price" name="asking_price" type="number" min="0" step="0.01" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason_for_selling">{t.fields.reason_for_selling}</Label>
        <Textarea id="reason_for_selling" name="reason_for_selling" placeholder={t.placeholders.reason_for_selling} rows={3} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="additional_notes">{t.fields.additional_notes}</Label>
        <Textarea id="additional_notes" name="additional_notes" placeholder={t.placeholders.additional_notes} rows={3} />
      </div>

      <div className="flex items-start gap-3">
        <Checkbox id="consent_checkbox" checked={consent} onCheckedChange={(val) => setConsent(val === true)} />
        <Label htmlFor="consent_checkbox" className="text-sm leading-relaxed">{t.fields.consent} *</Label>
      </div>

      <Button type="submit" className="w-full sm:w-auto" disabled={loading || !consent}>
        {loading ? t.submitting : t.submit}
      </Button>
    </form>
  );
}
