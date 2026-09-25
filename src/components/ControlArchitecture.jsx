import { useEffect, useRef, useState } from 'react'
import {
  controlStack,
  vendorSwapSteps,
  vendorSwapClaims,
  controlMessage,
} from '../data/controlArchitecture.js'
import { tagMeta } from '../data/theme.js'

const STEP_DELAY_MS = 620

const statusIcon = { ok: '✅', warn: '⚠️', error: '❌' }

function TierBox({ heading, badgeClass, badgeLabel, items, accentClass }) {
  return (
    <div className={`w-full rounded-2xl border-2 ${accentClass} bg-gradient-to-b from-base-card to-base-panel p-4 sm:p-5 shadow-[0_16px_32px_-22px_rgba(23,32,51,0.5)]`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-sm sm:text-base font-bold tracking-tight text-base-text">{heading}</h3>
        <span className={badgeClass}>{badgeLabel}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span key={item} className="rounded border border-base-border bg-base-surface px-2 py-1 font-mono text-[10.5px] font-semibold text-base-text">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

function FlowArrow({ label }) {
  return (
    <div className="flex flex-col items-center gap-1 py-1">
      <div className="h-4 w-0.5 bg-gradient-to-b from-build/60 to-hybrid/60" aria-hidden="true" />
      <span className="text-base" aria-hidden="true">▼</span>
      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-base-dim">{label}</span>
    </div>
  )
}

function VendorChip({ vendor, state }) {
  const tone =
    state === 'failed'
      ? 'border-red-400 bg-red-100 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
      : state === 'active'
      ? 'border-hybrid bg-hybrid-dim shadow-[0_0_12px_rgba(47,158,68,0.3)]'
      : 'border-base-border bg-base-panel'

  const dotClass =
    state === 'failed'
      ? 'bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]'
      : state === 'active'
      ? 'bg-hybrid animate-pulse shadow-[0_0_8px_#2f9e44]'
      : 'bg-base-muted'

  const stateLabel = state === 'failed' ? 'FAILED' : state === 'active' ? 'ACTIVE' : 'STANDBY'

  return (
    <div className={`flex flex-1 flex-col items-center gap-2 rounded-xl border p-3 transition-all duration-300 ${tone}`}>
      <div className="flex items-center gap-1.5">
        <span className={`h-2 w-2 rounded-full ${dotClass}`} aria-hidden="true" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-base-dim">{stateLabel}</span>
      </div>
      <div className="text-center">
        <p className="font-display text-sm font-bold text-base-text">{vendor.name}</p>
        <p className="font-mono text-[10px] text-base-dim">{vendor.detail}</p>
      </div>
    </div>
  )
}

export default function ControlArchitecture() {
  const [status, setStatus] = useState('idle')
  const [visibleSteps, setVisibleSteps] = useState(0)
  const [vendorAState, setVendorAState] = useState('standby')
  const [vendorBState, setVendorBState] = useState('standby')
  const timeoutsRef = useRef([])

  const clearTimers = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t))
    timeoutsRef.current = []
  }

  useEffect(() => () => clearTimers(), [])

  const runSwap = () => {
    clearTimers()
    setStatus('running')
    setVisibleSteps(0)
    setVendorAState('standby')
    setVendorBState('standby')

    vendorSwapSteps.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisibleSteps(i + 1)
        if (i === vendorSwapSteps.length - 1) {
          setVendorAState('failed')
          setVendorBState('active')
          const doneTimer = setTimeout(() => setStatus('done'), STEP_DELAY_MS)
          timeoutsRef.current.push(doneTimer)
        }
      }, STEP_DELAY_MS * i)
      timeoutsRef.current.push(t)
    })
  }

  const vendorStates = { A: vendorAState, B: vendorBState }

  return (
    <section aria-labelledby="control-arch-heading" className="panel p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 border-b border-base-border/70 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="control-arch-heading" className="font-display text-lg font-bold tracking-tight text-base-text">
              Proposed Control Architecture
            </h2>
            <span className="badge-hybrid">OUR PROPOSED ARCHITECTURE</span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-base-dim max-w-2xl">
            Every partner sits behind a control layer we own. Swap a vendor and the core never knows.
            This layer is proposed solution architecture — not an explicit case requirement.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center">
        <TierBox
          heading={controlStack.core.name}
          badgeClass="badge-build"
          badgeLabel={controlStack.core.badge}
          items={controlStack.core.items}
          accentClass="border-build-border/70"
        />
        <FlowArrow label="CONTROLLED BY MOCHATRADE" />
        <div className="relative w-full">
          <div className="absolute inset-x-0 top-0 h-1 overflow-hidden rounded-t-2xl">
            <div className="absolute top-0 h-full w-48 bg-gradient-to-r from-transparent via-hybrid to-transparent animate-bus-pulse shadow-[0_0_15px_#2f9e44]" />
          </div>
          <TierBox
            heading={controlStack.layer.name}
            badgeClass="badge-hybrid"
            badgeLabel={controlStack.layer.badge}
            items={controlStack.layer.items}
            accentClass="border-hybrid"
          />
        </div>
        <FlowArrow label="ALL VENDOR TRAFFIC PASSES THROUGH HERE" />

        <div className="mt-2 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {controlStack.vendors.map((v) => (
            <VendorChip key={v.id} vendor={v} state={vendorStates[v.key.toUpperCase()]} />
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3 border-t border-base-border/60 pt-5">
        <button
          type="button"
          onClick={runSwap}
          disabled={status === 'running'}
          className="rounded-lg bg-build px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-glow-build transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {status === 'running' ? '⚡ SWAPPING…' : status === 'done' ? '↺ REPLAY VENDOR SWAP' : '[ SIMULATE VENDOR SWAP ]'}
        </button>

        {(status === 'running' || status === 'done') && (
          <div className="w-full max-w-2xl rounded-xl border border-base-border bg-base-surface p-4 font-mono shadow-inner" role="log" aria-live="polite">
            {vendorSwapSteps.slice(0, visibleSteps).map((line, i) => (
              <div key={i} className="console-line animate-fade-slide-up">
                <span className="text-base-text font-semibold text-xs sm:text-[13.5px]">{line.text}</span>
                <span className={`rounded border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${tagMeta.CONTROL.chip}`}>
                  CONTROL → {line.note}
                </span>
                <span className="ml-auto text-base" aria-hidden="true">{statusIcon[line.status]}</span>
              </div>
            ))}
            {status === 'running' && visibleSteps < vendorSwapSteps.length && (
              <span className="mt-2 inline-block font-mono text-xs text-build font-bold animate-blink">SWAP IN PROGRESS... ▌</span>
            )}
          </div>
        )}

        {status === 'done' && (
          <div className="animate-fade-slide-up w-full space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {vendorSwapClaims.map((claim) => (
                <span key={claim} className="rounded-lg border border-hybrid-border bg-hybrid-dim px-3 py-1.5 font-mono text-xs font-bold text-hybrid">
                  ✓ {claim}
                </span>
              ))}
            </div>
            <div className="rounded-xl border-2 border-hybrid-border bg-hybrid-dim p-5 text-center shadow-[0_0_20px_rgba(47,158,68,0.16)]">
              <p className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-base-text">
                {controlMessage}
              </p>
              <p className="mt-1 font-sans text-xs text-base-dim">
                A vendor swap is a config change behind the control layer — never a rewrite of the core.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}