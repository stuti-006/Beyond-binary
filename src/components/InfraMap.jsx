import { useState } from 'react'
import {
  decisionBoardComponents,
  caseRequirements,
  proposedArchitecture,
  caseVsProposedNote,
} from '../data/decisionBoard.js'
import { decisionMeta } from '../data/theme.js'
import ComponentDetailModal from './ComponentDetailModal.jsx'

function DecisionCard({ component, onOpen }) {
  const meta = decisionMeta[component.decision]
  const isBuild = component.decision === 'BUILD'
  const isPartner = component.decision === 'PARTNER'
  const hoverGlow = isBuild
    ? 'hover:border-build hover:shadow-glow-build'
    : isPartner
    ? 'hover:border-partner hover:shadow-glow-partner'
    : 'hover:border-hybrid hover:shadow-glow-hybrid'

  return (
    <button
      type="button"
      onClick={() => onOpen(component)}
      className={`group flex w-full flex-col items-start gap-3 rounded-xl border ${hoverGlow} border-base-border bg-base-card p-4 text-left transition-all duration-200 hover:-translate-y-0.5`}
      aria-haspopup="dialog"
    >
      <div className="flex w-full items-start justify-between gap-2">
        <span className="text-lg" aria-hidden="true">{component.icon}</span>
        <span className={meta.badgeClass}>{meta.label}</span>
      </div>
      <h3 className="font-display text-[15px] font-bold leading-snug text-base-text group-hover:text-white">
        {component.name}
      </h3>
      <p className="line-clamp-2 font-sans text-xs leading-relaxed text-base-dim">{component.why}</p>

      <div className="mt-auto flex w-full items-center justify-between gap-2 border-t border-base-border/60 pt-3">
        <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider">
          <span className="text-hybrid border-hybrid-border bg-hybrid-dim rounded border px-1.5 py-0.5">
            U · {component.economics.upfront}
          </span>
          <span className="text-build border-build-border bg-build-dim rounded border px-1.5 py-0.5">
            S · {component.economics.strategicValue}
          </span>
          <span className="text-base-dim border-base-border bg-base-panel rounded border px-1.5 py-0.5">
            SW · {component.economics.switching}
          </span>
        </div>
        <span className="font-mono text-[10px] font-bold text-build opacity-0 transition group-hover:opacity-100">
          OPEN FILE ↗
        </span>
      </div>
    </button>
  )
}

