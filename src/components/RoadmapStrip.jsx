import { useState } from 'react'
import { roadmapPhases } from '../data/roadmap.js'
import JudgeMode from './JudgeMode.jsx'

const phaseAccent = {
  build: 'bg-build shadow-[0_0_8px_#e8590c]',
  partner: 'bg-partner shadow-[0_0_8px_#1971c2]',
  hybrid: 'bg-hybrid shadow-[0_0_8px_#2f9e44]',
}

export default function RoadmapStrip() {
  const [judge, setJudge] = useState(false)

  return (
    <footer id="roadmap" className="mt-10 scroll-mt-28 border-t border-base-border/80 bg-gradient-to-b from-[#0d1117] to-[#05070a]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-base-border/60 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-bold tracking-tight text-base-text">
              12-Month Strategic Roadmap
            </h2>
            <span className="badge-build">LAUNCH → OPTIMIZE MOAT</span>
          </div>
          <span className="font-mono text-xs text-base-dim">TARGET :: 3 MONTHS TO LAUNCH</span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roadmapPhases.map((phase) => (
            <div key={phase.id} className="flex flex-col rounded-xl border border-base-border bg-base-panel/60 p-4 shadow-md transition hover:border-build-border/50">
              <span className="font-mono text-xs font-bold text-build">{phase.months}</span>
              <div
                className={`mt-2.5 h-1.5 rounded-full ${phaseAccent[phase.color]}`}
                aria-hidden="true"
              />
              <p className="mt-3 font-display text-sm font-bold text-white">{phase.title}</p>

              <div className="mt-3 space-y-3">
                {phase.partner.length > 0 && (
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-partner">
                      PARTNER ::
                    </span>
                    <ul className="mt-1 space-y-1">
                      {phase.partner.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-base-dim">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-partner" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {phase.build.length > 0 && (
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-build">
                      BUILD ::
                    </span>
                    <ul className="mt-1 space-y-1">
                      {phase.build.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs leading-relaxed text-base-dim">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-build" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {phase.partner.length === 0 && phase.build.length === 0 && (
                  <ul className="space-y-1">
                    <li className="text-xs leading-relaxed text-base-dim">Phase gate — review, decide, adjust.</li>
                  </ul>
                )}
              </div>

              <p className="mt-3 border-t border-base-border/50 pt-3 font-sans text-[11px] leading-relaxed text-base-dim">
                {phase.note}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-build-border/50 bg-build-dim/40 p-4 text-center">
          <p className="font-display text-sm sm:text-base font-extrabold tracking-tight text-white">
            PARTNER → HYBRID, or HYBRID → BUILD.
          </p>
          <p className="mt-1 font-mono text-[11px] text-base-dim">
            Move a component only when the month-7–12 review says the economics, risk and differentiation justify it.
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-base-border/40 pt-4 text-xs font-mono text-base-dim">
          <p>
            MochaTrade · ACM MarketSphere 2026 · Track 4 strategy prototype. Economic ratings are illustrative estimates, not sourced market prices.
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setJudge(true)}
              className="rounded border border-amber-500/50 bg-amber-950/40 px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-amber-300 transition hover:bg-amber-950/70 hover:text-amber-200"
            >
              ⚖️ [JUDGE MODE]
            </button>
            <p className="text-build font-semibold">
              Own the Risk. Rent the Plumbing.
            </p>
          </div>
        </div>
      </div>
      {judge && <JudgeMode onClose={() => setJudge(false)} />}
    </footer>
  )
}