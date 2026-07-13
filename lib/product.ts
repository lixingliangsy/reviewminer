export interface InputField {
  key: string
  label: string
  type: 'input' | 'textarea' | 'select'
  placeholder?: string
  options?: string[]
}

export const PRODUCT = {
  name: "ReviewMiner",
  slug: "reviewminer",
  tagline: "What your customers actually say, in one screen.",
  description: "Paste a batch of product reviews and get the recurring themes, a sentiment split, and three concrete improvement ideas you can ship.",
  toolTitle: "Mine your reviews",
  resultLabel: "Themes & sentiment",
  ctaLabel: "Mine reviews",
  features: [
  "Recurring theme clustering",
  "Sentiment split",
  "Top praise / complaints",
  "Three improvement ideas"
],
  inputs: [
  {
    "key": "reviews",
    "label": "Paste reviews (one per line)",
    "type": "textarea",
    "placeholder": "e.g. soft and true to size / shipped late / love the color"
  },
  {
    "key": "granularity",
    "label": "Depth",
    "type": "select",
    "options": [
      "Quick",
      "Detailed"
    ]
  }
] as InputField[],
  systemPrompt: "You are a customer-insights analyst. Given a batch of reviews and a depth setting, cluster the recurring themes, give a sentiment split (positive/neutral/negative with rough %), list top praise and top complaints, and propose three concrete improvement ideas. Stay evidence-based. In demo (mock) mode, return a realistic sample analysis following exactly this structure.",
  pricing: [
  {
    "tier": "Free",
    "price": "$0",
    "desc": "3 batches/mo"
  },
  {
    "tier": "Pro",
    "price": "$19/mo",
    "desc": "Unlimited, save history"
  }
],
  mock: (inputs: Record<string, string>): string => {
  const r = (inputs['reviews'] || '').trim()
  const g = inputs['granularity'] || 'Quick'
  if (!r) return 'Paste a batch of reviews to mine them.'
  let out = 'REVIEW MINING (' + g + ')\n\n'
  out += 'Sentiment: ~60% positive / 25% neutral / 15% negative\n\n'
  out += 'THEMES:\n'
  out += '  + Comfort & true-to-size (praise)\n'
  out += '  - Late shipping (complaint)\n'
  out += '  ~ Color matches photos (neutral-positive)\n\n'
  out += 'IMPROVE: 1) Add ship-by date on PDP. 2) Size guide video. 3) Proactive delay email.\n'
  out += '\n--- (Mock demo. Paste real reviews for a tailored read.)'
  return out
}
}
