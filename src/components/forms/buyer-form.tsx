"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { submitBuyerForm } from "@/lib/actions/buyer";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

interface BuyerFormProps {
  locale: Locale;
  dict: Dictionary;
}

const countries = [
  "mexico", "brazil", "colombia", "chile", "argentina", "peru", "other",
] as const;

const sectors = [
  "saas", "ecommerce", "fintech", "healthtech", "edtech", "marketplace", "agency", "other",
] as const;

const buyerTypes = [
  "search_fund", "operator", "founder", "private_investor", "family_office", "strategic_buyer", "private_equity", "other",
] as const;

export function BuyerForm({ locale, dict }: BuyerFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [consent, setConsent] = useState(false);
  const [selectedGeos, setSelectedGeos] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);

  function toggleItem(arr: string[], item: string, setter: (v: string[]) => void) {
    setter(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    formData.delete("preferred_geographies");
    formData.delete("preferred_sectors");
    selectedGeos.forEach((g) => formData.append("preferred_geographies", g));
    selectedSectors.forEach((s) => formData.append("preferred_sectors", s));

    if (consent) {
      formData.set("consent_checkbox", "on");
    } else {
      formData.delete("consent_checkbox");
    }

    const result = await submitBuyerForm(formData);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || dict.common.error);
    }
    setLoading(false);
  }

  const t = dict.buyers;

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
          <Label htmlFor="firm_name_optional">{t.fields.firm_name}</Label>
          <Input id="firm_name_optional" name="firm_name_optional" placeholder={t.placeholders.firm_name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="buyer_type">{t.fields.buyer_type} *</Label>
          <select
            id="buyer_type"
            name="buyer_type"
            required
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">{dict.common.select_type}</option>
            {buyerTypes.map((bt) => (
              <option key={bt} value={bt}>{dict.common.buyer_types[bt]}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="website_or_linkedin_optional">{t.fields.website_linkedin}</Label>
          <Input id="website_or_linkedin_optional" name="website_or_linkedin_optional" type="url" placeholder={t.placeholders.website_linkedin} />
        </div>
      </div>

      <div className="space-y-3">
        <Label>{t.fields.preferred_geographies} *</Label>
        <div className="flex flex-wrap gap-2">
          {countries.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggleItem(selectedGeos, c, setSelectedGeos)}
              className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                selectedGeos.includes(c)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-input hover:bg-muted"
              }`}
            >
              {dict.common.countries[c]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label>{t.fields.preferred_sectors} *</Label>
        <div className="flex flex-wrap gap-2">
          {sectors.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleItem(selectedSectors, s, setSelectedSectors)}
              className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                selectedSectors.includes(s)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-input hover:bg-muted"
              }`}
            >
              {dict.common.sectors[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="min_check_size">{t.fields.min_check_size}</Label>
          <Input id="min_check_size" name="min_check_size" type="number" min="0" step="0.01" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max_check_size">{t.fields.max_check_size}</Label>
          <Input id="max_check_size" name="max_check_size" type="number" min="0" step="0.01" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="target_revenue_range">{t.fields.target_revenue_range}</Label>
        <Input id="target_revenue_range" name="target_revenue_range" placeholder={t.placeholders.target_revenue_range} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="acquisition_interest">{t.fields.acquisition_interest}</Label>
        <Textarea id="acquisition_interest" name="acquisition_interest" placeholder={t.placeholders.acquisition_interest} rows={3} />
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
