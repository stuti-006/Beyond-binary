import { useEffect, useRef, useState } from 'react'
import { failureScenarios } from '../data/failureScenarios.js'
import { tagMeta } from '../data/theme.js'

const STEP_DELAY_MS = 540

const statusIcon = { ok: '✅', warn: '⚠️', error: '❌' }

const bannerTone = {
  success: 'border-hybrid-border bg-hybrid-dim text-hybrid shadow-[0_0_15px_rgba(47,158,68,0.25)]',
  blocked: 'border-red-300 bg-red-50 text-red-800 shadow-[0_0_15px_rgba(239,68,68,0.18)]',
  warn: 'border-amber-300 bg-amber-50 text-amber-800 shadow-[0_0_15px_rgba(245,158,11,0.18)]',
}

const resultTone = {
  hybrid: 'border-hybrid-border bg-hybrid-dim text-hybrid shadow-[0_0_12px_rgba(47,158,68,0.3)]',
  blocked: 'border-red-300 bg-red-50 text-red-800 shadow-[0_0_12px_rgba(239,68,68,0.22)]',
  retry: 'border-amber-300 bg-amber-50 text-amber-800 shadow-[0_0_12px_rgba(245,158,11,0.22)]',
}

const statusTone = {
  ok: 'border-hybrid-border bg-hybrid-dim text-hybrid',
  bad: 'border-red-300 bg-red-50 text-red-800',
  warn: 'border-amber-300 bg-amber-50 text-amber-800',
}

