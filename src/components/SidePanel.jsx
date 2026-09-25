import { decisionMeta } from '../data/theme.js'

function renderIcon(id) {
  switch (id) {
    case 'strategy':
      return (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      )
    case 'control-arch':
      return (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <line x1="9" y1="1" x2="9" y2="4" />
          <line x1="15" y1="1" x2="15" y2="4" />
          <line x1="9" y1="20" x2="9" y2="23" />
          <line x1="15" y1="20" x2="15" y2="23" />
          <line x1="20" y1="9" x2="23" y2="9" />
          <line x1="20" y1="15" x2="23" y2="15" />
          <line x1="1" y1="9" x2="4" y2="9" />
          <line x1="1" y1="15" x2="4" y2="15" />
        </svg>
      )
    case 'scoring-matrix':
      return (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="M7 21h10" />
          <path d="M12 3v18" />
          <path d="M3 7h18" />
        </svg>
      )
    case 'trade-flow':
      return (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      )
    case 'failure-sim':
      return (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )
    case 'responsibility':
      return (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    case 'scorecard':
      return (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      )
    case 'simulator':
      return (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55A2 2 0 0 0 6.516 23.5h10.968a2 2 0 0 0 1.796-2.95l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
          <path d="M8.5 2h7" />
          <path d="M7 16h10" />
        </svg>
      )
    case 'final-arch':
      return (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="22" x2="21" y2="22" />
          <line x1="6" y1="18" x2="6" y2="11" />
          <line x1="10" y1="18" x2="10" y2="11" />
          <line x1="14" y1="18" x2="14" y2="11" />
          <line x1="18" y1="18" x2="18" y2="11" />
          <polygon points="12 2 20 7 4 7 12 2" />
        </svg>
      )
    case 'roadmap':
      return (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      )
    default:
      return (
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
        </svg>
      )
  }
}

function formatGroupName(raw) {
  if (!raw) return ''
  return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase()
}

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
      className="fixed inset-y-0 left-0 z-50 hidden w-60 flex-col border-r border-base-border bg-base-card lg:flex"
      aria-label="Primary navigation"
    >
      {/* Brand block */}
      <div className="border-b border-base-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-build-border/60 bg-build-dim font-mono text-base font-bold text-build shadow-glow-build">
            ☕
          </div>
          <div className="leading-tight">
            <p className="font-display text-base font-bold tracking-tight text-base-text">MochaTrade</p>
            <p className="mt-0.5 font-sans text-xs font-normal text-base-dim">Hybrid infrastructure control</p>
          </div>
        </div>
      </div>

      {/* Nav grouped */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Sections">
        {groups.map((g, groupIndex) => (
          <div key={g.name} className={groupIndex === 0 ? 'mb-5' : 'mb-5 border-t border-base-border/50 pt-4'}>
            <div className="mb-1.5 px-2.5 font-sans text-[11px] font-normal text-base-muted">
              {formatGroupName(g.name)}
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
                    className={`group flex w-full items-center gap-2.5 rounded-r-md px-2.5 py-1.5 text-left font-sans text-xs transition ${
                      isActive
                        ? `border-l-[3px] ${meta.border} ${meta.dim} font-bold text-base-text`
                        : 'border-l-[3px] border-transparent font-normal text-base-dim hover:bg-base-panel/60 hover:text-base-text'
                    }`}
                  >
                    <span
                      className={`transition-colors ${
                        isActive ? meta.text : 'text-base-muted group-hover:text-base-dim'
                      }`}
                      aria-hidden="true"
                    >
                      {renderIcon(item.id)}
                    </span>
                    <span className="flex-1 truncate">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Status footer */}
      <footer className="border-t border-base-border px-4 py-3">
        <div className="flex items-center justify-between font-sans text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-hybrid shadow-[0_0_6px_rgba(46,139,114,0.45)]" aria-hidden="true" />
            <span className="font-medium text-base-text">Core live</span>
          </div>
          <span className="font-mono text-[11px] font-medium text-base-muted">v1.0</span>
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
      <div className="flex items-center gap-1">
        {pages.map((item) => {
          const isActive = item.id === active
          const meta = decisionMeta[item.tone.toUpperCase()]
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 font-sans text-xs transition ${
                isActive
                  ? `${meta.dim} border ${meta.border} font-bold text-base-text`
                  : 'border border-transparent font-normal text-base-dim hover:bg-base-panel hover:text-base-text'
              }`}
            >
              <span className={isActive ? meta.text : 'text-base-muted'} aria-hidden="true">
                {renderIcon(item.id)}
              </span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}