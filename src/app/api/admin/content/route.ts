import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { supabaseAdmin } from "@/lib/supabase/client";
import type { ContentItem } from "@/lib/supabase/types";

const createSchema = z.object({
  title: z.string().min(1),
  content_type: z.string().min(1),
  status: z.string().optional(),
  pillar: z.string().nullable().optional(),
  channel: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  publish_url: z.string().nullable().optional(),
  scheduled_for: z.string().nullable().optional(),
  published_at: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
});

export async function GET() {
  if (!(await requireAdminApi())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("content_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to load content" }, { status: 500 });
  }

  return NextResponse.json({ items: (data ?? []) as ContentItem[] });
}

export async function POST(request: Request) {
  if (!(await requireAdminApi())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 422 });
  }

  const b = parsed.data;
  const status = b.status ?? "idea";

  const { data: maxRow } = await supabaseAdmin
    .from("content_items")
    .select("sort_order")
    .eq("status", status)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const sortOrder = (maxRow?.sort_order ?? 0) + 1;

  const { data, error } = await supabaseAdmin
    .from("content_items")
    .insert({
      title: b.title,
      content_type: b.content_type,
      status,
      pillar: b.pillar ?? null,
      channel: b.channel ?? null,
      notes: b.notes ?? null,
      publish_url: b.publish_url ?? null,
      scheduled_for: b.scheduled_for ?? null,
      published_at: b.published_at ?? (status === "published" ? new Date().toISOString() : null),
      tags: b.tags ?? [],
      sort_order: sortOrder,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create content" }, { status: 500 });
  }

  const { data: all } = await supabaseAdmin
    .from("content_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  return NextResponse.json({
    item: data as ContentItem,
    items: (all ?? []) as ContentItem[],
  });
}
