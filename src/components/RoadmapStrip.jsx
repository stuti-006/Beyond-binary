import { roadmapPhases, triggerChips } from '../data/components.js'

export default function RoadmapStrip() {
  return (
    <footer className="mt-10 border-t border-base-border/80 bg-gradient-to-b from-[#0d1117] to-[#05070a]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between border-b border-base-border/60 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-bold tracking-tight text-base-text">
              16-Week Implementation Roadmap
            </h2>
            <span className="badge-build">LAUNCH TIMELINE</span>
          </div>
          <span className="font-mono text-xs text-base-dim">TARGET :: 4 MONTHS TO LAUNCH</span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
          {roadmapPhases.map((phase, i) => (
            <div key={phase.id} className="flex flex-col rounded-xl border border-base-border bg-base-panel/60 p-4 shadow-md transition hover:border-build-border/50">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-build">{phase.weeks}</span>
                {i === 1 && <span className="badge-build">CRITICAL PATH</span>}
              </div>
              <div
                className={`mt-2.5 h-1.5 rounded-full ${
                  i === 1 ? 'bg-build shadow-[0_0_8px_#e8590c]' : i === 3 ? 'bg-hybrid shadow-[0_0_8px_#2f9e44]' : 'bg-partner'
                }`}
                aria-hidden="true"
              />
              <p className="mt-3 font-display text-sm font-bold text-white">{phase.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-base-dim font-medium">{phase.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-base-border/60 pt-5">
          <span className="mr-2 font-mono text-xs font-bold text-base-dim uppercase tracking-wider">
            RE-EVALUATE BUILD/PARTNER WHEN ::
          </span>
          {triggerChips.map((chip) => (
            <span
              key={chip}
              className="rounded-lg border border-base-border bg-base-panel px-3 py-1 font-mono text-xs font-semibold text-base-text shadow-sm"
            >
              {chip}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-base-border/40 pt-4 text-xs font-mono text-base-dim">
          <p>
            MochaTrade — YC S26 · Self-custodial perpetual futures for non-US retail traders.
          </p>
          <p className="text-build font-semibold">
            Own the Risk. Rent the Plumbing.
          </p>
        </div>
      </div>
    </footer>
  )
}

