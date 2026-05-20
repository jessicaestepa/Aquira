import type { ContentPillar, ContentStatus, ContentType } from "@/lib/supabase/types";

export const CONTENT_STATUSES: ContentStatus[] = [
  "idea",
  "draft",
  "scheduled",
  "published",
  "archived",
];

export const CONTENT_STATUS_LABELS: Record<ContentStatus, string> = {
  idea: "Idea",
  draft: "Borrador",
  scheduled: "Programado",
  published: "Publicado",
  archived: "Archivado",
};

export const CONTENT_TYPES: ContentType[] = [
  "linkedin",
  "newsletter",
  "blog",
  "video",
  "lp_update",
  "twitter",
  "other",
];

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  linkedin: "LinkedIn",
  newsletter: "Newsletter",
  blog: "Blog",
  video: "Video",
  lp_update: "Update LP",
  twitter: "X / Twitter",
  other: "Otro",
};

export const CONTENT_PILLARS: ContentPillar[] = [
  "thesis",
  "dealflow",
  "fundraising",
  "portfolio",
  "thought_leadership",
  "other",
];

export const CONTENT_PILLAR_LABELS: Record<ContentPillar, string> = {
  thesis: "Tesis de inversión",
  dealflow: "Dealflow",
  fundraising: "Fundraising",
  portfolio: "Portafolio",
  thought_leadership: "Thought leadership",
  other: "General",
};

export const CONTENT_STATUS_COLORS: Record<ContentStatus, string> = {
  idea: "border-slate-300 bg-slate-50 text-slate-800",
  draft: "border-amber-300/50 bg-amber-50 text-amber-950",
  scheduled: "border-sky-300/50 bg-sky-50 text-sky-950",
  published: "border-emerald-300/50 bg-emerald-50 text-emerald-950",
  archived: "border-border bg-muted text-muted-foreground",
};
