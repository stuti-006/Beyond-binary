import { scorecardDimensions, redFlags, scorecardNote } from '../data/partnerScorecard.js'

export default function PartnerScorecard() {
  return (
    <section id="scorecard" aria-labelledby="scorecard-heading" className="scroll-mt-28 panel p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 border-b border-base-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 id="scorecard-heading" className="font-display text-lg font-bold tracking-tight text-base-text">
              Partner Scorecard
            </h2>
            <span className="badge-partner">EVALUATION FRAMEWORK</span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-base-dim">
            Evaluate every dependency against the same questions. No rankings, no invented scores.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {scorecardDimensions.map((d, i) => (
          <div key={d.name} className="flex flex-col rounded-xl border border-base-border bg-base-panel/60 p-4 transition hover:border-partner-border/60">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] font-bold text-partner">{String(i + 1).padStart(2, '0')}</span>
              <span className="font-mono h-1 w-1 rounded-full bg-partner" aria-hidden="true" />
            </div>
            <h3 className="mt-2 font-display text-sm font-bold text-white">{d.name}</h3>
            <p className="mt-1.5 font-sans text-xs leading-relaxed text-base-dim">{d.prompt}</p>
          </div>
        ))}

        <div className="flex flex-col rounded-xl border-2 border-red-500/60 bg-red-950/30 p-4 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
          <h3 className="flex items-center gap-2 font-display text-sm font-bold text-red-300">
            <span aria-hidden="true">🚩</span>RED FLAGS
          </h3>
          <ul className="mt-2.5 space-y-1.5">
            {redFlags.map((flag) => (
              <li key={flag} className="flex items-start gap-2 font-sans text-xs leading-relaxed text-red-200">
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-red-400" aria-hidden="true" />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-5 border-t border-base-border/50 pt-4 text-center font-mono text-xs text-base-dim">
        {scorecardNote}
      </p>
    </section>
  )
}