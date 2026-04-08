type CurrencyRanges = {
  code: string;
  symbol: string;
  revenue: Record<string, string>;
  askingPrice: Record<string, string>;
};

/**
 * Approximate local-currency equivalents for each revenue / asking-price
 * bracket. Keys match the form value stored in the DB (e.g. "under_5k").
 * "pre_revenue" is excluded because its label is language-dependent
 * and comes from the dictionary.
 *
 * Rates used (approximate, rounded for friendly UX):
 *   MXN ≈ 17   BRL ≈ 5.5   COP ≈ 4 200   CLP ≈ 950
 *   ARS ≈ 1 200 (volatile — rounded aggressively)   PEN ≈ 3.75
 */

const usd: CurrencyRanges = {
  code: "USD",
  symbol: "US$",
  revenue: {
    under_5k: "< US$5K",
    "5k_20k": "US$5K – US$20K",
    "20k_50k": "US$20K – US$50K",
    "50k_plus": "US$50K+",
  },
  askingPrice: {
    under_100k: "< US$100K",
    "100k_250k": "US$100K – US$250K",
    "250k_500k": "US$250K – US$500K",
    "500k_1m": "US$500K – US$1M",
    "1m_plus": "US$1M+",
  },
};

const mxn: CurrencyRanges = {
  code: "MXN",
  symbol: "MX$",
  revenue: {
    under_5k: "< MX$100K",
    "5k_20k": "MX$100K – MX$350K",
    "20k_50k": "MX$350K – MX$850K",
    "50k_plus": "MX$850K+",
  },
  askingPrice: {
    under_100k: "< MX$2M",
    "100k_250k": "MX$2M – MX$4M",
    "250k_500k": "MX$4M – MX$9M",
    "500k_1m": "MX$9M – MX$17M",
    "1m_plus": "MX$17M+",
  },
};

const brl: CurrencyRanges = {
  code: "BRL",
  symbol: "R$",
  revenue: {
    under_5k: "< R$25K",
    "5k_20k": "R$25K – R$100K",
    "20k_50k": "R$100K – R$250K",
    "50k_plus": "R$250K+",
  },
  askingPrice: {
    under_100k: "< R$500K",
    "100k_250k": "R$500K – R$1,5M",
    "250k_500k": "R$1,5M – R$2,5M",
    "500k_1m": "R$2,5M – R$5M",
    "1m_plus": "R$5M+",
  },
};

const cop: CurrencyRanges = {
  code: "COP",
  symbol: "COP$",
  revenue: {
    under_5k: "< COP$20M",
    "5k_20k": "COP$20M – COP$80M",
    "20k_50k": "COP$80M – COP$200M",
    "50k_plus": "COP$200M+",
  },
  askingPrice: {
    under_100k: "< COP$400M",
    "100k_250k": "COP$400M – COP$1.000M",
    "250k_500k": "COP$1.000M – COP$2.000M",
    "500k_1m": "COP$2.000M – COP$4.000M",
    "1m_plus": "COP$4.000M+",
  },
};

const clp: CurrencyRanges = {
  code: "CLP",
  symbol: "CLP$",
  revenue: {
    under_5k: "< CLP$5M",
    "5k_20k": "CLP$5M – CLP$19M",
    "20k_50k": "CLP$19M – CLP$50M",
    "50k_plus": "CLP$50M+",
  },
  askingPrice: {
    under_100k: "< CLP$100M",
    "100k_250k": "CLP$100M – CLP$250M",
    "250k_500k": "CLP$250M – CLP$500M",
    "500k_1m": "CLP$500M – CLP$1.000M",
    "1m_plus": "CLP$1.000M+",
  },
};

const ars: CurrencyRanges = {
  code: "ARS",
  symbol: "ARS$",
  revenue: {
    under_5k: "< ARS$5M",
    "5k_20k": "ARS$5M – ARS$25M",
    "20k_50k": "ARS$25M – ARS$60M",
    "50k_plus": "ARS$60M+",
  },
  askingPrice: {
    under_100k: "< ARS$120M",
    "100k_250k": "ARS$120M – ARS$300M",
    "250k_500k": "ARS$300M – ARS$600M",
    "500k_1m": "ARS$600M – ARS$1.200M",
    "1m_plus": "ARS$1.200M+",
  },
};

const pen: CurrencyRanges = {
  code: "PEN",
  symbol: "S/",
  revenue: {
    under_5k: "< S/19K",
    "5k_20k": "S/19K – S/75K",
    "20k_50k": "S/75K – S/185K",
    "50k_plus": "S/185K+",
  },
  askingPrice: {
    under_100k: "< S/375K",
    "100k_250k": "S/375K – S/940K",
    "250k_500k": "S/940K – S/1,9M",
    "500k_1m": "S/1,9M – S/3,7M",
    "1m_plus": "S/3,7M+",
  },
};