function StatusBoard({ board }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {board.map((s) => (
        <div key={s.label} className={`flex flex-col items-start gap-1 rounded-lg border px-3 py-2 ${statusTone[s.tone]}`}>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider opacity-80">{s.label}</span>
          <span className="font-mono text-sm font-extrabold">{s.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function FailureSimulator() {
  const [activeId, setActiveId] = useState(null)
  const [visibleCount, setVisibleCount] = useState(0)
  const [status, setStatus] = useState('idle') // idle | running | done
  const [showFailCase, setShowFailCase] = useState(false)
  const timeoutsRef = useRef([])

  const clearTimers = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t))
    timeoutsRef.current = []
  }

  useEffect(() => () => clearTimers(), [])

  const scenario = failureScenarios.find((s) => s.id === activeId)

  const inject = (id) => {
    clearTimers()
    setActiveId(id)
    setVisibleCount(0)
    setStatus('running')
    setShowFailCase(false)

    const target = failureScenarios.find((s) => s.id === id)

    target.timeline.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisibleCount(i + 1)
        if (i === target.timeline.length - 1) {
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
      className="relative overflow-hidden rounded-3xl border border-build-border/70 bg-gradient-to-br from-white via-white to-[#fff7f1] p-5 shadow-[0_22px_55px_-28px_rgba(213,107,46,0.38)] sm:p-7"
    >
      <div className="absolute right-0 top-0 h-16 w-16 overflow-hidden pointer-events-none">
        <div className="absolute right-[-24px] top-[12px] w-28 rotate-45 bg-build py-0.5 text-center font-mono text-[9px] font-bold uppercase tracking-widest text-black shadow-md">
          FAILURE LAB
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-build-border/50 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 id="failure-sim-heading" className="font-display text-xl font-extrabold tracking-tight text-base-text">
              Vendor Failure Simulator
            </h2>
            <span className="badge-build">DESIGN FOR FAILURE</span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-base-dim font-medium">
            Inject real-world vendor outages into the trade pipeline. A vendor failure must never become
            an uncontrolled product failure.
          </p>
        </div>
      </div>

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
                  ? 'border-build bg-build-dim text-base-text shadow-glow-build scale-[1.02]'
                  : 'border-base-border bg-base-panel text-base-text hover:border-build-border hover:bg-build-dim/40'
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-bold">
                <span className="text-base" aria-hidden="true">💥</span>
                <span>{s.buttonLabel}</span>
              </span>
              <span className="mt-1.5 text-[11px] text-base-dim leading-snug">{s.target}</span>
            </button>
          )
        })}
      </div>

      {!scenario && (
        <div className="mt-6 rounded-xl border-2 border-dashed border-base-border bg-base-panel/40 py-10 text-center font-mono">
          <p className="text-xs sm:text-sm text-base-dim">
            &gt; Select a failure above to inject fault into the ₹2,000 LONG BTC-PERP pipeline.
          </p>
        </div>
      )}

      {scenario && (
        <>
          <div
            className="mt-5 min-h-[11rem] rounded-2xl border border-base-border bg-[#f8fafc] p-4 font-mono shadow-inner"
            role="log"
            aria-live="polite"
          >
            <div className="mb-3 flex items-center justify-between border-b border-base-border/50 pb-2 text-[11px]">
              <span className="font-bold text-build">ACTIVITY STREAM :: {scenario.buttonLabel}</span>
              <span className="text-base-dim">ADAPTER PROTOCOL ACTIVE</span>
            </div>

            {scenario.timeline.slice(0, visibleCount).map((line, i) => (
              <div key={i} className="console-line animate-fade-slide-up">
                <span className="text-base-text font-semibold text-xs sm:text-[13.5px]">{line.text}</span>
                <span className={`rounded border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${tagMeta[line.tag].chip}`}>
                  {line.tag} → {line.note}
                </span>
                <span className="ml-auto text-base" aria-hidden="true">{statusIcon[line.status]}</span>
              </div>
            ))}
            {status === 'running' && visibleCount < scenario.timeline.length && (
              <span className="mt-2 inline-block font-mono text-xs text-build font-bold animate-blink">&gt; INJECTING FAULT STEP... ▌</span>
            )}
          </div>

          {status === 'done' && (
            <div className="animate-fade-slide-up mt-5 space-y-3.5">
              <StatusBoard board={showFailCase && scenario.confidenceFailure ? [
                { label: 'FRESHNESS', value: 'EXCEEDED', tone: 'bad' },
                { label: 'DIVERGENCE', value: 'HIGH', tone: 'bad' },
                { label: 'PRICE CONFIDENCE', value: 'FAILED', tone: 'bad' },
                { label: 'TRADING PATH', value: 'PAUSED', tone: 'bad' },
              ] : scenario.statusBoard} />

              <div className="rounded-xl border border-base-border bg-base-panel/60 p-3.5">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-base-dim">BLAST RADIUS</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-base-muted">What remains protected</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  {scenario.blastRadius.map((item) => (
                    <div key={item.label} className={`rounded-md border px-2.5 py-2 ${statusTone[item.tone]}`}>
                      <p className="font-mono text-[10px] uppercase tracking-wider opacity-80">{item.label}</p>
                      <p className="mt-0.5 font-mono text-xs font-extrabold">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs font-bold text-base-dim uppercase tracking-wider">RESULT STATUS ::</span>
                <div className={`inline-flex rounded-md border px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider ${resultTone[showFailCase ? 'blocked' : scenario.resultTone]}`}>
                  {showFailCase && scenario.confidenceFailure ? 'TRADING PATH PAUSED' : scenario.resultLabel}
                </div>
                {scenario.confidenceFailure && (
                  <button
                    type="button"
                    onClick={() => setShowFailCase((v) => !v)}
                    className="rounded-md border border-base-border bg-base-panel px-3 py-1 font-mono text-[11px] font-bold text-base-dim transition hover:text-base-text"
                  >
                    {showFailCase ? '↩ VIEW PRIMARY OUTCOME' : `↗ ${scenario.confidenceFailure.label.toUpperCase()}`}
                  </button>
                )}
              </div>

              {scenario.userMessage && !showFailCase && (
                <div className="rounded-xl border border-build-border/60 bg-build-dim/60 p-4 font-mono">
                  <div className="flex items-start gap-2">
                    <span className="text-base" aria-hidden="true">🚨</span>
                    <p className="text-xs sm:text-sm font-bold text-base-text">{scenario.message}</p>
                  </div>
                </div>
              )}

              {showFailCase && scenario.confidenceFailure && (
                <div className="rounded-xl border border-red-500/60 bg-red-950/40 p-4 font-mono shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  <div className="flex flex-wrap gap-2">
                    {scenario.confidenceFailure.blocks.map((b) => (
                      <span key={b} className="rounded-md border border-red-500/60 bg-red-950/50 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-red-300">
                        {b}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-red-200">
                    {scenario.confidenceFailure.note}
                  </p>
                </div>
              )}

              <div className={`rounded-xl border p-4 ${bannerTone[scenario.banner.tone]}`}>
                <p className="font-display text-xs sm:text-sm font-bold leading-relaxed">{scenario.banner.text}</p>
              </div>

              <div className="rounded-xl border border-build-border/60 bg-build-dim/60 p-4 font-mono">
                <span className="text-[11px] font-bold uppercase tracking-wider text-build">ARCHITECTURE TAKEAWAY ::</span>
                <p className="mt-1 text-xs sm:text-sm font-medium text-base-text leading-relaxed">
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