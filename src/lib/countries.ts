export const countries = [
  "mexico",
  "brazil",
  "colombia",
  "chile",
  "argentina",
  "peru",
  "uruguay",
  "venezuela",
  "ecuador",
  "costa_rica",
  "panama",
  "guatemala",
  "el_salvador",
  "dominican_republic",
  "honduras",
  "bolivia",
  "paraguay",
  "other",
] as const;

export const countryFlags: Record<string, string> = {
  mexico: "\u{1F1F2}\u{1F1FD}",
  brazil: "\u{1F1E7}\u{1F1F7}",
  colombia: "\u{1F1E8}\u{1F1F4}",
  chile: "\u{1F1E8}\u{1F1F1}",
  argentina: "\u{1F1E6}\u{1F1F7}",
  peru: "\u{1F1F5}\u{1F1EA}",
  uruguay: "\u{1F1FA}\u{1F1FE}",
  venezuela: "\u{1F1FB}\u{1F1EA}",
  ecuador: "\u{1F1EA}\u{1F1E8}",
  costa_rica: "\u{1F1E8}\u{1F1F7}",
  panama: "\u{1F1F5}\u{1F1E6}",
  guatemala: "\u{1F1EC}\u{1F1F9}",
  el_salvador: "\u{1F1F8}\u{1F1FB}",
  dominican_republic: "\u{1F1E9}\u{1F1F4}",
  honduras: "\u{1F1ED}\u{1F1F3}",
  bolivia: "\u{1F1E7}\u{1F1F4}",
  paraguay: "\u{1F1F5}\u{1F1FE}",
  other: "\u{1F30E}",
};

/**
 * Maps browser locale subtags (e.g. "mx" from "es-MX") to our country keys.
 * Also maps full language codes (e.g. "pt" → brazil) for cases where only
 * the language is available without a region subtag.
 */
const localeToCountry: Record<string, string> = {
  mx: "mexico",
  br: "brazil",
  co: "colombia",
  cl: "chile",
  ar: "argentina",
  pe: "peru",
  uy: "uruguay",
  ve: "venezuela",
  ec: "ecuador",
  cr: "costa_rica",
  pa: "panama",
  gt: "guatemala",
  sv: "el_salvador",
  do: "dominican_republic",
  hn: "honduras",
  bo: "bolivia",
  py: "paraguay",
  pt: "brazil",
};

export function detectCountryFromBrowser(): string {
  if (typeof navigator === "undefined") return "";

  const langs = navigator.languages ?? [navigator.language];

  for (const lang of langs) {
    const parts = lang.toLowerCase().split("-");
    const region = parts[1];
    if (region && localeToCountry[region]) {
      return localeToCountry[region];
    }
  }

  for (const lang of langs) {
    const code = lang.toLowerCase().split("-")[0];
    if (localeToCountry[code]) {
      return localeToCountry[code];
    }
  }

  return "";
}
