import { useEffect, useRef, useState } from 'react'
import { tradeFlowSteps, failureScenarios } from '../data/components.js'

const STEP_DELAY_MS = 550

const tagStyles = {
  'OUR CODE': 'bg-build-dim border-build-border text-build shadow-[0_0_8px_rgba(232,89,12,0.2)]',
  'VENDOR API': 'bg-partner-dim border-partner-border text-partner shadow-[0_0_8px_rgba(25,113,194,0.2)]',
  HYBRID: 'bg-hybrid-dim border-hybrid-border text-hybrid shadow-[0_0_8px_rgba(47,158,68,0.2)]',
}

const statusIcon = { ok: '✅', warn: '⚠️', error: '❌' }

const bannerTone = {
  success: 'border-hybrid-border bg-hybrid-dim text-hybrid shadow-[0_0_15px_rgba(47,158,68,0.25)]',
  blocked: 'border-red-500/50 bg-red-950/50 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.25)]',
  warn: 'border-amber-500/50 bg-amber-950/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]',
}

const resultTone = {
  hybrid: 'border-hybrid-border bg-hybrid-dim text-hybrid shadow-[0_0_12px_rgba(47,158,68,0.3)]',
  blocked: 'border-red-500/50 bg-red-950/50 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.3)]',
  retry: 'border-amber-500/50 bg-amber-950/50 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]',
}

function buildTimeline(scenario) {
  const injectIndex = tradeFlowSteps.findIndex((s) => s.id === scenario.injectAtStep)
  const before = tradeFlowSteps.slice(0, injectIndex).map((s) => ({
    kind: 'normal',
    tag: s.tag,
    text: s.label,
    note: `${s.detail}${s.txHash ? ` · tx ${s.txHash}` : ''}`,
    status: 'ok',
  }))
  const overrides = scenario.consoleOverride.map((o) => ({ kind: 'override', ...o }))
  const after =
    scenario.outcome === 'degraded-safe'
      ? tradeFlowSteps.slice(injectIndex + 1).map((s) => ({
          kind: 'normal',
          tag: s.tag,
          text: s.label,
          note: `${s.detail}${s.txHash ? ` · tx ${s.txHash}` : ''}`,
          status: 'ok',
        }))
      : []
  return [...before, ...overrides, ...after]
}

