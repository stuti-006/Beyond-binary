export const strategyInputs = [
  {
    id: 'launchUrgency',
    label: 'LAUNCH URGENCY',
    hint: 'How fast must this ship?',
    high: 'Crunch',
    low: 'Relaxed',
  },
  {
    id: 'engineeringCapacity',
    label: 'ENGINEERING CAPACITY',
    hint: 'Room to build in-house',
    high: 'Deep bench',
    low: 'Thin bench',
  },
  {
    id: 'vendorReliability',
    label: 'VENDOR RELIABILITY',
    hint: 'Confidence in the partner ecosystem',
    high: 'Battle-tested',
    low: 'Unproven',
  },
  {
    id: 'differentiation',
    label: 'STRATEGIC DIFFERENTIATION',
    hint: 'How unique must this surface be?',
    high: 'Core moat',
    low: 'Commodity',
  },
  {
    id: 'complianceComplexity',
    label: 'COMPLIANCE COMPLEXITY',
    hint: 'Regulatory weight of the surface',
    high: 'Heavy',
    low: 'Light',
  },
]

export const levels = [
  { key: 'LOW', value: 0, label: 'LOW' },
  { key: 'MED', value: 0.5, label: 'MED' },
  { key: 'HIGH', value: 1, label: 'HIGH' },
]

const clamp = (n) => Math.max(0, Math.min(1, n))

export function evaluateStrategy(inputs) {
  const { launchUrgency, engineeringCapacity, vendorReliability, differentiation, complianceComplexity } = inputs

  const build = clamp(0.4 * differentiation + 0.3 * engineeringCapacity + 0.3 * (1 - launchUrgency))
  const partner = clamp(0.4 * launchUrgency + 0.3 * (1 - engineeringCapacity) + 0.3 * complianceComplexity)
  const hybrid = clamp(0.45 * (1 - vendorReliability) + 0.35 * differentiation + 0.2 * (launchUrgency * engineeringCapacity))

  const total = build + partner + hybrid
  const pct = (v) => Math.round((v / total) * 100)

  const ranking = [
    { key: 'BUILD', value: pct(build) },
    { key: 'PARTNER', value: pct(partner) },
    { key: 'HYBRID', value: pct(hybrid) },
  ].sort((a, b) => b.value - a.value)

  const dominant = ranking[0].key
  const second = ranking[1].key

  const headlines = {
    BUILD: {
      title: 'LEAN BUILD — OWN THE DIFFERENTIATION',
      text: 'Prioritize in-house ownership of the surfaces that define the product: trading logic, risk policy and custody contract logic.',
    },
    PARTNER: {
      title: 'LEAN PARTNER — RENT THE PLUMBING FAST',
      text: 'Compress time-to-market by partnering commodity rails and compliance infrastructure behind controlled interfaces.',
    },
    HYBRID: {
      title: 'LEAN HYBRID — BUILD THE MOAT, PARTNER THE SPECIALIZED',
      text: 'Keep critical dependencies on a short leash: own the decision surface while partnering specialized execution, with explicit fallback.',
    },
  }

  if (ranking[1].value > ranking[2].value + 20 && ranking[1].value > 30) {
    headlines[dominant].text =
      headlines[dominant].text +
      ' With a strong secondary ' + second + ' signal, the mix should be deliberately balanced rather than single-track.'
  }

  const rationale = []
  if (differentiation > 0.6) rationale.push('High differentiation pushes core surfaces (trading, risk, custody policy) in-house.')
  if (launchUrgency > 0.6) rationale.push('High launch urgency favors partner rails and pre-built compliance infrastructure.')
  if (engineeringCapacity < 0.4) rationale.push('Thin engineering bench argues against building commodity plumbing from scratch.')
  if (engineeringCapacity > 0.6) rationale.push('Deep engineering bench makes in-house ownership of strategic surfaces viable.')
  if (vendorReliability < 0.4) rationale.push('Low vendor confidence signals hybridizing critical dependencies with explicit fallback paths.')
  if (complianceComplexity > 0.6) rationale.push('Heavy compliance complexity favors partnering specialized, certified infrastructure — while keeping policy and auditability in-house.')
  if (rationale.length === 0) rationale.push('Balanced signals — use the phase gates (months 4–9) to reassess as real data arrives.')
  rationale.push('Illustrative strategic model — not a validated financial or risk model.')

  return {
    allocation: ranking,
    dominant,
    headline: headlines[dominant],
    rationale,
  }
}