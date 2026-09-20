import { useEffect, useState } from 'react'

const navItems = [
  { id: 'infra-map', label: 'Infra Map', icon: '🗺️' },
  { id: 'trade-flow', label: 'Trade Flow', icon: '⚡' },
  { id: 'failure-sim', label: 'Failure Sim', icon: '💥' },
  { id: 'roadmap', label: 'Roadmap', icon: '📍' },
]

export default function SectionNav() {
  const [activeSection, setActiveSection] = useState('infra-map')

  useEffect(() => {
    const sectionElements = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean)

    if (sectionElements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting)
        if (visibleEntries.length > 0) {
          visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio)
          setActiveSection(visibleEntries[0].target.id)
        }
      },
      {
        rootMargin: '-10% 0px -40% 0px',
        threshold: [0.1, 0.3, 0.5, 0.8],
      }
    )

    sectionElements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) {
      const yOffset = -110
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <nav
      aria-label="Section navigation"
      className="sticky top-[49px] z-30 border-b border-base-border/80 bg-[#080b0f]/95 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-1.5 sm:px-6">
        <div className="flex w-full items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-none sm:gap-2">
          <span className="hidden font-mono text-[11px] font-semibold uppercase tracking-wider text-base-dim sm:inline-block sm:mr-2">
            TERMINAL NAV ::
          </span>
          {navItems.map((item) => {
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollTo(item.id)}
                className={`group relative flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-base-panel text-base-text shadow-sm'
                    : 'text-base-dim hover:bg-base-panel/50 hover:text-base-text'
                }`}
              >
                <span className="text-xs" aria-hidden="true">{item.icon}</span>
                <span className="font-mono text-[12px] font-semibold tracking-tight">{item.label}</span>
                {isActive && (
                  <span
                    className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full ${
                      item.id === 'failure-sim'
                        ? 'bg-build shadow-[0_0_8px_#e8590c]'
                        : item.id === 'trade-flow'
                        ? 'bg-hybrid shadow-[0_0_8px_#2f9e44]'
                        : item.id === 'roadmap'
                        ? 'bg-partner shadow-[0_0_8px_#1971c2]'
                        : 'bg-build shadow-[0_0_8px_#e8590c]'
                    }`}
                  />
                )}
              </button>
            )
          })}
        </div>

        <div className="hidden shrink-0 items-center gap-2 font-mono text-[11px] text-base-dim sm:flex">
          <span className="h-2 w-2 rounded-full bg-hybrid animate-pulse" />
          <span className="font-semibold text-base-text">HYBRID CORE</span>
        </div>
      </div>
    </nav>
  )
}
