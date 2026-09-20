import { responsibilityRows, responsibilityClosing } from '../data/responsibilityMatrix.js'

export default function ResponsibilityMatrix() {
  return (
    <section id="responsibility" aria-labelledby="responsibility-heading" className="scroll-mt-28 panel p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 border-b border-base-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 id="responsibility-heading" className="font-display text-lg font-bold tracking-tight text-base-text">
              When Something Breaks — Who Owns It?
            </h2>
            <span className="badge-build">RESPONSIBILITY MATRIX</span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-base-dim">
            For every surface, the contract of who answers first, who owns the outcome, and how the customer lands.
          </p>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-base-border">
        <table className="w-full min-w-[56rem] border-collapse text-left font-mono text-[12px]">
          <thead>
            <tr className="bg-base-panel text-[11px] uppercase tracking-wider text-base-dim">
              {['COMPONENT', 'FAILURE', 'VENDOR RESPONSIBILITY', 'MOCHATRADE RESPONSIBILITY', 'CUSTOMER IMPACT', 'MITIGATION'].map((h) => (
                <th key={h} className="border-b border-base-border px-4 py-3 font-bold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {responsibilityRows.map((row, i) => (
              <tr key={row.component} className={`align-top ${i % 2 === 1 ? 'bg-base-card/60' : 'bg-base-card'}`}>
                <td className="border-b border-base-border/50 px-4 py-3 font-bold text-white">
                  <span
                    className={`badge ${
                      i === 4 ? 'badge-build' : i === 3 ? 'badge-hybrid' : 'badge-partner'
                    } mb-1`}
                  >
                    {row.component.toUpperCase()}
                  </span>
                </td>
                <td className="border-b border-base-border/50 px-4 py-3 leading-relaxed text-base-dim">{row.failure}</td>
                <td className="border-b border-base-border/50 px-4 py-3 leading-relaxed text-partner">{row.vendor}</td>
                <td className="border-b border-base-border/50 px-4 py-3 leading-relaxed text-build">{row.mocha}</td>
                <td className="border-b border-base-border/50 px-4 py-3 leading-relaxed text-base-text">{row.impact}</td>
                <td className="border-b border-base-border/50 px-4 py-3 leading-relaxed text-hybrid">{row.mitigation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 space-y-2.5">
        {responsibilityClosing.map((line) => (
          <div key={line} className="rounded-xl border border-build-border/60 bg-build-dim/60 p-4 text-center">
            <p className="font-display text-sm sm:text-base font-extrabold tracking-tight text-white">{line}</p>
          </div>
        ))}
      </div>
    </section>
  )
}