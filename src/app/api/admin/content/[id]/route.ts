import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { supabaseAdmin } from "@/lib/supabase/client";
import type { ContentItem, ContentStatus } from "@/lib/supabase/types";
import { CONTENT_STATUSES } from "@/lib/content/constants";

const STATUS_SET = new Set<string>(CONTENT_STATUSES);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdminApi())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};

  if (typeof body.title === "string" && body.title.trim()) patch.title = body.title.trim();
  if (typeof body.content_type === "string") patch.content_type = body.content_type;
  if (typeof body.status === "string" && STATUS_SET.has(body.status)) {
    patch.status = body.status;
    if (body.status === "published" && body.published_at === undefined) {
      patch.published_at = new Date().toISOString();
    }
  }
  if (body.pillar === null || typeof body.pillar === "string") patch.pillar = body.pillar;
  if (body.channel === null || typeof body.channel === "string") patch.channel = body.channel;
  if (body.notes === null || typeof body.notes === "string") patch.notes = body.notes;
  if (body.publish_url === null || typeof body.publish_url === "string") {
    patch.publish_url = body.publish_url;
  }
  if (body.scheduled_for === null || typeof body.scheduled_for === "string") {
    patch.scheduled_for = body.scheduled_for;
  }
  if (body.published_at === null || typeof body.published_at === "string") {
    patch.published_at = body.published_at;
  }
  if (Array.isArray(body.tags)) {
    patch.tags = body.tags.filter((t): t is string => typeof t === "string");
  }
  if (typeof body.sort_order === "number") patch.sort_order = body.sort_order;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("content_items").update(patch).eq("id", id);
  if (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }

  const { data: all } = await supabaseAdmin
    .from("content_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  return NextResponse.json({ items: (all ?? []) as ContentItem[] });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdminApi())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { error } = await supabaseAdmin.from("content_items").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }

  const { data: all } = await supabaseAdmin
    .from("content_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  return NextResponse.json({ items: (all ?? []) as ContentItem[] });
}
