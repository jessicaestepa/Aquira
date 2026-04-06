import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getPublicDeals } from "@/lib/actions/deals";
import { DealCard } from "@/components/deals/deal-card";

export const revalidate = 60;

export default async function DealsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);
  const deals = await getPublicDeals();

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            {dict.deals.title}
          </h1>
          <p className="mt-3 text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {dict.deals.subtitle}
          </p>
        </div>

        {deals.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            {dict.deals.empty}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {deals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                locale={locale as Locale}
                dict={dict}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
