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
      className="fixed inset-y-0 left-0 z-50 hidden w-60 flex-col border-r border-base-border/80 bg-white lg:flex"
      aria-label="Primary navigation"
    >
      {/* Brand block */}
      <div className="flex items-center gap-2.5 border-b border-base-border/70 px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-build-border/50 bg-build-dim font-mono text-sm font-bold text-build shadow-glow-build">
          ☕
        </div>
        <div className="leading-tight">
          <p className="font-display text-sm font-bold tracking-tight text-base-text">MochaTrade</p>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-widest text-base-dim">
            Own the Risk
          </p>
        </div>
      </div>

      {/* Nav grouped */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Sections">
        {groups.map((g) => (
          <div key={g.name} className="mb-5">
            <div className="mb-1.5 px-1 font-mono text-[9px] font-bold uppercase tracking-widest text-base-dim">
              {g.name} ::
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
                    className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left font-mono text-[11px] font-semibold transition ${
                      isActive
                        ? `${meta.dim} text-base-text shadow-sm`
                        : 'text-base-dim hover:bg-base-panel/60 hover:text-base-text'
                    }`}
                  >
                    <span className="text-sm" aria-hidden="true">{item.icon}</span>
                    <span className="flex-1 tracking-tight">{item.label}</span>
                    {isActive ? (
                      <span className={meta.dot} aria-hidden="true" />
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
      <div className="border-t border-base-border/70 px-4 py-3">
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="h-2 w-2 rounded-full bg-hybrid animate-pulse" aria-hidden="true" />
          <span className="font-bold uppercase tracking-wider text-base-text">Core :: Live</span>
        </div>
        <p className="mt-1.5 font-mono text-[9px] leading-relaxed text-base-dim">
          Build the Moat. Rent the Plumbing.
        </p>
      </div>
    </aside>
  )
}

export function MobileNav({ pages, active, onNavigate }) {
  return (
    <nav
      className="lg:hidden overflow-x-auto whitespace-nowrap border-b border-base-border/80 bg-white/95 px-2 py-2 scrollbar-none"
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
              className={`flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[11px] font-bold transition ${
                isActive ? `${meta.dim} text-white` : 'text-base-dim hover:text-base-text'
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