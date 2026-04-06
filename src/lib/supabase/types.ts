export type LeadStatus =
  | "new"
  | "qualified"
  | "rejected"
  | "contacted"
  | "intro_sent"
  | "in_process"
  | "closed";

export type DealStatus = "draft" | "live" | "archived";

export interface SellerLead {
  id: string;
  created_at: string;
  locale: string;
  full_name: string;
  email: string;
  company_name: string;
  website: string | null;
  country: string;
  business_type: string;
  industry: string | null;
  monthly_revenue: number | null;
  monthly_profit: number | null;
  annual_revenue_optional: number | null;
  team_size: number | null;
  asking_price: number | null;
  reason_for_selling: string | null;
  additional_notes: string | null;
  consent_checkbox: boolean;
  status: LeadStatus;
}

export interface BuyerLead {
  id: string;
  created_at: string;
  locale: string;
  full_name: string;
  email: string;
  firm_name_optional: string | null;
  buyer_type: string;
  website_or_linkedin_optional: string | null;
  preferred_geographies: string[];
  preferred_sectors: string[];
  min_check_size: number | null;
  max_check_size: number | null;
  target_revenue_range: string | null;
  acquisition_interest: string | null;
  additional_notes: string | null;
  consent_checkbox: boolean;
  status: LeadStatus;
}

export interface Deal {
  id: string;
  created_at: string;
  updated_at: string;
  locale: string;
  company_code_name: string;
  title: string;
  country: string;
  sector: string;
  business_type: string | null;
  monthly_revenue: number | null;
  monthly_profit: number | null;
  annual_revenue: number | null;
  asking_price: number | null;
  summary: string | null;
  teaser: string | null;
  is_public: boolean;
  status: DealStatus;
}
