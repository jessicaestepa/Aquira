import Link from "next/link";
import { MapPin, TrendingUp, DollarSign, Briefcase } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import type { Deal } from "@/lib/supabase/types";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

interface DealCardProps {
  deal: Deal;
  locale: Locale;
  dict: Dictionary;
}

function formatCurrency(value: number | null) {
  if (!value) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function DealCard({ deal, locale, dict }: DealCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary">{deal.sector}</Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {deal.country}
          </span>
        </div>
        <CardTitle className="text-lg leading-snug">
          {deal.company_code_name}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">{deal.teaser}</p>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-xs">
                {dict.deals.revenue}
              </p>
              <p className="font-medium">
                {formatCurrency(deal.monthly_revenue)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-xs">
                {dict.deals.asking}
              </p>
              <p className="font-medium">
                {formatCurrency(deal.asking_price)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-xs">
                {dict.deals.sector}
              </p>
              <p className="font-medium">{deal.business_type || deal.sector}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground text-xs">
                {dict.deals.profit}
              </p>
              <p className="font-medium">
                {formatCurrency(deal.monthly_profit)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href={`/${locale}/buyers`}
          className={buttonVariants({ className: "w-full" })}
        >
          {dict.deals.request_intro}
        </Link>
      </CardFooter>
    </Card>
  );
}
