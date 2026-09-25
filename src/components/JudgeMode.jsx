import { useEffect, useState } from 'react'
import { judgeSteps, judgeStepSeconds } from '../data/judgeMode.js'

const accent = {
  build: 'text-build border-build-border bg-build-dim/40',
  partner: 'text-partner border-partner-border bg-partner-dim/40',
  hybrid: 'text-hybrid border-hybrid-border bg-hybrid-dim/40',
}

export default function JudgeMode({ onClose }) {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [finished, setFinished] = useState(false)
  const [left, setLeft] = useState(judgeStepSeconds)

  useEffect(() => {
    if (!playing || finished) return
    const t = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          setStep((sp) => {
            if (sp >= judgeSteps.length - 1) {
              setFinished(true)
              setPlaying(false)
              return sp
            }
            return sp + 1
          })
          return judgeStepSeconds
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [playing, finished])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [])

  const go = (dir) => {
    setLeft(judgeStepSeconds)
    setFinished(false)
    setStep((sp) => {
      const next = Math.max(0, Math.min(judgeSteps.length - 1, sp + dir))
      return next
    })
  }

  const restart = () => {
    setStep(0)
    setFinished(false)
    setPlaying(true)
    setLeft(judgeStepSeconds)
  }

  const current = judgeSteps[step]
  const progress = ((judgeStepSeconds - left) / judgeStepSeconds) * 100

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Judge mode — 60 second walkthrough"
    >
      <div className="animate-fade-slide-up relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-base-border bg-white shadow-2xl shadow-slate-900/15 ring-1 ring-white/70">
        <div className="flex items-center justify-between border-b border-base-border bg-base-card/60 px-5 py-3">
          <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-base-dim">
            <span className="text-base" aria-hidden="true">⚖️</span>
            JUDGE MODE · 60-SECOND WALKTHROUGH
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close judge mode"
            className="rounded-md p-1.5 font-mono text-xs text-base-dim transition hover:bg-base-border/60 hover:text-base-text cursor-pointer"
          >
            ✕ ESC
          </button>
        </div>

        <div className="relative flex-1 overflow-y-auto px-5 py-8 sm:px-10 sm:py-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f283815_1px,transparent_1px),linear-gradient(to_bottom,#1f283815_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {!finished ? (
            <div className="relative">
              <div className="flex items-center justify-between font-mono text-xs text-base-dim">
                <span className="tracking-widest font-bold">WALKTHROUGH :: {String(step + 1).padStart(2, '0')} / {String(judgeSteps.length).padStart(2, '0')}</span>
                <span className="text-base-muted font-bold">{left}s</span>
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-base-panel">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-build via-amber-400 to-hybrid transition-all duration-1000 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-10 sm:mt-14">
                <span className={`inline-flex items-center rounded-lg border px-4 py-1.5 font-mono text-xs font-extrabold uppercase tracking-widest ${accent[current.accent]}`}>
                  STEP {current.n}
                </span>
                <h3 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-base-text sm:text-5xl">
                  {current.title}
                </h3>
                <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-slate-700 font-medium sm:text-lg">
                  {current.body}
                </p>
              </div>

              <div className="mt-10 flex items-center justify-between border-t border-base-border/60 pt-4">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="rounded-lg border border-base-border bg-base-panel px-4 py-2 font-mono text-xs font-bold text-base-dim transition hover:bg-base-border/50 hover:text-base-text cursor-pointer"
                >
                  ← PREV
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPlaying((v) => !v)
                    if (finished) {
                      setFinished(false)
                      setLeft(judgeStepSeconds)
                    }
                  }}
                  className="rounded-lg border border-base-border bg-base-panel px-4 py-2 font-mono text-xs font-bold text-base-dim transition hover:bg-base-border/50 hover:text-base-text cursor-pointer"
                >
                  {playing ? '❚❚ PAUSE' : '▶ PLAY'}
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="rounded-lg bg-build px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-glow-build transition hover:brightness-110 cursor-pointer"
                >
                  NEXT →
                </button>
              </div>
            </div>
          ) : (
            <div className="relative flex flex-col items-center justify-center py-14 text-center">
              <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-hybrid">
                WALKTHROUGH COMPLETE
              </span>
              <p className="mt-5 font-display text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-build via-amber-600 to-hybrid sm:text-5xl">
                OWN THE RISK.
                <br />
                RENT THE PLUMBING.
              </p>
              <p className="mt-4 max-w-xl font-mono text-xs leading-relaxed text-slate-700 font-medium">
                BUILD WHAT CREATES THE MOAT. PARTNER WHAT IS SPECIALIZED. HYBRIDIZE CRITICAL DEPENDENCIES. CONTROL THE INTERFACES.
              </p>
              <button
                type="button"
                onClick={restart}
                className="mt-8 rounded-lg bg-hybrid px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-glow-hybrid transition hover:brightness-110 cursor-pointer"
              >
                ↺ PLAY AGAIN
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}