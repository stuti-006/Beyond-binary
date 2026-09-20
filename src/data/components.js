// ═══════════════════════════════════════════════════════════════
// src/data/components.js
// Single source of truth. Every panel in the UI renders from this
// file — it doubles as living architecture documentation for
// MochaTrade's "Own the Risk. Rent the Plumbing." infrastructure.
// ═══════════════════════════════════════════════════════════════

/**
 * decision: 'BUILD' | 'PARTNER' | 'HYBRID'
 * layer:    'core' | 'adapter' | 'partner'
 */
export const components = [
  {
    id: 'risk-engine',
    name: 'Risk & Liquidation Engine',
    decision: 'BUILD',
    layer: 'core',
    reason:
      'A bad liquidation cascade is the one thing that kills a perps platform. It cannot be a vendor ticket at 3 AM.',
    monthlyCost: '₹6.7L/mo',
    buildTime: '2 senior engineers, 8 weeks to v1',
    failureOwner: 'MochaTrade — insurance fund + auto-deleveraging backstop, fully ours',
    vendor: null,
  },
  {
    id: 'wallet-vaults',
    name: 'Self-Custodial Wallet Vaults',
    decision: 'HYBRID',
    layer: 'core',
    reason:
      "Own the on-chain contracts — \"we never hold your funds\" is the compliance moat; rent MPC/HSM key infrastructure.",
    monthlyCost: '₹4.1L/mo (audit amortized + key-infra rent)',
    buildTime: '6 weeks contracts + 2 weeks vendor integration',
    failureOwner:
      'Hybrid: contracts ours, key infra vendor with contractual indemnity',
    vendor: 'Fireblocks (MPC key infrastructure)',
  },
  {
    id: 'matching-engine',
    name: 'Matching Engine',
    decision: 'BUILD',
    layer: 'core',
    reason:
      'v1: audited OSS fork for a 16-week launch; v2: hot paths rewritten in-house once volume justifies it.',
    monthlyCost: '₹2.3L/mo (infra + audit maintenance)',
    buildTime: '4 weeks to fork, harden, and deploy',
    failureOwner: 'MochaTrade — we run and monitor the fork ourselves',
    vendor: 'Open-source fork (audited)',
  },
  {
    id: 'mobile-gateway',
    name: 'Mobile App + API Gateway',
    decision: 'BUILD',
    layer: 'core',
    reason: 'UX is the acquisition edge in retail India.',
    monthlyCost: '₹3.8L/mo (3 eng + design)',
    buildTime: '10 weeks to launch-ready',
    failureOwner: 'MochaTrade — the whole surface area users touch',
    vendor: null,
  },
  {
    id: 'adapter-layer',
    name: 'Adapter Layer',
    decision: 'BUILD',
    layer: 'adapter',
    reason:
      'Our code between every partner and our core. Swapping any vendor = a config change, not a rewrite. This is what makes partnering safe.',
    monthlyCost: '₹1.4L/mo (1 engineer, ongoing)',
    buildTime: '3 weeks for v1 contracts, grows with each integration',
    failureOwner: 'MochaTrade — owns retries, fallbacks, and vendor timeouts',
    vendor: null,
  },
  {
    id: 'kyc-aml',
    name: 'KYC / AML',
    decision: 'PARTNER',
    layer: 'partner',
    reason:
      'Licensed commodity; in-house = 18 months of licensing wasted. ~$1.5 per verification.',
    monthlyCost: '~$1.5 / verification (usage-based)',
    buildTime: '2 weeks integration behind the adapter layer',
    failureOwner:
      'Vendor for screening errors; MochaTrade keeps regulatory accountability — you outsource the task, never the obligation',
    vendor: 'Fractal ID',
  },
  {
    id: 'feed-a',
    name: 'Market Data Feed A (Pyth oracle)',
    decision: 'PARTNER',
    layer: 'partner',
    reason:
      'Decentralized oracle network, sub-second updates, no single point of failure on the source side.',
    monthlyCost: '₹0.9L/mo (network fees)',
    buildTime: '1 week integration',
    failureOwner: 'Vendor for feed uptime; MochaTrade validates every tick',
    vendor: 'Pyth Network',
  },
  {
    id: 'feed-b',
    name: 'Market Data Feed B (licensed feed)',
    decision: 'PARTNER',
    layer: 'partner',
    reason:
      'Dual feeds + our own median/validation layer: one bad price can never trigger mass liquidation.',
    monthlyCost: '₹1.6L/mo (licensing)',
    buildTime: '1 week integration',
    failureOwner: 'Vendor for feed uptime; MochaTrade validates every tick',
    vendor: 'Kaiko',
  },
  {
    id: 'payments',
    name: 'Payments / UPI + USDC',
    decision: 'PARTNER',
    layer: 'partner',
    reason:
      'Regulated payment rails with existing NPCI certification — rebuilding UPI connectivity in-house adds months for zero differentiation.',
    monthlyCost: '~0.4% take rate on deposit volume',
    buildTime: '3 weeks integration behind the adapter layer',
    failureOwner: 'Vendor for rail uptime; MochaTrade queues and retries deposits',
    vendor: 'Juspay / Razorpay (UPI) + Circle (USDC)',
  },
  {
    id: 'cloud',
    name: 'Cloud / AWS Mumbai',
    decision: 'PARTNER',
    layer: 'partner',
    reason: 'Full IaC; migration = a config change.',
    monthlyCost: '₹2.1L/mo (compute + data transfer)',
    buildTime: 'Standing infra, provisioned week 1',
    failureOwner: 'Vendor for regional uptime; MochaTrade runs multi-AZ failover',
    vendor: 'AWS ap-south-1 (Mumbai)',
  },
]

