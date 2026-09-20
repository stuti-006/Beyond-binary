import { useState } from 'react'
import { components, getComponent, decisionMeta } from '../data/components.js'
import ComponentTooltip from './ComponentTooltip.jsx'

const coreIds = ['risk-engine', 'wallet-vaults', 'matching-engine']
const partnerIds = ['kyc-aml', 'feed-a', 'feed-b', 'payments', 'cloud']
const gateway = getComponent('mobile-gateway')
const adapter = getComponent('adapter-layer')

function Node({ id, compact }) {
  const [open, setOpen] = useState(false)
  const component = getComponent(id)
  const meta = decisionMeta[component.decision]

  const isBuild = component.decision === 'build'
  const isPartner = component.decision === 'partner'

  const glowStyle = open
    ? isBuild
      ? 'border-build shadow-glow-build bg-[#141923]'
      : isPartner
      ? 'border-partner shadow-glow-partner bg-[#141923]'
      : 'border-hybrid shadow-glow-hybrid bg-[#141923]'
    : isBuild
    ? 'border-build-border/80 hover:border-build hover:shadow-glow-build bg-base-card'
    : isPartner
    ? 'border-partner-border/80 hover:border-partner hover:shadow-glow-partner bg-base-card'
    : 'border-hybrid-border/80 hover:border-hybrid hover:shadow-glow-hybrid bg-base-card'

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        aria-expanded={open}
        className={`group flex w-full flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-all duration-200 hover:-translate-y-0.5 ${glowStyle} ${
          compact ? 'min-w-[9.5rem]' : 'min-w-[11rem]'
        }`}
      >
        <div className="flex w-full items-center justify-between gap-1">
          <span className="font-display text-[13.5px] font-bold leading-snug text-base-text group-hover:text-white">
            {component.name}
          </span>
          <span className="font-mono text-[10px] text-base-dim opacity-70">
            {component.monthlyCost === 'Free' ? '$0' : component.monthlyCost.split('/')[0]}
          </span>
        </div>
        <span className={meta.badgeClass}>{meta.label}</span>
      </button>
      {open && <ComponentTooltip component={component} onClose={() => setOpen(false)} />}
    </div>
  )
}

