// lib/rules/__selftest.ts — deterministic self-test for reviewminer review rules.
// Run: tsx lib/rules/__selftest.ts
import { checkReview, RULESET_VERSION } from './review'

let passed = 0
let failed = 0
function assert(name: string, cond: boolean) {
  if (cond) {
    passed++
    console.log('  ok  -', name)
  } else {
    failed++
    console.error('  FAIL -', name)
  }
}

assert('RULESET_VERSION is date-stamped', /^\d{4}-\d{2}-\d{2}$/.test(RULESET_VERSION))

// R1 — too few reviews warns
const few = checkReview({ reviewCount: 2, analysis: 'Positive overall.' })
assert('R1 warns <3 reviews', few.findings.some((f) => f.rule === 'R1-min-reviews'))

// R2 — sentiment split not ~100% warns
const badSum = checkReview({
  reviewCount: 20,
  analysis: 'Sentiment: 70% positive / 50% negative / 10% neutral.',
})
assert('R2 warns sentiment sum != 100', badSum.findings.some((f) => f.rule === 'R2-sentiment-sums'))

// R3 — no themes warns
const noThemes = checkReview({ reviewCount: 10, analysis: 'Customers are happy.' })
assert('R3 warns missing aspect clustering', noThemes.findings.some((f) => f.rule === 'R3-aspect-clustering'))

// R4 — no evidence warns
const noEvidence = checkReview({ reviewCount: 10, analysis: 'Themes: price, shipping. Praise and complaints noted.' })
assert('R4 warns missing evidence', noEvidence.findings.some((f) => f.rule === 'R4-evidence-based'))

// R5 — false accuracy claim blocked
const falseClaim = checkReview({ reviewCount: 10, analysis: 'Our sentiment is 100% accurate and never misses.' })
assert('R5 blocks false accuracy claim', falseClaim.findings.some((f) => f.rule === 'R5-no-false-claim' && f.level === 'block'))

// Clean analysis passes (no block)
const clean = checkReview({
  reviewCount: 15,
  analysis:
    'Sentiment: 60% positive / 25% neutral / 15% negative. Themes: comfort (praise), late shipping (complaint). e.g. one reviewer said "soft and true to size". Three improvements: ship-by date, size guide video, proactive delay email.',
})
assert('clean analysis has no block', clean.ok)
assert('clean has sentiment summing ~100', !clean.findings.some((f) => f.rule === 'R2-sentiment-sums'))

console.log(`\nreviewminer rules selftest: ${passed} passed, ${failed} failed`)
try {
  const fs = require('fs')
  fs.mkdirSync('.data', { recursive: true })
  fs.writeFileSync('.data/selftest-result.json', JSON.stringify({ passed, failed, ok: failed === 0, product: 'reviewminer' }))
} catch {}
if (failed > 0) process.exit(1)