export const getComponent = (id) => components.find((c) => c.id === id)

// ═══════════════════════════════════════════════════════════════
// Live Trade Flow Simulator — Panel 2
// A single ₹2,000 LONG BTC-PERP, 5x test trade, step by step.
// tag: 'OUR CODE' | 'VENDOR API' | 'HYBRID'
// ═══════════════════════════════════════════════════════════════
export const tradeFlowSteps = [
  {
    id: 'kyc-check',
    componentId: 'kyc-aml',
    tag: 'VENDOR API',
    label: 'KYC verified',
    detail: 'Fractal ID',
    latencyMs: 42,
    txHash: null,
  },
  {
    id: 'margin-check',
    componentId: 'risk-engine',
    tag: 'OUR CODE',
    label: 'Margin check',
    detail: 'Risk Engine',
    latencyMs: 3,
    txHash: null,
  },
  {
    id: 'price-resolution',
    componentId: 'adapter-layer',
    tag: 'HYBRID',
    label: 'Price $67,240',
    detail: 'median Feed A+B, validated',
    latencyMs: 11,
    txHash: null,
  },
  {
    id: 'order-match',
    componentId: 'matching-engine',
    tag: 'OUR CODE',
    label: 'Order matched',
    detail: 'Matching Engine',
    latencyMs: 6,
    txHash: null,
  },
  {
    id: 'position-open',
    componentId: 'wallet-vaults',
    tag: 'OUR CODE',
    label: 'Position opened',
    detail: 'Vault',
    latencyMs: 180,
    txHash: '0x8f3e…c2',
  },
  {
    id: 'upi-settlement',
    componentId: 'payments',
    tag: 'VENDOR API',
    label: 'Margin settled',
    detail: 'Juspay',
    latencyMs: 65,
    txHash: null,
  },
]

export const tradeFlowSummary = {
  ownStackCount: 4,
  vendorStepCount: 2,
  totalSteps: 6,
  headline: "4 of 6 steps ran on MochaTrade's own stack.",
  subline:
    'The 2 vendor steps sit behind the adapter layer: swappable in a config change.',
}

export const tradeOrder = {
  side: 'LONG',
  market: 'BTC-PERP',
  leverage: '5x',
  notional: '₹2,000',
}

