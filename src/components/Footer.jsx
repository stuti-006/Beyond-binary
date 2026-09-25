export default function Footer() {
  return (
    <footer className="mt-auto border-t border-base-border/70 bg-white/60 py-4 font-sans text-xs text-base-dim">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-center sm:flex-row sm:px-8 sm:text-left">
        <div className="space-y-0.5">
          <p className="font-semibold text-base-text">
            Beyond Binary — ACM MarketSphere 2026, Track 4
            <span className="mx-2 hidden text-base-muted sm:inline">•</span>
            <span className="block font-normal text-base-dim sm:inline">"Own the Risk. Rent the Plumbing."</span>
          </p>
          <p className="text-[11px] text-base-muted">
            Economic ratings are illustrative estimates, not sourced market prices.
          </p>
        </div>
        <div className="shrink-0 font-mono text-[11px]">
          <a
            href="https://github.com/stuti-006/Beyond-binary"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-partner hover:underline"
          >
            <span>GitHub Repository</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
