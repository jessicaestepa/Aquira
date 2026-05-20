import { requireAdminSession } from "@/lib/auth/admin-guard";
import { supabaseAdmin } from "@/lib/supabase/client";
import type { ContentItem } from "@/lib/supabase/types";
import { ContentGrid } from "@/components/admin/content-grid";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  await requireAdminSession();

  const { data, error } = await supabaseAdmin
    .from("content_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
        <p className="font-medium">No se pudo cargar la parrilla de contenido</p>
        <p className="mt-1 text-muted-foreground">
          Ejecuta la migración <code className="text-xs">20260514210000_content_grid.sql</code> en
          Supabase si aún no existe la tabla <code className="text-xs">content_items</code>.
        </p>
      </div>
    );
  }

  return <ContentGrid initialItems={(data ?? []) as ContentItem[]} />;
}