// ═══════════════════════════════════════════════════════════════
// Vendor Failure Simulator — Panel 3
// Each scenario replays the trade flow with a failure injected.
// outcome: 'degraded-safe' | 'blocked' | 'retry'
// ═══════════════════════════════════════════════════════════════
export const failureScenarios = [
  {
    id: 'feed-a-down',
    buttonLabel: 'Feed A (Pyth) goes down',
    injectAtStep: 'price-resolution',
    outcome: 'degraded-safe',
    consoleOverride: [
      { tag: 'VENDOR API', text: 'Feed A timeout', note: 'Pyth Network unreachable', status: 'warn' },
      {
        tag: 'HYBRID',
        text: 'Adapter layer reroutes',
        note: 'Feed B + last-validated price',
        status: 'ok',
      },
      {
        tag: 'OUR CODE',
        text: 'Widened margin check',
        note: 'Risk Engine, degraded-mode buffer applied',
        status: 'ok',
      },
    ],
    resultLabel: 'DEGRADED BUT SAFE',
    resultTone: 'hybrid',
    banner: {
      tone: 'success',
      text: 'No swap, no downtime. The adapter layer did its job.',
    },
    takeaway:
      'This is why partners sit behind adapters — and why the risk engine is ours.',
  },
  {
    id: 'kyc-timeout',
    buttonLabel: 'KYC vendor timeout',
    injectAtStep: 'kyc-check',
    outcome: 'blocked',
    consoleOverride: [
      {
        tag: 'VENDOR API',
        text: 'Fractal ID timeout',
        note: 'no response after 3 retries',
        status: 'error',
      },
      {
        tag: 'OUR CODE',
        text: 'Trade blocked',
        note: 'Adapter layer declines to proceed without verified KYC',
        status: 'error',
      },
    ],
    resultLabel: 'BLOCKED',
    resultTone: 'blocked',
    userMessage: 'A vendor failure never bypasses compliance.',
    banner: {
      tone: 'blocked',
      text: 'Trade hard-blocked. Verification will retry automatically — your funds are untouched.',
    },
    takeaway:
      'This is why partners sit behind adapters — and why the risk engine is ours.',
  },
  {
    id: 'upi-down',
    buttonLabel: 'UPI rails down',
    injectAtStep: 'upi-settlement',
    outcome: 'retry',
    consoleOverride: [
      {
        tag: 'VENDOR API',
        text: 'Juspay UPI rail unreachable',
        note: 'NPCI switch degraded',
        status: 'error',
      },
      {
        tag: 'OUR CODE',
        text: 'Deposit queued for retry',
        note: 'Adapter layer, existing positions untouched',
        status: 'warn',
      },
    ],
    resultLabel: 'DEPOSIT DELAYED',
    resultTone: 'retry',
    userMessage: 'Deposit rejected — your open positions and trading are unaffected.',
    banner: {
      tone: 'warn',
      text: 'Deposit failed, retrying automatically. Trading was never at risk.',
    },
    takeaway:
      'This is why partners sit behind adapters — and why the risk engine is ours.',
  },
]

// ═══════════════════════════════════════════════════════════════
// Roadmap Strip — footer
// ═══════════════════════════════════════════════════════════════
export const roadmapPhases = [
  {
    id: 'phase-1',
    weeks: 'W1–4',
    title: 'Wallet contracts + partners live',
    detail: 'Vault contracts audited, KYC/AML, feeds, payments, and cloud all wired behind the adapter layer.',
  },
  {
    id: 'phase-2',
    weeks: 'W5–8',
    title: 'Risk engine first',
    detail: 'Liquidation engine and insurance fund logic built and stress-tested before a single trade goes live.',
  },
  {
    id: 'phase-3',
    weeks: 'W9–12',
    title: 'Matching fork + 500-user paper beta',
    detail: 'Audited OSS matching engine deployed; closed paper-trading beta with 500 users.',
  },
  {
    id: 'phase-4',
    weeks: 'W13–16',
    title: 'Mainnet launch',
    detail: '5x max leverage, dual feeds live, insurance fund seeded, real capital on-chain.',
  },
]

export const triggerChips = [
  'In-source matching hot paths @ $50M daily volume',
  '2nd KYC vendor @ 10K users',
  'Market-maker ops @ $150M daily volume',
]

export const decisionMeta = {
  BUILD: { label: 'BUILD', color: '#e8590c', badgeClass: 'badge-build' },
  PARTNER: { label: 'PARTNER', color: '#1971c2', badgeClass: 'badge-partner' },
  HYBRID: { label: 'HYBRID', color: '#2f9e44', badgeClass: 'badge-hybrid' },
}
