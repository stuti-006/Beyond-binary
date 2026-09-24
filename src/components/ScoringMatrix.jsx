import { useEffect, useMemo, useState } from 'react'
import {
  defaultCriteria,
  defaultComponents,
  computeNetScore,
  classify,
  topDrivers,
  decisionReason,
  BUILD_THRESHOLD,
  PARTNER_THRESHOLD,
  engineeringTimeEstimate,
} from '../data/scoringMatrix.js'
import { decisionMeta } from '../data/theme.js'

let uid = 1000
const nextId = (prefix) => `${prefix}-${uid++}`

function decisionGate(row) {
  if (row.decision === 'BUILD') {
    return `Revisit PARTNER if net score falls below +${BUILD_THRESHOLD.toFixed(2)}.`
  }
  if (row.decision === 'PARTNER') {
    return `Revisit BUILD if net score rises above ${PARTNER_THRESHOLD.toFixed(2)}.`
  }
  return `Stay HYBRID while net score remains between ${PARTNER_THRESHOLD.toFixed(2)} and +${BUILD_THRESHOLD.toFixed(2)}.`
}

function ownershipLabel(decision) {
  if (decision === 'BUILD') return 'Own decision surface end-to-end'
  if (decision === 'PARTNER') return 'Own policy & controls; partner execution'
  return 'Own control layer + partner specialized plumbing'
}

/**
 * Minimal Horizontal Intensity Rail (Replaces dot ratings)
 * Visually represents 1–5 score using a subtle track and diamond marker (◆).
 * Visually neutral (evidence), tooltip on hover, fully accessible.
 */