const uyu: CurrencyRanges = {
  code: "UYU",
  symbol: "UYU$",
  revenue: {
    under_5k: "< UYU$200K",
    "5k_20k": "UYU$200K – UYU$800K",
    "20k_50k": "UYU$800K – UYU$2M",
    "50k_plus": "UYU$2M+",
  },
  askingPrice: {
    under_100k: "< UYU$4M",
    "100k_250k": "UYU$4M – UYU$10M",
    "250k_500k": "UYU$10M – UYU$20M",
    "500k_1m": "UYU$20M – UYU$40M",
    "1m_plus": "UYU$40M+",
  },
};

const crc: CurrencyRanges = {
  code: "CRC",
  symbol: "₡",
  revenue: {
    under_5k: "< ₡2,5M",
    "5k_20k": "₡2,5M – ₡10M",
    "20k_50k": "₡10M – ₡26M",
    "50k_plus": "₡26M+",
  },
  askingPrice: {
    under_100k: "< ₡53M",
    "100k_250k": "₡53M – ₡130M",
    "250k_500k": "₡130M – ₡265M",
    "500k_1m": "₡265M – ₡530M",
    "1m_plus": "₡530M+",
  },
};

const gtq: CurrencyRanges = {
  code: "GTQ",
  symbol: "Q",
  revenue: {
    under_5k: "< Q39K",
    "5k_20k": "Q39K – Q155K",
    "20k_50k": "Q155K – Q390K",
    "50k_plus": "Q390K+",
  },
  askingPrice: {
    under_100k: "< Q780K",
    "100k_250k": "Q780K – Q2M",
    "250k_500k": "Q2M – Q4M",
    "500k_1m": "Q4M – Q8M",
    "1m_plus": "Q8M+",
  },
};

const dop: CurrencyRanges = {
  code: "DOP",
  symbol: "RD$",
  revenue: {
    under_5k: "< RD$290K",
    "5k_20k": "RD$290K – RD$1,2M",
    "20k_50k": "RD$1,2M – RD$2,9M",
    "50k_plus": "RD$2,9M+",
  },
  askingPrice: {
    under_100k: "< RD$5,8M",
    "100k_250k": "RD$5,8M – RD$14,5M",
    "250k_500k": "RD$14,5M – RD$29M",
    "500k_1m": "RD$29M – RD$58M",
    "1m_plus": "RD$58M+",
  },
};

const hnl: CurrencyRanges = {
  code: "HNL",
  symbol: "L",
  revenue: {
    under_5k: "< L125K",
    "5k_20k": "L125K – L500K",
    "20k_50k": "L500K – L1,3M",
    "50k_plus": "L1,3M+",
  },
  askingPrice: {
    under_100k: "< L2,5M",
    "100k_250k": "L2,5M – L6,3M",
    "250k_500k": "L6,3M – L12,5M",
    "500k_1m": "L12,5M – L25M",
    "1m_plus": "L25M+",
  },
};

const bob: CurrencyRanges = {
  code: "BOB",
  symbol: "Bs",
  revenue: {
    under_5k: "< Bs35K",
    "5k_20k": "Bs35K – Bs140K",
    "20k_50k": "Bs140K – Bs345K",
    "50k_plus": "Bs345K+",
  },
  askingPrice: {
    under_100k: "< Bs690K",
    "100k_250k": "Bs690K – Bs1,7M",
    "250k_500k": "Bs1,7M – Bs3,5M",
    "500k_1m": "Bs3,5M – Bs6,9M",
    "1m_plus": "Bs6,9M+",
  },
};

const pyg: CurrencyRanges = {
  code: "PYG",
  symbol: "₲",
  revenue: {
    under_5k: "< ₲36M",
    "5k_20k": "₲36M – ₲146M",
    "20k_50k": "₲146M – ₲365M",
    "50k_plus": "₲365M+",
  },
  askingPrice: {
    under_100k: "< ₲730M",
    "100k_250k": "₲730M – ₲1.825M",
    "250k_500k": "₲1.825M – ₲3.650M",
    "500k_1m": "₲3.650M – ₲7.300M",
    "1m_plus": "₲7.300M+",
  },
};

export const currencyByCountry: Record<string, CurrencyRanges> = {
  mexico: mxn,
  brazil: brl,
  colombia: cop,
  chile: clp,
  argentina: ars,
  peru: pen,
  uruguay: uyu,
  venezuela: usd,
  ecuador: usd,
  costa_rica: crc,
  panama: usd,
  guatemala: gtq,
  el_salvador: usd,
  dominican_republic: dop,
  honduras: hnl,
  bolivia: bob,
  paraguay: pyg,
  other: usd,
};

export function getCurrencyForCountry(country: string): CurrencyRanges {
  return currencyByCountry[country] ?? usd;
}
