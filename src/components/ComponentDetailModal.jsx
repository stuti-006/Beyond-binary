import { useEffect } from 'react'
import { decisionMeta, levelColors, econLabels } from '../data/theme.js'

function ListBlock({ title, items }) {
  return (
    <div>
      <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-base-dim">{title}</h4>
      <ul className="mt-1.5 space-y-1">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 font-sans text-xs sm:text-sm text-base-text leading-relaxed">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-build" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function ComponentDetailModal({ component, onClose }) {
  const meta = decisionMeta[component.decision]
  const partnerOwns = Array.isArray(component.partnerOwns) ? component.partnerOwns : [component.partnerOwns]

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${component.name} — decision file`}
    >
      <div className="animate-fade-slide-up max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-base-border bg-white shadow-2xl shadow-slate-900/15 ring-1 ring-white/70 sm:rounded-2xl">
        <div className={`sticky top-0 z-10 border-b border-base-border bg-white/95 px-5 py-4 backdrop-blur-md sm:px-7`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xl" aria-hidden="true">{component.icon}</span>
                <h3 className="font-display text-base sm:text-lg font-bold tracking-tight text-white">
                  {component.name}
                </h3>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className={meta.badgeClass}>{meta.label}</span>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-base-dim">
                  DECISION FILE :: {component.id.toUpperCase()}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close decision file"
              className="shrink-0 rounded-md p-1.5 font-mono text-xs text-base-dim transition hover:bg-base-border hover:text-white"
            >
              ✕ ESC
            </button>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-xl border border-base-border bg-base-panel/60 p-4">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-base-dim">
              CASE REQUIREMENT ::
            </span>
            <p className="mt-1 font-sans text-xs sm:text-sm leading-relaxed text-base-text">{component.caseRequirement}</p>
          </div>

          <div>
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-base-dim">WHY</h4>
            <p className="mt-1.5 font-sans text-xs sm:text-sm leading-relaxed text-base-text">{component.why}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {component.whyNot.map((w) => (
              <div key={w.label} className="rounded-xl border border-base-border bg-base-panel/60 p-4">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-build">{w.label}</span>
                <p className="mt-1 font-sans text-xs leading-relaxed text-base-dim">{w.text}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <ListBlock title="MOCHATRADE OWNS" items={component.owns} />
            <ListBlock title="PARTNER OWNS" items={partnerOwns} />
          </div>

          <div className="rounded-xl border border-build-border/50 bg-build-dim/50 p-4">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-build">KEY RISK</h4>
            <p className="mt-1 font-sans text-xs sm:text-sm leading-relaxed text-base-text">{component.keyRisk}</p>
          </div>

          <div className="rounded-xl border border-hybrid-border/50 bg-hybrid-dim/50 p-4">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-hybrid">MITIGATION</h4>
            <p className="mt-1 font-sans text-xs sm:text-sm leading-relaxed text-base-text">{component.mitigation}</p>
          </div>

          <div className="rounded-xl border border-base-border bg-base-panel/40 p-4">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-base-dim">
                ECONOMICS PROFILE
              </h4>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                ILLUSTRATIVE ESTIMATE
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {Object.entries(econLabels).map(([key, label]) => {
                const level = component.economics[key]
                return (
                  <div key={key} className="flex items-center justify-between gap-2 rounded-lg border border-base-border bg-base-panel px-3 py-2 font-mono text-[11px]">
                    <span className="text-base-dim">{label}</span>
                    <span className={`rounded border px-1.5 py-0.5 text-[10px] font-bold ${levelColors[level]}`}>
                      {level}
                    </span>
                  </div>
                )
              })}
            </div>
            <p className="mt-3 font-mono text-[10.5px] leading-relaxed text-base-dim">
              LOW / MED / HIGH only. No sourced price claims are presented as market fact.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}