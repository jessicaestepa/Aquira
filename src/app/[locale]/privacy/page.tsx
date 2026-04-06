import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale as Locale);

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-8">
          {dict.privacy.title}
        </h1>
        <div className="prose prose-neutral max-w-none">
          {dict.privacy.content.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className="text-muted-foreground leading-relaxed mb-4"
              dangerouslySetInnerHTML={{
                __html: paragraph.replace(
                  /\*\*(.*?)\*\*/g,
                  "<strong class='text-foreground'>$1</strong>"
                ),
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