export default function FailureSimulator() {
  const [activeId, setActiveId] = useState(null)
  const [visibleCount, setVisibleCount] = useState(0)
  const [status, setStatus] = useState('idle') // idle | running | done
  const timeoutsRef = useRef([])

  const clearTimers = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t))
    timeoutsRef.current = []
  }

  useEffect(() => () => clearTimers(), [])

  const scenario = failureScenarios.find((s) => s.id === activeId)
  const timeline = scenario ? buildTimeline(scenario) : []

  const inject = (id) => {
    clearTimers()
    setActiveId(id)
    setVisibleCount(0)
    setStatus('running')

    const target = failureScenarios.find((s) => s.id === id)
    const fullTimeline = buildTimeline(target)

    fullTimeline.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisibleCount(i + 1)
        if (i === fullTimeline.length - 1) {
          const doneTimer = setTimeout(() => setStatus('done'), STEP_DELAY_MS)
          timeoutsRef.current.push(doneTimer)
        }
      }, STEP_DELAY_MS * i)
      timeoutsRef.current.push(t)
    })
  }

  return (
    <section
      aria-labelledby="failure-sim-heading"
      className="relative overflow-hidden rounded-2xl border-2 border-build bg-gradient-to-b from-[#180f0a] via-[#0d1117] to-[#080b0f] p-5 sm:p-7 shadow-[0_0_40px_rgba(232,89,12,0.22)]"
    >
      {/* Corner hazard marker */}
      <div className="absolute right-0 top-0 h-16 w-16 overflow-hidden pointer-events-none">
        <div className="absolute right-[-24px] top-[12px] w-28 rotate-45 bg-build py-0.5 text-center font-mono text-[9px] font-bold uppercase tracking-widest text-black shadow-md">
          STAR TEST
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-build-border/50 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 id="failure-sim-heading" className="font-display text-xl font-extrabold tracking-tight text-white">
              Vendor Failure Simulator
            </h2>
            <span className="badge-build">THE ADAPTER LAYER STRESS-TEST</span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-base-dim font-medium">
            Inject real-world vendor outages into the trade pipeline. Proves MochaTrade's adapter bus protects custody & risk engine guarantees.
          </p>
        </div>
      </div>

      {/* Injection Control Grid */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {failureScenarios.map((s) => {
          const isSelected = activeId === s.id
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => inject(s.id)}
              disabled={status === 'running'}
              className={`group relative flex flex-col items-start rounded-xl border p-4 text-left font-mono transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                isSelected
                  ? 'border-build bg-build-dim text-white shadow-glow-build scale-[1.02]'
                  : 'border-base-border bg-base-panel text-base-text hover:border-build-border hover:bg-build-dim/40'
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-bold">
                <span className="text-base">💥</span>
                <span>{s.buttonLabel}</span>
              </span>
              <span className="mt-1.5 text-[11px] text-base-dim leading-snug">
                Target: {s.injectAtStep === 'kyc-check' ? 'KYC Vendor Timeout' : s.injectAtStep === 'fetch-prices' ? 'Primary Oracle Outage' : 'UPI Rail Timeout'}
              </span>
            </button>
          )
        })}
      </div>

      {!scenario && (
        <div className="mt-6 rounded-xl border-2 border-dashed border-base-border bg-base-panel/40 py-10 text-center font-mono">
          <p className="text-xs sm:text-sm text-base-dim">
            &gt; Select a vendor failure above to inject fault into the ₹2,000 LONG BTC-PERP pipeline.
          </p>
        </div>
      )}

      {scenario && (
        <>
          {/* Diagnostic Console Log */}
          <div
            className="mt-5 min-h-[11rem] rounded-xl border border-base-border bg-[#05070a] p-4 font-mono shadow-inner"
            role="log"
            aria-live="polite"
          >
            <div className="mb-3 flex items-center justify-between border-b border-base-border/50 pb-2 text-[11px]">
              <span className="font-bold text-build">FAULT INJECTION STREAM :: {scenario.buttonLabel.toUpperCase()}</span>
              <span className="text-base-dim">ADAPTER PROTOCOL ACTIVE</span>
            </div>

            {timeline.slice(0, visibleCount).map((line, i) => (
              <div key={i} className="console-line animate-fade-slide-up">
                <span className="text-white font-semibold text-xs sm:text-[13.5px]">{line.text}</span>
                <span className={`rounded border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${tagStyles[line.tag]}`}>
                  {line.tag} → {line.note}
                </span>
                <span className="ml-auto text-base" aria-hidden="true">{statusIcon[line.status]}</span>
              </div>
            ))}
            {status === 'running' && visibleCount < timeline.length && (
              <span className="mt-2 inline-block font-mono text-xs text-build font-bold animate-blink">&gt; INJECTING FAULT STEP... ▌</span>
            )}
          </div>

          {/* Diagnostic Takeaway & Outcome Banners */}
          {status === 'done' && (
            <div className="animate-fade-slide-up mt-5 space-y-3.5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-base-dim uppercase tracking-wider">RESULT STATUS ::</span>
                <div className={`inline-flex rounded-md border px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider ${resultTone[scenario.resultTone]}`}>
                  {scenario.resultLabel}
                </div>
              </div>

              {scenario.userMessage && (
                <div
                  className={`rounded-xl border p-4 font-mono ${
                    scenario.outcome === 'blocked'
                      ? 'border-red-500/60 bg-red-950/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                      : 'border-amber-500/60 bg-amber-950/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-base">🚨</span>
                    <p className={`text-xs sm:text-sm font-bold ${scenario.outcome === 'blocked' ? 'text-red-300' : 'text-amber-300'}`}>
                      {scenario.userMessage}
                    </p>
                  </div>
                </div>
              )}

              <div className={`rounded-xl border p-4 ${bannerTone[scenario.banner.tone]}`}>
                <p className="font-display text-xs sm:text-sm font-bold leading-relaxed">{scenario.banner.text}</p>
              </div>

              <div className="rounded-xl border border-build-border/60 bg-build-dim/60 p-4 font-mono">
                <span className="text-[11px] font-bold uppercase tracking-wider text-build">ARCHITECTURE TAKEAWAY ::</span>
                <p className="mt-1 text-xs sm:text-sm font-medium text-white leading-relaxed">
                  {scenario.takeaway}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}

