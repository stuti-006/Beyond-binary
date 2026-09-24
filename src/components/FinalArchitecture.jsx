import { finalTiers, finalStatement } from '../data/finalArchitecture.js'

const tierTone = {
  build: {
    border: 'border-build-border/70',
    badge: 'badge-build',
    bullet: 'bg-build',
  },
  hybrid: {
    border: 'border-hybrid',
    badge: 'badge-hybrid',
    bullet: 'bg-hybrid',
  },
  partner: {
    border: 'border-partner-border/70',
    badge: 'badge-partner',
    bullet: 'bg-partner',
  },
}

export default function FinalArchitecture() {
  return (
    <section id="final-arch" aria-labelledby="final-arch-heading" className="scroll-mt-28 panel p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-base-border/70 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="final-arch-heading" className="font-display text-lg font-bold tracking-tight text-base-text">
              Final Architecture
            </h2>
            <span className="badge-build">END STATE</span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-base-dim max-w-2xl">
            Three tiers, one rule: everything core stays ours, every partner enters behind a control template we own.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        {finalTiers.map((tier, i) => {
          const tone = tierTone[tier.tone]
          return (
            <div key={tier.key} className={`flex flex-col rounded-2xl border-2 ${tone.border} bg-gradient-to-b from-[#141a24] to-[#0d1117] p-5 shadow-xl shadow-black/50`}>
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-sm sm:text-base font-extrabold tracking-tight text-white">
                  {tier.name}
                </h3>
                <span className={`badge ${tone.badge}`}>{tier.badge}</span>
              </div>
              <div className="my-3 h-px bg-slate-700/60" aria-hidden="true" />
              <ul className="space-y-2">
                {tier.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 font-sans text-xs sm:text-sm font-medium leading-relaxed text-slate-200">
                    <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${tone.bullet}`} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {i < finalTiers.length - 1 && (
                <div className="mt-auto pt-3 text-center font-mono text-slate-400" aria-hidden="true">
                  ▼
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-5 rounded-2xl border-2 border-build-border/60 bg-gradient-to-r from-[#1c120c] via-[#141923] to-[#1c120c] p-6 text-center shadow-[0_0_25px_rgba(232,89,12,0.2)]">
        <p className="font-display text-lg sm:2xl font-extrabold tracking-tight text-white">
          {finalStatement}
        </p>
        <p className="mt-2 font-mono text-xs sm:text-sm text-slate-300">
          CONTROL THE INTERFACES. OWN THE RISK. DESIGN FOR FAILURE.
        </p>
      </div>
    </section>
  )
}