function IntensityRail({ value = 3, onChange, criterionLabel = '' }) {
  const [hoverVal, setHoverVal] = useState(null)
  const activeVal = hoverVal !== null ? hoverVal : value
  const posPercent = Math.max(0, Math.min(100, ((activeVal - 1) / 4) * 100))

  return (
    <div
      className="group relative flex flex-col items-center justify-center py-1"
      aria-label={`${criterionLabel} score: ${value} out of 5`}
    >
      {/* Tooltip on hover */}
      <div className="pointer-events-none absolute -top-6 rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 shadow-md z-30">
        {activeVal} / 5
      </div>

      {/* Rail Container */}
      <div className="relative h-6 w-28 sm:w-32 flex items-center cursor-pointer select-none">
        {/* Track Line */}
        <div className="h-1 w-full rounded-full bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
          <div
            className="h-full bg-slate-400 dark:bg-slate-500 transition-all duration-150"
            style={{ width: `${posPercent}%` }}
          />
        </div>

        {/* Discrete Ticks */}
        <div className="absolute inset-0 flex justify-between items-center px-0 pointer-events-none">
          {[1, 2, 3, 4, 5].map((step) => (
            <span
              key={step}
              className={`h-1 w-1 rounded-full ${
                step <= activeVal ? 'bg-slate-500 dark:bg-slate-400' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Diamond Marker (◆) */}
        <div
          className="absolute -translate-x-1/2 flex items-center justify-center transition-all duration-150 pointer-events-none z-10"
          style={{ left: `${posPercent}%` }}
        >
          <div className="w-2.5 h-2.5 rotate-45 bg-slate-800 dark:bg-slate-200 border border-slate-900 shadow-xs transition-transform group-hover:scale-125" />
        </div>

        {/* Click Target Buttons */}
        <div className="absolute inset-0 flex justify-between items-center">
          {[1, 2, 3, 4, 5].map((step) => (
            <button
              key={step}
              type="button"
              onClick={() => onChange(step)}
              onMouseEnter={() => setHoverVal(step)}
              onMouseLeave={() => setHoverVal(null)}
              aria-label={`Set score to ${step} out of 5`}
              className="h-full w-5 flex items-center justify-center bg-transparent border-0 outline-none cursor-pointer"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Small BUILD ↔ PARTNER Pressure Indicator
 */
function NetPressureBar({ net = 0 }) {
  const posPercent = Math.max(0, Math.min(100, ((net + 1) / 2) * 100))

  return (
    <div className="w-full max-w-[130px] flex flex-col gap-1 py-1">
      <div className="flex justify-between font-mono text-[8.5px] font-bold uppercase tracking-wider">
        <span className="text-partner">PARTNER</span>
        <span className="text-build">BUILD</span>
      </div>
      <div className="relative h-1.5 w-full rounded-full bg-base-border overflow-hidden">
        {/* Neutral center mark */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-base-muted/40" />

        {/* Pressure marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-150"
          style={{ left: `${posPercent}%` }}
        >
          <div className="w-2 h-2 rotate-45 bg-base-text border border-base-border shadow-xs" />
        </div>
      </div>
    </div>
  )
}

/**
 * Modal for Progressive Disclosure ([ WHY? ])
 */
function WhyReasonModal({ row, criteria, onClose }) {
  if (!row) return null

  const details = criteria.map((c) => {
    const totalWeight = criteria.reduce((sum, cr) => sum + Number(cr.weight || 0), 0)
    const score = row.scores[c.id] === undefined ? 3 : row.scores[c.id]
    const centeredScore = (score - 3) / 2
    const sign = c.polarity === 'build' ? 1 : -1
    const normalizedWeight = totalWeight > 0 ? Number(c.weight || 0) / totalWeight : 0
    const contribution = normalizedWeight * sign * centeredScore
    return { criterion: c, score, contribution }
  })

  const buildItems = details.filter((item) => item.contribution > 0).sort((a, b) => b.contribution - a.contribution)
  const partnerItems = details.filter((item) => item.contribution < 0).sort((a, b) => a.contribution - b.contribution)
  const meta = decisionMeta[row.decision]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-slide-up">
      <div className="relative w-full max-w-lg rounded-2xl border border-base-border bg-base-card p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-base-muted hover:bg-base-panel hover:text-base-text transition"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 border-b border-base-border pb-4">
          <span className="text-2xl">{row.icon}</span>
          <div>
            <h3 className="font-display text-base font-bold text-base-text">{row.name}</h3>
            <div className="mt-1 flex items-center gap-2">
              <span className={`badge ${meta.badgeClass}`}>{row.decision}</span>
              <span className="font-mono text-xs font-bold text-base-dim">
                net {row.net >= 0 ? '+' : ''}{row.net.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* Ownership Summary */}
          <div className="rounded-lg bg-base-panel p-3 border border-base-border">
            <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-base-dim">Strategic Ownership</p>
            <p className="mt-1 text-xs text-base-text font-medium">{ownershipLabel(row.decision)}</p>
            <p className="mt-2 text-xs leading-relaxed text-base-dim">{row.reason}</p>
          </div>

          {/* Build Pressure */}
          <div>
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-build flex items-center gap-1.5">
              <span>BUILD PRESSURE</span>
              <span className="text-[10px] text-base-muted font-normal">(pulls score positive)</span>
            </h4>
            {buildItems.length > 0 ? (
              <div className="mt-2 space-y-1.5">
                {buildItems.map((item) => (
                  <div key={item.criterion.id} className="flex items-center justify-between rounded bg-build-dim/20 px-3 py-2 text-xs border border-build-border/30">
                    <span className="font-medium text-base-text">{item.criterion.label}</span>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-base-dim">{item.score}/5</span>
                      <span className="font-bold text-build">+{item.contribution.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-xs text-base-muted italic">No criteria driving build pressure.</p>
            )}
          </div>

          {/* Partner Pressure */}
          <div>
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-partner flex items-center gap-1.5">
              <span>PARTNER PRESSURE</span>
              <span className="text-[10px] text-base-muted font-normal">(pulls score negative)</span>
            </h4>
            {partnerItems.length > 0 ? (
              <div className="mt-2 space-y-1.5">
                {partnerItems.map((item) => (
                  <div key={item.criterion.id} className="flex items-center justify-between rounded bg-partner-dim/20 px-3 py-2 text-xs border border-partner-border/30">
                    <span className="font-medium text-base-text">{item.criterion.label}</span>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-base-dim">{item.score}/5</span>
                      <span className="font-bold text-partner">{item.contribution.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-xs text-base-muted italic">No criteria driving partner pressure.</p>
            )}
          </div>

          {/* Revisit Condition */}
          <div className="rounded-lg border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 p-3 text-xs">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Revisit Condition</p>
            <p className="mt-1 text-base-dim">{decisionGate(row)}</p>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-base-text px-4 py-2 font-mono text-xs font-bold text-base-bg transition hover:opacity-90 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Sticky Vertical Timeline Roadmap (Right Column)
 */
function StickyPhasedRoadmap({ results, criteria }) {
  const partnerItems = results.filter((r) => r.decision === 'PARTNER')
  const buildItems = results.filter((r) => r.decision === 'BUILD' || r.decision === 'HYBRID')
  const orderedBuild = [...buildItems].sort((a, b) => b.net - a.net)

  return (
    <div className="rounded-2xl border border-base-border bg-base-card p-4 sm:p-5 shadow-sm lg:sticky lg:top-24">
      <div className="border-b border-base-border/70 pb-3">
        <h3 className="font-display text-xs sm:text-sm font-extrabold tracking-tight text-base-text uppercase">
          Phased Roadmap
        </h3>
        <p className="text-[11px] text-base-dim mt-0.5">What gets built, and when</p>
      </div>

      <div className="mt-4 relative pl-4 border-l-2 border-base-border/80 space-y-5">
        {/* PHASE 1 */}
        <div className="relative">
          <div className="absolute -left-[21px] top-0 h-3.5 w-3.5 rounded-full border-2 border-partner bg-base-card shadow-xs" />
          <div className="flex items-center gap-2">
            <span className="badge-partner text-[10px]">PHASE 1</span>
          </div>

          {partnerItems.length > 0 ? (
            <div className="mt-2 space-y-2">
              {partnerItems.map((item) => (
                <div key={item.id} className="rounded-lg border border-partner-border/40 bg-partner-dim/20 p-2.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-base-text">{item.name}</span>
                    <span className="badge-partner text-[9px] px-1 py-0">PARTNER</span>
                  </div>
                  <p className="mt-1 text-[10px] text-base-dim leading-snug">Integrate banking &amp; compliance rails</p>
                  <p className="mt-1.5 font-mono text-[9px] text-base-muted border-t border-base-border/40 pt-1">
                    {decisionGate(item)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-1.5 text-xs text-base-muted italic">No partner components in Phase 1.</p>
          )}
        </div>

        {/* PHASE 2 */}
        <div className="relative">
          <div className="absolute -left-[21px] top-0 h-3.5 w-3.5 rounded-full border-2 border-build bg-base-card shadow-xs" />
          <div className="flex items-center gap-2">
            <span className="badge-build text-[10px]">PHASE 2</span>
          </div>

          {orderedBuild.length > 0 ? (
            <div className="mt-2 space-y-2">
              {orderedBuild.map((item) => {
                const meta = decisionMeta[item.decision]
                const engineeringCriterion = criteria.find((c) => c.id === 'engineering')
                const eng = engineeringCriterion && item.scores.engineering !== undefined ? item.scores.engineering : 3
                return (
                  <div
                    key={item.id}
                    className={`rounded-lg border p-2.5 ${
                      item.decision === 'BUILD'
                        ? 'border-build-border/40 bg-build-dim/20'
                        : 'border-hybrid-border/40 bg-hybrid-dim/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-base-text">{item.name}</span>
                      <span className={`badge ${meta.badgeClass} text-[9px] px-1 py-0`}>{item.decision}</span>
                    </div>
                    <p className="mt-1 font-mono text-[10px] text-base-dim">
                      Timeline: <span className="font-bold text-base-text">{engineeringTimeEstimate(eng)}</span>
                    </p>
                    <p className="mt-1.5 font-mono text-[9px] text-base-muted border-t border-base-border/40 pt-1">
                      {decisionGate(item)}
                    </p>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="mt-1.5 text-xs text-base-muted italic">No build/hybrid components in Phase 2.</p>
          )}
        </div>

        {/* PHASE 3 */}
        <div className="relative">
          <div className="absolute -left-[21px] top-0 h-3.5 w-3.5 rounded-full border-2 border-hybrid bg-base-card shadow-xs" />
          <div className="flex items-center gap-2">
            <span className="badge-hybrid text-[10px]">PHASE 3</span>
            <span className="font-mono text-[10px] font-bold text-hybrid uppercase">Validation</span>
          </div>
          <div className="mt-2 rounded-lg border border-hybrid-border/40 bg-hybrid-dim/20 p-2.5">
            <p className="text-xs font-bold text-base-text">Validate before real capital</p>
            <ul className="mt-1.5 space-y-1 text-[10px] text-base-dim leading-snug list-disc pl-3">
              <li>Security review &amp; penetration testing</li>
              <li>Paper trading &amp; failure drills</li>
              <li>Reconciliation &amp; failover tests</li>
              <li>Controlled volume ramp</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function RecommendationTable({ results, onOpenReason }) {
  return (
    <div className="rounded-2xl border border-base-border bg-base-card p-4 shadow-sm sm:p-5">
      <div className="border-b border-base-border/70 pb-3">
        <h3 className="font-display text-xs font-extrabold uppercase tracking-tight text-base-text sm:text-sm">
          Recommendations
        </h3>
        <p className="mt-0.5 text-[11px] text-base-dim">Decision, ownership, and pressure at a glance</p>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-base-border">
        <table className="w-full min-w-[34rem] border-collapse text-left font-mono text-[11px]">
          <thead>
            <tr className="border-b border-base-border bg-base-panel text-[9px] uppercase tracking-wider text-base-dim">
              <th className="px-3 py-2.5 font-bold">Component</th>
              <th className="px-3 py-2.5 text-center font-bold">Decision</th>
              <th className="min-w-[9rem] px-3 py-2.5 font-bold">Ownership</th>
              <th className="px-3 py-2.5 text-right font-bold">Net</th>
              <th className="px-3 py-2.5 text-right font-bold">Why</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row, index) => {
              const meta = decisionMeta[row.decision]
              return (
                <tr
                  key={row.id}
                  className={`border-b border-base-border/60 last:border-b-0 ${index % 2 === 1 ? 'bg-base-panel/35' : 'bg-base-card'}`}
                >
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span aria-hidden="true">{row.icon}</span>
                      <span className="font-sans text-xs font-bold text-base-text">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className={`badge ${meta.badgeClass} text-[9px]`}>{meta.label}</span>
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-sans text-[10px] leading-tight text-base-dim">{ownershipLabel(row.decision)}</p>
                  </td>
                  <td className="px-3 py-3 text-right align-top">
                    <span className={`font-bold ${meta.text}`}>
                      {row.net >= 0 ? '+' : ''}{row.net.toFixed(2)}
                    </span>
                    <NetPressureBar net={row.net} />
                  </td>
                  <td className="px-3 py-3 text-right align-top">
                    <button
                      type="button"
                      onClick={() => onOpenReason(row)}
                      className="rounded border border-base-border bg-base-panel px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-base-dim transition hover:border-hybrid-border hover:text-hybrid"
                    >
                      [ WHY? ]
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function ScoringMatrix() {
  const [criteria, setCriteria] = useState(() => {
    try {
      const saved = window.localStorage.getItem('mochatrade-scoring-scenario')
      const parsed = saved ? JSON.parse(saved) : null
      return Array.isArray(parsed?.criteria) ? parsed.criteria : defaultCriteria
    } catch {
      return defaultCriteria
    }
  })
  const [components, setComponents] = useState(() => {
    try {
      const saved = window.localStorage.getItem('mochatrade-scoring-scenario')
      const parsed = saved ? JSON.parse(saved) : null
      return Array.isArray(parsed?.components) ? parsed.components : defaultComponents
    } catch {
      return defaultComponents
    }
  })

  const [activeReasonModal, setActiveReasonModal] = useState(null)

  useEffect(() => {
    window.localStorage.setItem('mochatrade-scoring-scenario', JSON.stringify({ criteria, components }))
  }, [criteria, components])

  const results = useMemo(
    () =>
      components.map((comp) => {
        const net = computeNetScore(comp, criteria)
        const decision = classify(net)
        return {
          ...comp,
          net,
          decision,
          drivers: topDrivers(comp, criteria),
          reason: decisionReason(comp, criteria, decision),
        }
      }),
    [components, criteria]
  )

  const totalWeight = criteria.reduce((s, c) => s + Number(c.weight || 0), 0)
  const hasUsableWeights = totalWeight > 0

  const updateWeight = (id, weight) => {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, weight: Number(weight) } : c)))
  }
  const togglePolarity = (id) => {
    setCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, polarity: c.polarity === 'build' ? 'partner' : 'build' } : c))
    )
  }
  const renameCriterion = (id, label) => {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, label } : c)))
  }
  const removeCriterion = (id) => {
    setCriteria((prev) => prev.filter((c) => c.id !== id))
    setComponents((prev) =>
      prev.map((comp) => {
        const { [id]: _drop, ...rest } = comp.scores
        return { ...comp, scores: rest }
      })
    )
  }
  const addCriterion = () => {
    const id = nextId('crit')
    setCriteria((prev) => [...prev, { id, label: 'New criterion', hint: 'Click to describe this criterion.', polarity: 'partner', weight: 10 }])
    setComponents((prev) => prev.map((comp) => ({ ...comp, scores: { ...comp.scores, [id]: 3 } })))
  }

  const updateScore = (compId, critId, score) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === compId ? { ...c, scores: { ...c.scores, [critId]: score } } : c))
    )
  }
  const renameComponent = (compId, name) => {
    setComponents((prev) => prev.map((c) => (c.id === compId ? { ...c, name } : c)))
  }
  const removeComponent = (compId) => {
    setComponents((prev) => prev.filter((c) => c.id !== compId))
  }
  const addComponent = () => {
    const id = nextId('comp')
    const scores = Object.fromEntries(criteria.map((c) => [c.id, 3]))
    setComponents((prev) => [...prev, { id, icon: '➕', name: 'New component', scores }])
  }

  const resetDefaults = () => {
    setCriteria(defaultCriteria)
    setComponents(defaultComponents)
  }

  return (
    <section id="scoring-matrix" aria-labelledby="scoring-matrix-heading" className="scroll-mt-28 space-y-6">
      {/* PAGE HEADER */}
      <div className="panel p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-base-border/70 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 id="scoring-matrix-heading" className="font-display text-xl font-bold tracking-tight text-base-text">
                Scoring Matrix
              </h2>
              <span className="badge-hybrid">LIVE MODEL</span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-base-dim font-medium">
              Tune the economics. See the architecture change.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={resetDefaults}
              className="rounded-md border border-base-border bg-base-panel px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-base-dim transition hover:border-base-muted hover:text-base-text cursor-pointer"
            >
              ↺ Reset
            </button>
            <span className="font-mono text-[10px] uppercase tracking-wider text-base-muted bg-base-panel px-2.5 py-1.5 rounded-md border border-base-border/60">
              Saved locally
            </span>
          </div>
        </div>

        {/* DECISION SNAPSHOT */}
        <div className="mt-5 rounded-xl border border-hybrid-border/60 bg-hybrid-dim/10 p-3.5 sm:p-4">
          <div className="flex items-center justify-between gap-2 border-b border-hybrid-border/30 pb-2">
            <h3 className="font-mono text-[11px] font-bold uppercase tracking-wider text-hybrid">
              Decision Snapshot
            </h3>
            <span className="font-mono text-[10px] text-base-dim">Strategic Control Center</span>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {results.map((row) => {
              const meta = decisionMeta[row.decision]
              return (
                <div key={row.id} className="rounded-lg border border-base-border bg-base-card p-3 shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="truncate text-xs font-bold text-base-text flex items-center gap-1">
                        <span aria-hidden="true">{row.icon}</span>
                        <span className="truncate">{row.name}</span>
                      </span>
                      <span className={`badge ${meta.badgeClass} shrink-0 text-[10px]`}>
                        {row.decision}
                      </span>
                    </div>
                    <div className="mt-2 font-mono text-[11px] font-bold text-base-text">
                      net {row.net >= 0 ? '+' : ''}{row.net.toFixed(2)}
                    </div>
                    <p className="mt-1 text-[11px] leading-snug text-base-dim font-medium">
                      {ownershipLabel(row.decision)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: ~70% (col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* CRITERIA & WEIGHTS */}
          <div className="panel p-4 sm:p-5">
            <div className="flex items-center justify-between border-b border-base-border/70 pb-3">
              <div>
                <h3 className="font-mono text-[11px] font-bold uppercase tracking-wider text-base-dim">
                  Criteria &amp; Weights <span className="text-base-muted font-normal">(normalized to {totalWeight}% total)</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={addCriterion}
                className="rounded-md border border-base-border bg-base-panel px-2.5 py-1 font-mono text-[10.5px] font-bold uppercase tracking-wider text-base-dim transition hover:border-hybrid-border hover:text-hybrid cursor-pointer"
              >
                + Add criterion
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {criteria.map((c) => (
                <div key={c.id} className="rounded-xl border border-base-border bg-base-panel/60 p-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <input
                        value={c.label}
                        onChange={(e) => renameCriterion(c.id, e.target.value)}
                        className="w-full bg-transparent font-mono text-[11px] font-bold uppercase tracking-wider text-base-text outline-none focus:text-hybrid"
                      />
                      <button
                        type="button"
                        onClick={() => removeCriterion(c.id)}
                        aria-label={`Remove ${c.label}`}
                        className="shrink-0 text-base-muted transition hover:text-red-500 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="mt-1 text-[10.5px] leading-tight text-base-dim min-h-[2rem]">{c.hint}</p>

                    <div className="mt-3 flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={c.weight}
                        onChange={(e) => updateWeight(c.id, e.target.value)}
                        className="h-1.5 flex-1 accent-hybrid cursor-pointer"
                      />
                      <span className="w-9 shrink-0 text-right font-mono text-xs font-bold text-base-text">{c.weight}%</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => togglePolarity(c.id)}
                    className={`mt-3 w-full rounded-md border px-2 py-1 font-mono text-[9.5px] font-bold uppercase tracking-wider transition cursor-pointer ${
                      c.polarity === 'build'
                        ? 'border-build-border bg-build-dim text-build'
                        : 'border-partner-border bg-partner-dim text-partner'
                    }`}
                  >
                    HIGH SCORE → {c.polarity === 'build' ? 'BUILD' : 'PARTNER'}
                  </button>
                </div>
              ))}
            </div>

            {!hasUsableWeights && (
              <p className="mt-3 rounded-md border border-amber-500/40 bg-amber-950/30 px-3 py-2 text-xs text-amber-200">
                Add weight to at least one criterion to produce a recommendation.
              </p>
            )}
          </div>

          {/* SCORING MATRIX TABLE */}
          <div className="panel p-4 sm:p-5">
            <div className="flex items-center justify-between border-b border-base-border/70 pb-3">
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-wider text-base-dim">
                Scoring Matrix
              </h3>
              <button
                type="button"
                onClick={addComponent}
                className="rounded-md border border-base-border bg-base-panel px-2.5 py-1 font-mono text-[10.5px] font-bold uppercase tracking-wider text-base-dim transition hover:border-build-border hover:text-build cursor-pointer"
              >
                + Add component
              </button>
            </div>

            <div className="mt-4 overflow-x-auto rounded-xl border border-base-border">
              <table className="w-full min-w-[56rem] border-collapse text-left font-mono text-[12px]">
                <thead>
                  <tr className="bg-base-panel text-[10px] uppercase tracking-wider text-base-dim border-b border-base-border">
                    <th className="sticky left-0 z-20 bg-base-panel w-48 min-w-[12rem] px-3.5 py-3 font-bold border-r border-base-border/50">
                      Component
                    </th>
                    {criteria.map((c) => (
                      <th key={c.id} className="min-w-[7.5rem] px-2 py-3 text-center font-bold">
                        <div>{c.label}</div>
                        <div className="font-normal text-[9px] text-base-muted mt-0.5">{c.weight}%</div>
                        <button
                          type="button"
                          onClick={() => togglePolarity(c.id)}
                          className={`mt-1 inline-block rounded px-1 py-0.5 text-[8.5px] font-bold tracking-normal transition cursor-pointer ${
                            c.polarity === 'build' ? 'bg-build-dim text-build' : 'bg-partner-dim text-partner'
                          }`}
                        >
                          {c.polarity === 'build' ? 'BUILD ↑' : 'PARTNER ↑'}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, i) => {
                    const meta = decisionMeta[row.decision]
                    return (
                      <tr key={row.id} className={`align-middle ${i % 2 === 1 ? 'bg-base-card/60' : 'bg-base-card'}`}>
                        {/* Component Name (Sticky Column) */}
                        <td className="sticky left-0 z-10 bg-base-card w-48 min-w-[12rem] border-b border-r border-base-border/50 px-3.5 py-3">
                          <div className="flex items-center gap-2">
                            <span className="shrink-0 text-base" aria-hidden="true">{row.icon}</span>
                            <input
                              value={row.name}
                              onChange={(e) => renameComponent(row.id, e.target.value)}
                              className="min-w-0 flex-1 bg-transparent font-sans text-xs font-bold text-base-text outline-none focus:text-hybrid"
                            />
                            <button
                              type="button"
                              onClick={() => removeComponent(row.id)}
                              aria-label={`Remove ${row.name}`}
                              className="shrink-0 text-base-muted transition hover:text-red-500 cursor-pointer text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        </td>

                        {/* Criteria Score Rails */}
                        {criteria.map((c) => (
                          <td key={c.id} className="border-b border-base-border/50 px-2 py-3 text-center">
                            <div className="flex justify-center">
                              <IntensityRail
                                value={row.scores[c.id] === undefined ? 3 : row.scores[c.id]}
                                onChange={(v) => updateScore(row.id, c.id, v)}
                                criterionLabel={c.label}
                              />
                            </div>
                          </td>
                        ))}

                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ~30% (col-span-4) - Sticky Phased Roadmap */}
        <div className="lg:col-span-4">
          <StickyPhasedRoadmap results={results} criteria={criteria} />
          <div className="mt-6">
            <RecommendationTable results={results} onOpenReason={setActiveReasonModal} />
          </div>
        </div>
      </div>

      {/* WHY REASON MODAL */}
      {activeReasonModal && (
        <WhyReasonModal
          row={activeReasonModal}
          criteria={criteria}
          onClose={() => setActiveReasonModal(null)}
        />
      )}
    </section>
  )
}

