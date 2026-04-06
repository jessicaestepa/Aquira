import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button-variants";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <div className="py-20 sm:py-28">
      <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          {dict.thank_you.title}
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          {dict.thank_you.subtitle}
        </p>
        <Link
          href={`/${locale}`}
          className={buttonVariants({ className: "mt-8" })}
        >
          {dict.thank_you.back_home}
        </Link>
      </div>
    </div>
  );
}
