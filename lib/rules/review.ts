// lib/rules/review.ts — Deterministic review-mining checklist for ReviewMiner.
//
// Rule-based only (no LLM). Validates a mined review analysis for sentiment accuracy,
// aspect coverage, and honesty. Decision-support; does NOT guarantee 100% accuracy.
//
// RULESET_VERSION is date-stamped and tied to the web-research refs below.
export const RULESET_VERSION = '2025-10-28'

export const REFS = {
  absaSpringer: 'https://link.springer.com/article/10.1007/s10586-025-05928-3',
  absaScienceDirect: 'https://www.sciencedirect.com/science/article/abs/pii/S157401372600033X',
  sentimentReview: 'https://link.springer.com/article/10.1007/s41060-024-00594-x',
  icdm: 'https://www3.cs.stonybrook.edu/~icdm2025/icdmw2025proceedings/813200c082.pdf',
} as const

export interface RuleFinding {
  rule: string
  level: 'block' | 'warn'
  message: string
  ref: string
}

export interface ReviewCheckInput {
  reviewCount: number
  analysis: string
}

/**
 * Run the deterministic checklist on a mined analysis. `block` findings mean the
 * analysis should not be presented as-is.
 */
export function checkReview(input: ReviewCheckInput): { ok: boolean; findings: RuleFinding[] } {
  const findings: RuleFinding[] = []
  const text = (input.analysis || '').toLowerCase()
  const n = input.reviewCount || 0

  // R1 — need enough reviews for a sentiment split to be meaningful.
  if (n < 3) {
    findings.push({
      rule: 'R1-min-reviews',
      level: 'warn',
      message: `Only ${n} review(s) provided — sentiment % from <3 reviews is not reliable.`,
      ref: REFS.sentimentReview,
    })
  }

  // R2 — sentiment split must sum to ~100%.
  const pcts = (text.match(/(\d{1,3})\s*%/g) || []).map((m) => parseInt(m, 10))
  const pos = pcts.filter((p) => p >= 0 && p <= 100)
  if (pos.length >= 2) {
    const sum = pos.reduce((a, b) => a + b, 0)
    if (sum > 0 && Math.abs(sum - 100) > 15) {
      findings.push({
        rule: 'R2-sentiment-sums',
        level: 'warn',
        message: `Sentiment percentages sum to ${sum}%, not ~100%. Re-check the split.`,
        ref: REFS.absaSpringer,
      })
    }
  }

  // R3 — aspect/theme clustering expected (ABSA best practice).
  const hasThemes =
    /\b(theme|themes|aspect|cluster|topic|recurring)\b/.test(text) ||
    (text.includes('praise') && text.includes('complaint'))
  if (!hasThemes) {
    findings.push({
      rule: 'R3-aspect-clustering',
      level: 'warn',
      message: 'Analysis should cluster recurring themes/aspects (aspect-based sentiment).',
      ref: REFS.absaScienceDirect,
    })
  }

  // R4 — evidence-based: cite at least one concrete review snippet.
  if (!/\b(e\.g\.|e\.g|for example|"[^"]+"|one reviewer|customers say)\b/i.test(input.analysis || '')) {
    findings.push({
      rule: 'R4-evidence-based',
      level: 'warn',
      message: 'Back claims with a concrete review quote/snippet (evidence-based analysis).',
      ref: REFS.icdm,
    })
  }

  // R5 — honesty: no 100% accuracy / never-miss claims.
  if (/\b(100% accurate|never miss|perfect sentiment|guaranteed insight)\b/i.test(input.analysis || '')) {
    findings.push({
      rule: 'R5-no-false-claim',
      level: 'block',
      message: 'Remove accuracy guarantees — sentiment mining is probabilistic, not 100% accurate.',
      ref: REFS.sentimentReview,
    })
  }

  return { ok: !findings.some((f) => f.level === 'block'), findings }
}

/** L1 tool adapter — maps checkReview findings → RuleHit[] */
export type RuleHit = {
  id: string
  title: string
  severity: 'low' | 'medium' | 'high'
  passed: boolean
  remediation?: string
  ref?: string
}

export function runDeterministicChecks(inputs: Record<string, string>): RuleHit[] {
  const analysis = inputs.analysis || inputs.text || Object.values(inputs || {}).join('\n')
  const reviewCount = parseInt(String(inputs.reviewCount || inputs.count || '0'), 10) || 0
  const { findings } = checkReview({ analysis, reviewCount })
  if (!findings.length) {
    return [{ id: 'R0', title: 'Review inputs accepted', severity: 'low', passed: analysis.trim().length > 0 }]
  }
  return findings.map((f) => ({
    id: String(f.rule || 'R'),
    title: String(f.message || 'check'),
    severity: f.level === 'block' ? 'high' : f.level === 'warn' ? 'medium' : 'low',
    passed: f.level !== 'block',
    remediation: f.message,
    ref: f.ref,
  }))
}
