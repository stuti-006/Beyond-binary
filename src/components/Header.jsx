const legend = [
  { label: 'BUILD (OUR CODE)', dotClass: 'bg-build shadow-[0_0_8px_#e8590c]' },
  { label: 'PARTNER (RENTED)', dotClass: 'bg-partner shadow-[0_0_8px_#1971c2]' },
  { label: 'HYBRID', dotClass: 'bg-hybrid shadow-[0_0_8px_#2f9e44]' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-base-border bg-[#080b0f]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded border border-build/40 bg-build-dim font-mono text-sm font-bold text-build shadow-[0_0_12px_rgba(232,89,12,0.3)]">
            ☕
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="font-display text-xl font-bold tracking-tight text-base-text">
              MochaTrade
            </span>
            <span className="hidden font-mono text-xs font-semibold tracking-wider text-build sm:inline">
              [ACMS26 · TRACK 4 · CONTROL CENTER]
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] font-semibold text-base-dim sm:gap-4">
          {legend.map((item) => (
            <span key={item.label} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${item.dotClass}`} aria-hidden="true" />
              <span className="tracking-wider">{item.label}</span>
            </span>
          ))}
        </div>
      </div>
    </header>
  )
}