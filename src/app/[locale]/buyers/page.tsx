import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { BuyerForm } from "@/components/forms/buyer-form";

export default async function BuyersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
            {dict.buyers.title}
          </h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            {dict.buyers.subtitle}
          </p>
        </div>
        <BuyerForm locale={locale as Locale} dict={dict} />
      </div>
    </div>
  );
}