export default function InfraMap() {
  const [selected, setSelected] = useState(null)

  const counts = decisionBoardComponents.reduce(
    (acc, c) => {
      acc[c.decision] = (acc[c.decision] || 0) + 1
      return acc
    },
    {}
  )

  return (
    <section aria-labelledby="infra-map-heading" className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-build-border/50 bg-gradient-to-b from-[#141a24] via-[#0d1117] to-[#080b0f] p-5 sm:p-8 shadow-2xl shadow-black/80">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f283815_1px,transparent_1px),linear-gradient(to_bottom,#1f283815_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

        <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-base-border/70 pb-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-build">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-build opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-build"></span>
            </span>
            <span className="font-bold uppercase tracking-wider">STRATEGY CONTROL CENTER</span>
          </div>

          <div className="relative flex overflow-hidden max-w-full sm:max-w-md w-full mask-gradient">
            <div className="flex gap-6 animate-ticker whitespace-nowrap text-[12px] font-mono">
              <span className="text-base-text"><span className="text-base-dim">BTC-PERP</span> $64,280.50 <span className="text-hybrid font-bold">+2.4%</span></span>
              <span className="text-base-text"><span className="text-base-dim">ETH-PERP</span> $3,450.20 <span className="text-hybrid font-bold">+1.8%</span></span>
              <span className="text-base-text"><span className="text-base-dim">SOL-PERP</span> $148.75 <span className="text-red-400 font-bold">-0.5%</span></span>
              <span className="text-base-text"><span className="text-base-dim">INR/USD</span> 83.92</span>
              <span className="text-base-text"><span className="text-base-dim">TRUST</span> SELF-CUSTODY</span>
              <span className="text-base-text"><span className="text-base-dim">BTC-PERP</span> $64,280.50 <span className="text-hybrid font-bold">+2.4%</span></span>
              <span className="text-base-text"><span className="text-base-dim">ETH-PERP</span> $3,450.20 <span className="text-hybrid font-bold">+1.8%</span></span>
              <span className="text-base-text"><span className="text-base-dim">SOL-PERP</span> $148.75 <span className="text-red-400 font-bold">-0.5%</span></span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                MochaTrade
              </h1>
              <span className="rounded border border-build-border bg-build-dim px-2.5 py-0.5 font-mono text-xs font-bold uppercase tracking-wider text-build shadow-[0_0_12px_rgba(232,89,12,0.3)]">
                MarketSphere '26 · T4
              </span>
            </div>
            <p className="mt-2 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-build via-amber-200 to-white">
              Own the Risk. Rent the Plumbing.
            </p>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-base-dim font-medium">
              BUILD WHAT CREATES THE MOAT. PARTNER WHAT IS SPECIALIZED. HYBRIDIZE CRITICAL DEPENDENCIES.
              CONTROL THE INTERFACES. OWN THE RISK. DESIGN FOR FAILURE.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3 font-mono text-xs bg-base-panel/90 border border-base-border rounded-xl p-3 shadow-inner">
            <div className="flex flex-col">
              <span className="text-[10px] text-base-dim uppercase tracking-wider font-semibold">Decision Surface</span>
              <span className="font-bold text-build text-sm">5 COMPONENTS</span>
            </div>
            <div className="h-6 w-px bg-base-border" />
            <div className="flex flex-col">
              <span className="text-[10px] text-base-dim uppercase tracking-wider font-semibold">Tolerance</span>
              <span className="font-bold text-hybrid text-sm">DESIGNED FOR FAILURE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-base-border bg-base-card p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-mono text-[12px] font-bold uppercase tracking-wider text-base-text">
              CASE REQUIREMENTS
            </h2>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-base-dim">GIVEN</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {caseRequirements.map((r) => (
              <span key={r} className="rounded border border-base-border bg-base-panel px-2.5 py-1 font-mono text-[11px] font-semibold text-base-text">
                {r}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-hybrid-border/60 bg-hybrid-dim/30 p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-mono text-[12px] font-bold uppercase tracking-wider text-hybrid">
              OUR PROPOSED ARCHITECTURE
            </h2>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-hybrid/80">PROPOSED</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {proposedArchitecture.map((r) => (
              <span key={r} className="rounded border border-hybrid-border bg-hybrid-dim px-2.5 py-1 font-mono text-[11px] font-semibold text-hybrid">
                {r}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center font-mono text-[11px] text-base-dim">
        {caseVsProposedNote}
      </p>

      <div className="panel p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-base-border/70 pb-4">
          <div>
            <h2 id="infra-map-heading" className="font-display text-lg font-bold tracking-tight text-base-text">
              Infrastructure Decision Board
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-base-dim">
              Five case components, one decision each. Click any component to open its full decision file.
            </p>
          </div>
          <div className="font-mono text-xs text-base-dim bg-base-panel px-3 py-1.5 rounded-lg border border-base-border">
            <span className="text-build font-bold">{counts.BUILD || 0} BUILD</span> ·{' '}
            <span className="text-partner font-bold">{counts.PARTNER || 0} PARTNER</span> ·{' '}
            <span className="text-hybrid font-bold">{(counts.HYBRID || 0) + (counts.CONTROLLED || 0)} HYBRID / CONTROLLED</span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {decisionBoardComponents.map((component) => (
            <DecisionCard key={component.id} component={component} onOpen={setSelected} />
          ))}
        </div>

        <p className="mt-6 text-center font-mono text-xs text-base-dim border-t border-base-border/50 pt-4">
          Every decision trades speed, ownership and control. The board forces the trade to be explicit.
        </p>
      </div>

      {selected && <ComponentDetailModal component={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}