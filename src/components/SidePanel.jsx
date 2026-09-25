import { decisionMeta } from '../data/theme.js'

export default function SidePanel({ pages, active, onNavigate }) {
  const groups = []
  for (const p of pages) {
    let g = groups.find((x) => x.name === p.group)
    if (!g) {
      g = { name: p.group, items: [] }
      groups.push(g)
    }
    g.items.push(p)
  }

  return (
    <aside
      className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-base-border bg-base-card lg:flex"
      aria-label="Primary navigation"
    >
      {/* Brand block */}
      <div className="border-b border-base-border px-5 py-5">
        <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-build-border/60 bg-build-dim font-mono text-base font-bold text-build shadow-glow-build">
          ☕
        </div>
        <div className="leading-tight">
          <p className="font-display text-base font-bold tracking-tight text-base-text">MochaTrade</p>
          <p className="mt-0.5 font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-base-dim">Control Center</p>
        </div>
        </div>
      </div>

      {/* Nav grouped */}
      <nav className="flex-1 overflow-y-auto px-3.5 py-5" aria-label="Sections">
        {groups.map((g, groupIndex) => (
          <div key={g.name} className={groupIndex === 0 ? 'mb-6' : 'mb-6 border-t border-base-border/70 pt-5'}>
            <div className="mb-2 px-2 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-base-muted">
              {g.name}
            </div>
            <div className="space-y-0.5">
              {g.items.map((item) => {
                const isActive = item.id === active
                const meta = decisionMeta[item.tone.toUpperCase()]
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`group flex w-full items-center gap-3 rounded-lg border-l-2 px-2.5 py-2 text-left font-sans text-xs font-semibold transition ${
                      isActive
                        ? `${meta.border} ${meta.dim} text-base-text shadow-sm`
                        : 'border-transparent text-base-dim hover:border-base-border hover:bg-base-panel/70 hover:text-base-text'
                    }`}
                  >
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-sm transition ${isActive ? `${meta.dim} ${meta.border}` : 'border-transparent bg-base-panel/70 grayscale-[0.2] group-hover:border-base-border'}`} aria-hidden="true">{item.icon}</span>
                    <span className="flex-1 tracking-tight">{item.label}</span>
                    {isActive ? (
                      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} aria-hidden="true" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-base-muted/40" aria-hidden="true" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Status footer */}
      <footer className="border-t border-base-border px-4 py-4">
        <div className="rounded-lg border border-base-border bg-base-panel/70 px-3 py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-sans text-[10px]">
              <span className="h-2 w-2 rounded-full bg-hybrid shadow-[0_0_8px_rgba(46,139,114,0.45)]" aria-hidden="true" />
              <span className="font-bold uppercase tracking-[0.14em] text-base-text">Core live</span>
            </div>
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-base-muted">v1.0</span>
          </div>
          <div className="mt-2 border-t border-base-border/70 pt-2">
            <p className="font-display text-[10px] font-bold uppercase tracking-[0.16em] text-base-text">MochaTrade Systems</p>
            <p className="mt-1 font-sans text-[9px] leading-relaxed text-base-dim">
              Own the risk. Rent the plumbing.
            </p>
          </div>
        </div>
      </footer>
    </aside>
  )
}

export function MobileNav({ pages, active, onNavigate }) {
  return (
    <nav
      className="lg:hidden overflow-x-auto whitespace-nowrap border-b border-base-border bg-base-card px-2 py-2 scrollbar-none"
      aria-label="Sections"
    >
      <div className="flex items-center gap-0.5">
        {pages.map((item) => {
          const isActive = item.id === active
          const meta = decisionMeta[item.tone.toUpperCase()]
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-sans text-xs font-bold transition ${
                isActive ? `${meta.dim} ${meta.border} text-base-text` : 'border-transparent text-base-dim hover:border-base-border hover:bg-base-panel hover:text-base-text'
              }`}
            >
              <span aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}