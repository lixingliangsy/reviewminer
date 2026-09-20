import type { KbEntry } from "../support-kit/types";
export type { KbEntry };

export const KB: KbEntry[] = [
  {
    id: "what",
    title: "What ReviewMiner does",
    keywords: ["ReviewMiner", "reviewminer", "what", "product", "about", "What your customers actually say, in one screen."],
    body: "What your customers actually say, in one screen.. ReviewMiner turns a pile of customer reviews into sentiment and theme summaries — aspect coverage on one screen for product and CX teams who need signal without reading every line.",
    source: "ReviewMiner product definition",
    tags: [],
  },
  {
    id: "features",
    title: "ReviewMiner features",
    keywords: ["features", "feature", "can", "does", "Recurring theme clustering", "Sentiment split", "Top praise / complaints", "Three improvement ideas"],
    body: "ReviewMiner includes: Recurring theme clustering; Sentiment split; Top praise / complaints; Three improvement ideas. It does not add capabilities that are not listed here.",
    source: "ReviewMiner feature list",
    tags: [],
  },
  {
    id: "pricing",
    title: "ReviewMiner pricing",
    keywords: ["price", "pricing", "plan", "cost", "billing", "subscription", "monthly", "yearly"],
    body: "Listed prices for ReviewMiner: $19/month and $190/year. Checkout uses the in-app checkout route. This assistant cannot change a subscription or issue a refund.",
    source: "ReviewMiner pricing fields",
    tags: [],
  },
  {
    id: "howto",
    title: "How to use ReviewMiner",
    keywords: ["how", "start", "use", "tool", "run", "Mine your reviews"],
    body: "Open ReviewMiner and use Mine your reviews. The form asks for: Paste reviews (one per line); Depth.",
    source: "ReviewMiner tool fields",
    tags: [],
  },
  {
    id: "faq-1",
    title: "What is ReviewMiner?",
    keywords: ["What", "is", "ReviewMiner?"],
    body: "ReviewMiner mines customer reviews for sentiment splits and recurring themes.",
    source: "ReviewMiner FAQ",
    tags: [],
  },
  {
    id: "faq-2",
    title: "What do I paste in?",
    keywords: ["What", "do", "I", "paste", "in?"],
    body: "A set of reviews or a CSV-like snippet with enough volume to analyze.",
    source: "ReviewMiner FAQ",
    tags: [],
  },
  {
    id: "faq-3",
    title: "Who should use it?",
    keywords: ["Who", "should", "use", "it?"],
    body: "Product and CX teams scanning qualitative feedback.",
    source: "ReviewMiner FAQ",
    tags: [],
  },
  {
    id: "honesty",
    title: "What this assistant will not claim",
    keywords: ["legal", "advice", "guarantee", "demo", "human", "refund", "support"],
    body: "Answers about ReviewMiner are decision support only, not legal, tax, accessibility-certification, or compliance sign-off. This assistant does not invent integrations, SSO, CSV export, or Slack connections unless they are already in the product description. If live AI is unavailable, the product must not pretend a demo result is live. Say you want a human and leave an email if you need a person.",
    source: "ReviewMiner support policy",
    tags: ["compliance"],
  },
];

function normalize(s: string): string {
  return (s || "").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ");
}
function toWords(s: string): string[] {
  return normalize(s).split(/\s+/).map((w) => w.trim()).filter(Boolean);
}
function cjkBigrams(s: string): string[] {
  const grams: string[] = [];
  const han = /[\u4e00-\u9fff]/;
  for (const w of toWords(s)) {
    if (han.test(w) && w.length >= 2) {
      for (let i = 0; i < w.length - 1; i++) grams.push(w.slice(i, i + 2));
    }
  }
  return grams;
}
function scoreEntry(entry: KbEntry, query: string): number {
  const q = normalize(query);
  const qWords = new Set(toWords(q));
  const qGrams = new Set(cjkBigrams(q));
  let s = 0;
  for (const kw of entry.keywords) {
    const k = kw.toLowerCase();
    if (q.includes(k)) s += 3;
  }
  for (const tw of toWords(entry.title)) {
    if (qWords.has(tw)) s += 2;
  }
  const idx = normalize(entry.keywords.join(" ") + " " + entry.title + " " + entry.body.slice(0, 400));
  for (const g of qGrams) if (idx.includes(g)) s += 0.5;
  return s;
}

export interface RetrieveResult {
  entries: KbEntry[];
  topScore: number;
}

export function retrieve(query: string, topK = 4, entries: KbEntry[] = KB): RetrieveResult {
  const scored = entries
    .map((e) => ({ e, s: scoreEntry(e, query) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, topK);
  return { entries: scored.map((x) => x.e), topScore: scored.length ? scored[0].s : 0 };
}

export function isComplianceRelated(entries: KbEntry[]): boolean {
  return entries.some((e) => e.tags.includes("compliance"));
}