function Connector({ height = 'h-5' }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-0.5 ${height} bg-gradient-to-b from-build-border via-base-border to-partner-border`} aria-hidden="true" />
    </div>
  )
}

export default function InfraMap() {
  return (
    <section aria-labelledby="infra-map-heading" className="space-y-6">
      {/* HERO MOMENT BAND */}
      <div className="relative overflow-hidden rounded-2xl border border-build-border/50 bg-gradient-to-b from-[#141a24] via-[#0d1117] to-[#080b0f] p-5 sm:p-8 shadow-2xl shadow-black/80">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f283815_1px,transparent_1px),linear-gradient(to_bottom,#1f283815_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

        {/* Ambient Live Ticker Strip */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-base-border/70 pb-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-build">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-build opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-build"></span>
            </span>
            <span className="font-bold uppercase tracking-wider">LIVE ROUTER TICKER</span>
          </div>

          <div className="relative flex overflow-hidden max-w-full sm:max-w-md w-full mask-gradient">
            <div className="flex gap-6 animate-ticker whitespace-nowrap text-[12px] font-mono">
              <span className="text-base-text"><span className="text-base-dim">BTC-PERP</span> $64,280.50 <span className="text-hybrid font-bold">+2.4%</span></span>
              <span className="text-base-text"><span className="text-base-dim">ETH-PERP</span> $3,450.20 <span className="text-hybrid font-bold">+1.8%</span></span>
              <span className="text-base-text"><span className="text-base-dim">SOL-PERP</span> $148.75 <span className="text-red-400 font-bold">-0.5%</span></span>
              <span className="text-base-text"><span className="text-base-dim">INR/USD</span> 83.92</span>
              <span className="text-base-text"><span className="text-base-dim">ARB GAS</span> 0.1 Gwei</span>
              {/* Duplicate loop */}
              <span className="text-base-text"><span className="text-base-dim">BTC-PERP</span> $64,280.50 <span className="text-hybrid font-bold">+2.4%</span></span>
              <span className="text-base-text"><span className="text-base-dim">ETH-PERP</span> $3,450.20 <span className="text-hybrid font-bold">+1.8%</span></span>
              <span className="text-base-text"><span className="text-base-dim">SOL-PERP</span> $148.75 <span className="text-red-400 font-bold">-0.5%</span></span>
            </div>
          </div>
        </div>

        {/* Hero Title Statement */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                MochaTrade
              </h1>
              <span className="rounded border border-build-border bg-build-dim px-2.5 py-0.5 font-mono text-xs font-bold uppercase tracking-wider text-build shadow-[0_0_12px_rgba(232,89,12,0.3)]">
                Hybrid Infra
              </span>
            </div>
            <p className="mt-2 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-build via-amber-200 to-white">
              Own the Risk. Rent the Plumbing.
            </p>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-base-dim font-medium">
              Self-custodial perpetual futures for non-US retail traders. We build our risk engine and vault contracts, partner for commodity KYC & data feeds, and isolate everything behind an adapter layer bus.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3 font-mono text-xs bg-base-panel/90 border border-base-border rounded-xl p-3 shadow-inner">
            <div className="flex flex-col">
              <span className="text-[10px] text-base-dim uppercase tracking-wider font-semibold">Launch Speed</span>
              <span className="font-bold text-build text-sm">16 WEEKS</span>
            </div>
            <div className="h-6 w-px bg-base-border" />
            <div className="flex flex-col">
              <span className="text-[10px] text-base-dim uppercase tracking-wider font-semibold">Infra Strategy</span>
              <span className="font-bold text-hybrid text-sm">HYBRID BUS</span>
            </div>
          </div>
        </div>
      </div>

      {/* INFRASTRUCTURE MAP PANEL */}
      <div className="panel p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-base-border/70 pb-4">
          <div>
            <h2 id="infra-map-heading" className="font-display text-lg font-bold tracking-tight text-base-text">
              Infrastructure Map
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-base-dim">
              Click or hover any node for cost, build time, vendor SLA, and failure ownership.
            </p>
          </div>
          <div className="font-mono text-xs text-base-dim bg-base-panel px-3 py-1.5 rounded-lg border border-base-border">
            <span className="text-build font-bold">{coreIds.length + 2} OWNED</span> ·{' '}
            <span className="text-partner font-bold">{partnerIds.length} RENTED</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center">
          {/* User Phone Entry Point */}
          <div className="flex items-center gap-3 rounded-xl border border-base-border bg-base-panel px-4 py-2 shadow-md">
            <span className="text-xl leading-none" aria-hidden="true">📱</span>
            <div className="flex flex-col">
              <span className="font-display text-xs font-bold text-base-text">Non-US Trader Mobile App</span>
              <span className="font-mono text-[10px] text-base-dim">iOS / Android Gateway Entry</span>
            </div>
          </div>
          <Connector />

          {/* API Gateway Node */}
          <div className="w-full max-w-sm">
            <Node id={gateway.id} />
          </div>
          <Connector />

          {/* CORE REGION */}
          <div className="w-full rounded-2xl border-2 border-build-border/80 bg-gradient-to-b from-[#1c120c] to-[#0d1117] p-4 sm:p-5 shadow-[0_0_25px_rgba(232,89,12,0.15)]">
            <div className="flex items-center justify-between">
              <span className="badge-build">WE OWN THIS — CORE RISK ENGINE & VAULTS</span>
              <span className="font-mono text-[11px] text-build/80 font-bold">100% MOCHATRADE CODE</span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {coreIds.map((id) => (
                <Node key={id} id={id} />
              ))}
            </div>
          </div>

          <Connector height="h-6" />

          {/* REWORKED ADAPTER LAYER BUS */}
          <div className="w-full my-2">
            <div className="relative rounded-2xl border-2 border-build bg-gradient-to-r from-[#1c120c] via-[#2d180b] to-[#1c120c] p-4 shadow-glow-build">
              {/* Traveling Pulse Animation */}
              <div className="absolute inset-x-0 top-0 h-1 overflow-hidden rounded-t-2xl">
                <div className="absolute top-0 h-full w-48 bg-gradient-to-r from-transparent via-build to-transparent animate-bus-pulse shadow-[0_0_15px_#e8590c]" />
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-build/60 bg-build-dim text-build font-mono text-lg font-bold shadow-[0_0_15px_#e8590c]">
                    ⚡
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-base sm:text-lg font-bold tracking-tight text-white">
                        ADAPTER LAYER BUS
                      </span>
                      <span className="badge-build">ISOLATION ENGINE</span>
                    </div>
                    <p className="mt-0.5 text-xs text-base-dim leading-snug">
                      Central isolation layer wrapping every vendor API — handles retries, fallback routes, circuit breakers & price validation.
                    </p>
                  </div>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                  <Node id={adapter.id} compact={false} />
                </div>
              </div>

              {/* Connector Ports Array */}
              <div className="mt-4 hidden sm:grid grid-cols-5 gap-2 pt-3 border-t border-build-border/40">
                {partnerIds.map((id) => (
                  <div key={id} className="flex flex-col items-center">
                    <div className="flex items-center gap-1 font-mono text-[10px] text-build font-bold tracking-wider">
                      <span className="h-1.5 w-1.5 rounded-full bg-build animate-pulse" />
                      <span>PORT::{id.toUpperCase()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Connector height="h-6" />

          {/* PARTNER REGION */}
          <div className="w-full rounded-2xl border-2 border-partner-border/80 bg-gradient-to-b from-[#0b1624] to-[#0d1117] p-4 sm:p-5 shadow-[0_0_25px_rgba(25,113,194,0.15)]">
            <div className="flex items-center justify-between">
              <span className="badge-partner">RENTED — COMMODITY PLUMBING (SWAP-READY)</span>
              <span className="font-mono text-[11px] text-partner/80 font-bold">VENDOR API BOUNDARY</span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-x-3 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
              {partnerIds.map((id) => (
                <div key={id} className="flex flex-col items-center">
                  <div className="h-3 w-0.5 bg-partner-border" aria-hidden="true" />
                  <Node key={id} id={id} compact />
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 text-center font-mono text-xs text-base-dim border-t border-base-border/50 pt-4">
          Total Infrastructure: <span className="text-base-text font-bold">{components.length} components</span> ·{' '}
          <span className="text-build font-bold">{coreIds.length + 2} built or hybrid</span> ·{' '}
          <span className="text-partner font-bold">{partnerIds.length} partnered behind 1 adapter bus</span>
        </p>
      </div>
    </section>
  )
}

