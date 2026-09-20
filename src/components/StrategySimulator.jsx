import { useMemo, useState } from 'react'
import { strategyInputs, levels, evaluateStrategy } from '../data/strategySimulator.js'
import { decisionMeta } from '../data/theme.js'

const defaultInputs = Object.fromEntries(strategyInputs.map((i) => [i.id, 0.5]))

function Segmented({ options, value, onChange }) {
  return (
    <div className="flex rounded-lg border border-base-border bg-base-panel p-0.5">
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={`flex-1 rounded-md px-3 py-1.5 font-mono text-[11px] font-bold tracking-wider transition ${
              active ? 'bg-build text-white shadow-[0_0_10px_rgba(232,89,12,0.35)]' : 'text-base-dim hover:text-base-text'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

const bars = {
  BUILD: { label: 'BUILD', color: '#e8590c', chip: 'bg-build-dim border-build-border text-build' },
  PARTNER: { label: 'PARTNER', color: '#1971c2', chip: 'bg-partner-dim border-partner-border text-partner' },
  HYBRID: { label: 'HYBRID', color: '#2f9e44', chip: 'bg-hybrid-dim border-hybrid-border text-hybrid' },
}

export default function StrategySimulator() {
  const [draft, setDraft] = useState(defaultInputs)
  const [submitted, setSubmitted] = useState(defaultInputs)

  const result = useMemo(() => evaluateStrategy(submitted), [submitted])

  const setInput = (id, value) => {
    setDraft((prev) => ({ ...prev, [id]: value }))
  }

  const dirty = strategyInputs.some((i) => draft[i.id] !== submitted[i.id])

  return (
    <section id="simulator" aria-labelledby="simulator-heading" className="scroll-mt-28 panel p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-base-border/70 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="simulator-heading" className="font-display text-lg font-bold tracking-tight text-base-text">
              Strategy Scenario Mode
            </h2>
            <span className="badge-hybrid">INTERACTIVE MODEL</span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-base-dim">
            Tune five strategic pressures and watch the Build / Partner / Hybrid mix respond.
          </p>
        </div>
        <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-amber-300">
          ILLUSTRATIVE STRATEGIC MODEL
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {strategyInputs.map((input) => (
          <div key={input.id} className="flex flex-col justify-between gap-3 rounded-xl border border-base-border bg-base-panel/60 p-4">
            <div>
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-wider text-base-text">
                {input.label}
              </h3>
              <p className="mt-0.5 font-sans text-[11px] leading-snug text-base-dim">{input.hint}</p>
            </div>
            <div>
              <Segmented options={levels} value={draft[input.id]} onChange={(v) => setInput(input.id, v)} />
              <div className="mt-1.5 flex justify-between font-mono text-[9.5px] uppercase tracking-wider text-base-muted">
                <span>{input.low}</span>
                <span>{input.high}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setSubmitted(draft)}
          className="rounded-lg bg-hybrid px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-glow-hybrid transition hover:brightness-110"
        >
          ⏎ RUN STRATEGY MODEL
        </button>
        {dirty && (
          <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-amber-300 animate-blink">
            ↑ INPUTS TUNED — RUN TO COMMIT
          </span>
        )}
      </div>

      <div className="mt-5 rounded-2xl border-2 border-base-border bg-gradient-to-b from-[#141a24] to-[#0d1117] p-4 sm:p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <span className={`badge ${decisionMeta[result.dominant].badgeClass}`}>{result.dominant}</span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-base-dim">DOMINANT LEAN</span>
          </div>
          <p className="font-mono text-[10.5px] text-base-dim">
            HIGH ↘ BUILD · LOW ↘ PARTNER · LOW VENDOR CONFIDENCE ↘ HYBRID
          </p>
        </div>

        <h3 className="mt-4 font-display text-base sm:text-lg font-extrabold tracking-tight text-white">
          {result.headline.title}
        </h3>
        <p className="mt-1 max-w-3xl font-sans text-xs sm:text-sm leading-relaxed text-base-dim">
          {result.headline.text}
        </p>

        <div className="mt-5 space-y-2.5">
          {result.allocation.map((a) => (
            <div key={a.key} className="flex items-center gap-3">
              <span className={`w-20 shrink-0 rounded border px-1.5 py-0.5 text-center font-mono text-[10px] font-bold uppercase tracking-wider ${bars[a.key].chip}`}>
                {a.key}
              </span>
              <div className="h-4 flex-1 overflow-hidden rounded bg-base-panel">
                <div
                  className="h-full rounded transition-all duration-500"
                  style={{ width: `${a.value}%`, backgroundColor: bars[a.key].color }}
                />
              </div>
              <span className="w-12 shrink-0 text-right font-mono text-xs font-bold text-white">{a.value}%</span>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-base-border bg-base-panel/50 p-4">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-hybrid">RATIONALES ::</span>
          <ul className="mt-2 space-y-1.5">
            {result.rationale.map((r) => (
              <li key={r} className="flex items-start gap-2 font-sans text-xs leading-relaxed text-base-text">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-hybrid" aria-hidden="true" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}