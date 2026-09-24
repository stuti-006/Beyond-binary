import { useMemo, useState } from 'react'
import {
  defaultCriteria,
  defaultComponents,
  computeNetScore,
  classify,
  topDrivers,
  decisionReason,
  engineeringTimeEstimate,
} from '../data/scoringMatrix.js'
import { decisionMeta } from '../data/theme.js'

let uid = 1000
const nextId = (prefix) => `${prefix}-${uid++}`

function ScoreDots({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`Score ${n} of 5`}
          className={`h-3.5 w-3.5 rounded-full border transition ${
            n <= value
              ? 'border-hybrid bg-hybrid shadow-[0_0_6px_rgba(47,158,68,0.6)]'
              : 'border-base-border bg-base-panel hover:border-base-dim'
          }`}
        />
      ))}
    </div>
  )
}

export default function ScoringMatrix() {
  const [criteria, setCriteria] = useState(defaultCriteria)
  const [components, setComponents] = useState(defaultComponents)

  const results = useMemo(
    () =>
      components.map((comp) => {
        const net = computeNetScore(comp, criteria)
        const decision = classify(net)
        return { ...comp, net, decision, drivers: topDrivers(comp, criteria), reason: decisionReason(comp, criteria, decision) }
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

  const buildItems = results.filter((r) => r.decision === 'BUILD' || r.decision === 'HYBRID')
  const partnerItems = results.filter((r) => r.decision === 'PARTNER')
  const orderedBuild = [...buildItems].sort((a, b) => b.net - a.net)

  return (
    <section id="scoring-matrix" aria-labelledby="scoring-matrix-heading" className="scroll-mt-28 panel p-4 sm:p-6">
      <div className="flex flex-col gap-2 border-b border-base-border/70 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="scoring-matrix-heading" className="font-display text-lg font-bold tracking-tight text-base-text">
            Build vs. Partner: The Infrastructure Dilemma
          </h2>
          <span className="badge-hybrid">LIVE SCORING MODEL</span>
        </div>
        <p className="text-xs sm:text-sm text-base-dim">Rent the plumbing, or build it, and own the risk?</p>
        <p className="text-xs text-base-dim">
          Scores seeded from Round 1&rsquo;s own economics. Tune weights below — the recommendation updates live.
        </p>
        <p className="text-xs text-base-muted">
          Score each cell from 1 (low) to 5 (high). The polarity tells the model whether a high score creates a build case or a partner case.
        </p>
      </div>

      {/* Criteria / weight controls */}
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-[11px] font-bold uppercase tracking-wider text-base-dim">
            Criteria &amp; Weights <span className="text-base-muted">(normalized to {totalWeight}% total)</span>
          </h3>
          <button
            type="button"
            onClick={addCriterion}
            className="rounded-md border border-base-border px-2.5 py-1 font-mono text-[10.5px] font-bold uppercase tracking-wider text-base-dim transition hover:border-hybrid-border hover:text-hybrid"
          >
            + Add criterion
          </button>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {criteria.map((c) => (
            <div key={c.id} className="rounded-xl border border-base-border bg-base-panel/60 p-3.5">
              <div className="flex items-start justify-between gap-2">
                <input
                  value={c.label}
                  onChange={(e) => renameCriterion(c.id, e.target.value)}
                  className="w-full bg-transparent font-mono text-[11px] font-bold uppercase tracking-wider text-base-text outline-none focus:text-hybrid"
                />
                <button
                  type="button"
                  onClick={() => removeCriterion(c.id)}
                  aria-label={`Remove ${c.label}`}
                  className="shrink-0 text-base-muted transition hover:text-red-400"
                >
                  ✕
                </button>
              </div>
              <p className="mt-1 text-[11px] leading-snug text-base-dim">{c.hint}</p>
              <p className="mt-1 font-mono text-[10px] text-base-muted">
                1 = low {c.polarity === 'build' ? 'build pressure' : 'partner pressure'} · 5 = high {c.polarity === 'build' ? 'build pressure' : 'partner pressure'}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={c.weight}
                  onChange={(e) => updateWeight(c.id, e.target.value)}
                  className="h-1.5 flex-1 accent-hybrid"
                />
                <span className="w-10 shrink-0 text-right font-mono text-xs font-bold text-base-text">{c.weight}</span>
              </div>

              <button
                type="button"
                onClick={() => togglePolarity(c.id)}
                className={`mt-2 w-full rounded-md border px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider transition ${
                  c.polarity === 'build'
                    ? 'border-build-border bg-build-dim text-build'
                    : 'border-partner-border bg-partner-dim text-partner'
                }`}
              >
                High score → favors {c.polarity === 'build' ? 'BUILD' : 'PARTNER'} (click to flip)
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

      {/* Scoring matrix */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-[11px] font-bold uppercase tracking-wider text-base-dim">Scoring Matrix</h3>
          <button
            type="button"
            onClick={addComponent}
            className="rounded-md border border-base-border px-2.5 py-1 font-mono text-[10.5px] font-bold uppercase tracking-wider text-base-dim transition hover:border-build-border hover:text-build"
          >
            + Add component
          </button>
        </div>

        <div className="mt-3 overflow-x-auto rounded-xl border border-base-border">
          <table className="w-full min-w-[56rem] border-collapse text-left font-mono text-[12px]">
            <thead>
              <tr className="bg-base-panel text-[10.5px] uppercase tracking-wider text-base-dim">
                <th className="w-56 min-w-[14rem] border-b border-base-border px-4 py-3 font-bold">Component</th>
                {criteria.map((c) => (
                  <th key={c.id} className="min-w-[7rem] border-b border-base-border px-3 py-3 text-center font-bold">
                    {c.label}
                  </th>
                ))}
                <th className="min-w-[11rem] border-b border-base-border px-4 py-3 text-center font-bold">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, i) => {
                const meta = decisionMeta[row.decision]
                return (
                  <tr key={row.id} className={`align-top ${i % 2 === 1 ? 'bg-base-card/60' : 'bg-base-card'}`}>
                    <td className="w-56 min-w-[14rem] border-b border-base-border/50 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="shrink-0" aria-hidden="true">{row.icon}</span>
                        <input
                          value={row.name}
                          onChange={(e) => renameComponent(row.id, e.target.value)}
                          className="min-w-0 flex-1 bg-transparent font-sans text-[13px] font-bold text-white outline-none focus:text-hybrid"
                        />
                        <button
                          type="button"
                          onClick={() => removeComponent(row.id)}
                          aria-label={`Remove ${row.name}`}
                          className="shrink-0 text-base-muted transition hover:text-red-400"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                    {criteria.map((c) => (
                      <td key={c.id} className="border-b border-base-border/50 px-3 py-3">
                        <div className="flex justify-center">
                          <ScoreDots
                            value={row.scores[c.id] === undefined ? 3 : row.scores[c.id]}
                            onChange={(v) => updateScore(row.id, c.id, v)}
                          />
                        </div>
                      </td>
                    ))}
                    <td className="min-w-[11rem] border-b border-base-border/50 px-4 py-3">
                      <div className="flex flex-col items-center gap-1 text-center">
                        <span className={`badge ${meta.badgeClass}`}>{meta.label}</span>
                        <span className="font-mono text-[10px] text-base-muted">net {row.net >= 0 ? '+' : ''}{row.net.toFixed(2)}</span>
                        <p className="max-w-[13rem] text-[10px] leading-snug text-base-dim">{row.reason}</p>
                        {row.drivers.length > 0 && (
                          <p className="max-w-[11rem] text-[10px] leading-snug text-base-dim">
                            {row.drivers
                              .map((d) => `${d.direction}: ${d.criterion.label} (${d.score}/5, ${d.contribution >= 0 ? '+' : ''}${d.contribution.toFixed(2)})`)
                              .join(' \u00b7 ')}
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={resetDefaults}
            className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-base-muted transition hover:text-base-dim"
          >
            ↺ Reset to Round 1 defaults
          </button>
        </div>
      </div>

      {/* Phased roadmap for anything BUILD or HYBRID */}
      <div className="mt-6 rounded-2xl border-2 border-base-border bg-gradient-to-b from-[#141a24] to-[#0d1117] p-4 sm:p-6">
        <h3 className="font-display text-base font-extrabold tracking-tight text-white">
          Phased Roadmap — What Gets Built, and When
        </h3>
        <p className="mt-1 text-xs text-base-dim">
          Partnered components integrate first; build and hybrid workstreams can run in parallel before validation gates.
        </p>

        <div className="mt-4 space-y-3">
          {partnerItems.length > 0 && (
            <div className="flex items-start gap-3 rounded-xl border border-partner-border bg-partner-dim/40 p-3.5">
              <span className="badge-partner shrink-0">PHASE 1</span>
              <div>
                <p className="text-sm font-bold text-white">
                  Integrate: {partnerItems.map((r) => r.name).join(', ')}
                </p>
                <div className="mt-1 space-y-1">
                  {partnerItems.map((row) => (
                    <p key={row.id} className="text-xs leading-snug text-base-dim">
                      <span className="font-semibold text-partner">{row.name}:</span> {row.reason}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {orderedBuild.map((row) => {
            const meta = decisionMeta[row.decision]
            const engineeringCriterion = criteria.find((criterion) => criterion.id === 'engineering')
            const eng = engineeringCriterion && row.scores.engineering !== undefined ? row.scores.engineering : 3
            return (
              <div
                key={row.id}
                className={`flex items-start gap-3 rounded-xl border p-3.5 ${
                  row.decision === 'BUILD' ? 'border-build-border bg-build-dim/40' : 'border-hybrid-border bg-hybrid-dim/40'
                }`}
              >
                <span className={`badge ${meta.badgeClass} shrink-0`}>PHASE 2</span>
                <div>
                  <p className="text-sm font-bold text-white">
                    {row.name} <span className="font-mono text-xs font-normal text-base-dim">— {engineeringTimeEstimate(eng)}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-base-dim">
                    {row.reason}
                  </p>
                </div>
              </div>
            )
          })}

          {orderedBuild.length > 0 && (
            <div className="flex items-start gap-3 rounded-xl border border-hybrid-border bg-hybrid-dim/40 p-3.5">
              <span className="badge-hybrid shrink-0">PHASE 3</span>
              <div>
                <p className="text-sm font-bold text-white">Validate before real capital</p>
                <p className="mt-0.5 text-xs text-base-dim">
                  Complete security review, paper trading, failure drills, reconciliation tests, vendor failover, and a controlled volume ramp before launch.
                </p>
              </div>
            </div>
          )}

          {orderedBuild.length === 0 && partnerItems.length === 0 && (
            <p className="text-center text-sm text-base-dim">Add components above to generate a roadmap.</p>
          )}
        </div>
      </div>
    </section>
  )
}
