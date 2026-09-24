// Default criteria. Keys match decisionBoard.js's `economics` fields so this
// tool's starting point is literally Round 1's own reasoning, not new numbers.
// polarity: 'build' -> a HIGH score on this criterion pulls toward BUILD.
//           'partner' -> a HIGH score on this criterion pulls toward PARTNER.
export const defaultCriteria = [
  {
    id: 'strategicValue',
    label: 'Strategic Value / Moat',
    hint: 'How much does owning this create differentiation or trust?',
    polarity: 'build',
    weight: 40,
  },
  {
    id: 'compliance',
    label: 'Compliance Burden',
    hint: 'How specialized and heavy is the regulatory lift?',
    polarity: 'partner',
    weight: 35,
  },
  {
    id: 'switching',
    label: 'Vendor Lock-in Risk',
    hint: 'How costly if a vendor relationship sours or must be replaced?',
    polarity: 'build',
    weight: 10,
  },
  {
    id: 'engineering',
    label: 'Engineering Complexity',
    hint: 'How hard is this to build and keep correct in-house?',
    polarity: 'partner',
    weight: 5,
  },
  {
    id: 'upfront',
    label: 'Upfront Build Cost',
    hint: 'Capital and time to stand this up from scratch.',
    polarity: 'partner',
    weight: 5,
  },
  {
    id: 'ongoing',
    label: 'Ongoing Operating Cost',
    hint: 'Recurring cost to run and maintain this ourselves.',
    polarity: 'partner',
    weight: 5,
  },
]

// Default components + scores, pulled directly from decisionBoard.js's
// economics (LOW=1, MEDIUM=3, HIGH=5). Only the 4 the case explicitly names
// are included by default; teams can add rows (e.g. Market Data Feeds).
export const defaultComponents = [
  {
    id: 'wallet',
    icon: '🔐',
    name: 'Self-Custodial Wallet',
    scores: { strategicValue: 5, compliance: 5, switching: 3, engineering: 3, upfront: 5, ongoing: 3 },
  },
  {
    id: 'payments',
    icon: '💳',
    name: 'UPI / Banking Rails',
    scores: { strategicValue: 1, compliance: 3, switching: 3, engineering: 1, upfront: 1, ongoing: 3 },
  },
  {
    id: 'kyc',
    icon: '🆔',
    name: 'KYC / AML',
    scores: { strategicValue: 3, compliance: 5, switching: 3, engineering: 1, upfront: 1, ongoing: 3 },
  },
  {
    id: 'trading',
    icon: '⚙️',
    name: 'Trading Engine',
    scores: { strategicValue: 5, compliance: 3, switching: 5, engineering: 5, upfront: 5, ongoing: 5 },
  },
]

// Classification thresholds on the normalized net score (-1..+1).
export const BUILD_THRESHOLD = 0.2
export const PARTNER_THRESHOLD = -0.2

// Score -> rough build-time estimate, used to size the roadmap for BUILD items.
export const engineeringTimeEstimate = (engineeringScore) => {
  if (engineeringScore >= 5) return '10\u201316 wks'
  if (engineeringScore >= 4) return '8\u201312 wks'
  if (engineeringScore >= 3) return '5\u20138 wks'
  if (engineeringScore >= 2) return '3\u20135 wks'
  return '1\u20133 wks'
}

/**
 * netScore: weighted, polarity-signed average of centered 1-5 scores.
 * Centering maps 1 to -1, 3 to 0, and 5 to +1, so the result is always
 * comparable on a -1..+1 scale regardless of the weight distribution.
 */
export function computeNetScore(component, criteria) {
  const totalWeight = criteria.reduce((sum, c) => sum + Number(c.weight || 0), 0)
  if (totalWeight <= 0) return 0
  let net = 0
  criteria.forEach((c) => {
    const raw = component.scores[c.id]
    const score = raw === undefined ? 3 : raw
    const sign = c.polarity === 'build' ? 1 : -1
    const normalizedWeight = Number(c.weight || 0) / totalWeight
    const centeredScore = (score - 3) / 2
    net += normalizedWeight * sign * centeredScore
  })
  return net
}

export function classify(netScore) {
  if (netScore >= BUILD_THRESHOLD) return 'BUILD'
  if (netScore <= PARTNER_THRESHOLD) return 'PARTNER'
  return 'HYBRID'
}

/**
 * Returns the top 2 criteria (by weighted contribution magnitude) driving
 * a component's classification, for the visible one-line reasoning.
 */
export function topDrivers(component, criteria) {
  const totalWeight = criteria.reduce((sum, c) => sum + Number(c.weight || 0), 0)
  if (totalWeight <= 0) return []
  const contributions = criteria.map((c) => {
    const raw = component.scores[c.id]
    const score = raw === undefined ? 3 : raw
    const sign = c.polarity === 'build' ? 1 : -1
    const normalizedWeight = Number(c.weight || 0) / totalWeight
    const centeredScore = (score - 3) / 2
    const contribution = normalizedWeight * sign * centeredScore
    return {
      criterion: c,
      score,
      contribution,
      direction: contribution > 0 ? 'BUILD' : contribution < 0 ? 'PARTNER' : 'NEUTRAL',
    }
  })
  return contributions.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution)).slice(0, 2)
}

const contributionDetails = (component, criteria) => {
  const totalWeight = criteria.reduce((sum, c) => sum + Number(c.weight || 0), 0)
  if (totalWeight <= 0) return []

  return criteria
    .map((c) => {
      const score = component.scores[c.id] === undefined ? 3 : component.scores[c.id]
      const centeredScore = (score - 3) / 2
      const sign = c.polarity === 'build' ? 1 : -1
      const contribution = (Number(c.weight || 0) / totalWeight) * sign * centeredScore
      return { criterion: c, score, contribution }
    })
    .filter((item) => item.contribution !== 0)
}

const formatPressure = (items) => {
  if (items.length === 0) return 'no material pressure'
  return items
    .slice(0, 2)
    .map((item) => `${item.criterion.label} (${item.score}/5, ${item.contribution >= 0 ? '+' : ''}${item.contribution.toFixed(2)})`)
    .join(' and ')
}

export function decisionReason(component, criteria, decision) {
  const details = contributionDetails(component, criteria)
  const buildPressure = details.filter((item) => item.contribution > 0).sort((a, b) => b.contribution - a.contribution)
  const partnerPressure = details.filter((item) => item.contribution < 0).sort((a, b) => a.contribution - b.contribution)

  if (decision === 'BUILD') {
    return `Build pressure from ${formatPressure(buildPressure)} outweighs partner pressure from ${formatPressure(partnerPressure)}.`
  }
  if (decision === 'PARTNER') {
    return `Partner pressure from ${formatPressure(partnerPressure)} outweighs build pressure from ${formatPressure(buildPressure)}.`
  }
  return `Build pressure from ${formatPressure(buildPressure)} is balanced by partner pressure from ${formatPressure(partnerPressure)}, so own the control layer and partner the specialized plumbing.`
}
