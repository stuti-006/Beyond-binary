import { useEffect, useRef, useState } from 'react'
import { tradeFlowSteps, tradeFlowSummary, tradeOrder, getComponent } from '../data/components.js'

const STEP_DELAY_MS = 650

const tagStyles = {
  'OUR CODE': { text: 'text-build', chip: 'bg-build-dim border-build-border text-build shadow-[0_0_8px_rgba(232,89,12,0.2)]' },
  'VENDOR API': { text: 'text-partner', chip: 'bg-partner-dim border-partner-border text-partner shadow-[0_0_8px_rgba(25,113,194,0.2)]' },
  HYBRID: { text: 'text-hybrid', chip: 'bg-hybrid-dim border-hybrid-border text-hybrid shadow-[0_0_8px_rgba(47,158,68,0.2)]' },
}

function formatClock(cumulativeMs) {
  const base = new Date()
  base.setHours(9, 41, 2, 0)
  base.setMilliseconds(base.getMilliseconds() + cumulativeMs)
  const hh = String(base.getHours()).padStart(2, '0')
  const mm = String(base.getMinutes()).padStart(2, '0')
  const ss = String(base.getSeconds()).padStart(2, '0')
  const ms = String(base.getMilliseconds()).padStart(3, '0')
  return `${hh}:${mm}:${ss}.${ms}`
}

export default function TradeFlow() {
  const [status, setStatus] = useState('idle') // idle | running | done
  const [visibleCount, setVisibleCount] = useState(0)
  const timeoutsRef = useRef([])

  const clearTimers = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t))
    timeoutsRef.current = []
  }

  useEffect(() => () => clearTimers(), [])

  const run = () => {
    clearTimers()
    setStatus('running')
    setVisibleCount(0)

    tradeFlowSteps.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisibleCount(i + 1)
        if (i === tradeFlowSteps.length - 1) {
          const doneTimer = setTimeout(() => setStatus('done'), STEP_DELAY_MS)
          timeoutsRef.current.push(doneTimer)
        }
      }, STEP_DELAY_MS * i)
      timeoutsRef.current.push(t)
    })
  }

  let cumulative = 0
  const cumulativeAt = tradeFlowSteps.map((s) => {
    cumulative += s.latencyMs
    return cumulative
  })

  return (
    <section aria-labelledby="trade-flow-heading" className="panel p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-base-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 id="trade-flow-heading" className="font-display text-lg font-bold tracking-tight text-base-text">
              Live Trade Flow Simulator
            </h2>
            <span className="badge-hybrid font-mono">REAL-TIME ROUTING</span>
          </div>
          <p className="mt-1 text-xs sm:text-sm font-mono text-base-dim">
            ORDER PARAMS :: <span className="text-white font-bold">{tradeOrder.notional} {tradeOrder.side} {tradeOrder.market}</span>, <span className="text-build font-bold">{tradeOrder.leverage}</span>
          </p>
        </div>

        <div className="flex gap-2">
          {status !== 'idle' && (
            <button
              type="button"
              onClick={run}
              className="rounded-lg border border-base-border bg-base-panel px-3.5 py-2 font-mono text-xs font-semibold text-base-text transition hover:bg-base-border/50"
            >
              ↺ REPLAY
            </button>
          )}
          <button
            type="button"
            onClick={run}
            disabled={status === 'running'}
            className="rounded-lg bg-build px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-glow-build transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'running' ? '⚡ EXECUTING HOPS…' : `PLACE TEST TRADE — ${tradeOrder.notional} ${tradeOrder.side} ${tradeOrder.market}`}
          </button>
        </div>
      </div>

      {/* Execution Stepper */}
      <div className="mt-6 overflow-x-auto pb-2">
        <ol className="flex items-center gap-2 min-w-max">
          {tradeFlowSteps.map((step, i) => {
            const active = i < visibleCount
            const isCurrent = i === visibleCount - 1 && status === 'running'
            const styles = tagStyles[step.tag]
            return (
              <li key={step.id} className="flex shrink-0 items-center gap-2">
                <div
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-xs font-bold transition-all duration-200 ${
                    active ? styles.chip : 'border-base-border/70 bg-base-panel text-base-dim'
                  } ${isCurrent ? 'scale-105 ring-2 ring-build' : ''}`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      active ? 'bg-current animate-pulse' : 'bg-base-dim/40'
                    }`}
                    aria-hidden="true"
                  />
                  <span>{step.label}</span>
                </div>
                {i < tradeFlowSteps.length - 1 && (
                  <span className="font-mono text-xs text-base-dim/60" aria-hidden="true">
                    ➔
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </div>

      {/* Recessed Terminal Console Window */}
      <div
        className="mt-5 min-h-[10rem] rounded-xl border border-base-border bg-[#05070a] p-4 font-mono shadow-inner"
        role="log"
        aria-live="polite"
      >
        <div className="mb-3 flex items-center justify-between border-b border-base-border/50 pb-2 text-[11px] text-base-dim">
          <span className="font-bold tracking-wider text-base-dim">TELEMETRY CONSOLE STREAM</span>
          <span>LATENCY :: <span className="text-hybrid font-bold">{cumulative}ms TOTAL</span></span>
        </div>

        {visibleCount === 0 && (
          <p className="py-8 text-center text-xs sm:text-sm text-base-dim/70">
            &gt; Console stream ready. Click &quot;PLACE TEST TRADE&quot; above to trace order execution hops.
          </p>
        )}
        {tradeFlowSteps.slice(0, visibleCount).map((step, i) => {
          const styles = tagStyles[step.tag]
          const component = getComponent(step.componentId)
          return (
            <div key={step.id} className="console-line animate-fade-slide-up">
              <span className="text-base-dim font-bold text-[11.5px]">{formatClock(cumulativeAt[i])}</span>
              <span className="text-base-dim/50">|</span>
              <span className="text-white font-semibold">
                {step.label}
                {step.txHash ? <span className="text-build font-bold ml-1">[tx: {step.txHash}]</span> : ''}
              </span>
              <span className={`rounded border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${styles.chip}`}>
                {step.tag} → {step.detail}
              </span>
              <span className="ml-auto font-bold text-white bg-base-panel px-2 py-0.5 rounded border border-base-border text-[11.5px]">
                {step.latencyMs}ms
              </span>
              <span className="text-hybrid text-sm" aria-hidden="true">✅</span>
              <span className="sr-only">completed via {component.name}</span>
            </div>
          )
        })}
      </div>

      {/* Trade Summary */}
      {status === 'done' && (
        <div className="animate-fade-slide-up mt-4 rounded-xl border-2 border-hybrid-border bg-gradient-to-r from-[#0b1b13] to-[#0d1117] p-4 sm:p-5 shadow-[0_0_20px_rgba(47,158,68,0.2)]">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎉</span>
            <p className="font-display text-base font-bold text-white">{tradeFlowSummary.headline}</p>
          </div>
          <p className="mt-1 font-mono text-xs sm:text-sm text-base-dim">{tradeFlowSummary.subline}</p>
        </div>
      )}
    </section>
  )
}

