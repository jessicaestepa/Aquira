import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";
import { toCsv } from "@/lib/csv";

const HEADERS = [
  "id", "created_at", "locale", "full_name", "email", "company_name",
  "website", "country", "business_type", "industry", "monthly_revenue",
  "monthly_profit", "annual_revenue_optional", "team_size", "asking_price",
  "reason_for_selling", "additional_notes", "status",
];

export async function GET() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("akira_admin_auth");
  if (auth?.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("seller_leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }

  const csv = toCsv(HEADERS, data ?? []);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="akira-sellers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
