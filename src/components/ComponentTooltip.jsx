import { decisionMeta } from '../data/components.js'

/**
 * Detail card shown when a node in the Infrastructure Map is
 * hovered (desktop) or tapped (mobile). Purely presentational —
 * positioning is handled by the parent node wrapper.
 */
export default function ComponentTooltip({ component, onClose }) {
  const meta = decisionMeta[component.decision]

  return (
    <div
      role="dialog"
      aria-label={`${component.name} details`}
      className="animate-fade-slide-up absolute left-1/2 top-full z-30 mt-2 w-80 -translate-x-1/2 rounded-xl border border-base-border bg-[#0a0e14] p-4 text-left shadow-2xl shadow-black/90 ring-1 ring-white/10"
    >
      <div
        className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-base-border bg-[#0a0e14]"
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-2 border-b border-base-border/60 pb-2">
        <div>
          <h4 className="font-display text-sm font-bold leading-snug text-white">
            {component.name}
          </h4>
          <span className={meta.badgeClass + ' mt-1'}>{meta.label}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="-mr-1 -mt-1 shrink-0 rounded-md p-1 font-mono text-xs text-base-dim transition hover:bg-base-border hover:text-white"
        >
          ✕
        </button>
      </div>

      <p className="mt-3 font-sans text-xs leading-relaxed text-base-dim">
        {component.reason}
      </p>

      <dl className="mt-3 space-y-1.5 border-t border-base-border/60 pt-3 font-mono text-[12px]">
        <div className="flex justify-between gap-3">
          <dt className="text-base-dim">MONTHLY COST</dt>
          <dd className="text-right font-bold text-build">{component.monthlyCost}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-base-dim">BUILD TIME</dt>
          <dd className="text-right font-bold text-base-text">{component.buildTime}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="shrink-0 text-base-dim">FAILURE OWNER</dt>
          <dd className="text-right font-bold text-white">{component.failureOwner}</dd>
        </div>
        {component.vendor && (
          <div className="flex justify-between gap-3 border-t border-base-border/40 pt-1.5">
            <dt className="text-base-dim">VENDOR</dt>
            <dd className="text-right font-bold text-partner">{component.vendor}</dd>
          </div>
        )}
      </dl>
    </div>
  )
}

