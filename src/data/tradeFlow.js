export const tradeFlowSteps = [
  {
    id: 'kyc-check',
    tag: 'VENDOR',
    label: 'KYC VERIFIED',
    detail: 'Identity partner',
    ownership: 'PARTNER EXECUTION → MOCHATRADE CONTROL',
    latencyMs: 42,
    txHash: null,
  },
  {
    id: 'margin-check',
    tag: 'CORE',
    label: 'MARGIN CHECK',
    detail: 'Risk engine',
    ownership: 'MOCHATRADE CORE',
    latencyMs: 3,
    txHash: null,
  },
  {
    id: 'price-resolution',
    tag: 'CONTROL',
    label: 'PRICE RESOLVED',
    detail: 'Feed median · validated',
    ownership: 'PARTNER DATA → INTERNAL VALIDATION',
    latencyMs: 11,
    txHash: null,
  },
  {
    id: 'order-match',
    tag: 'CORE',
    label: 'ORDER MATCHED',
    detail: 'Matching engine',
    ownership: 'MOCHATRADE CORE',
    latencyMs: 6,
    txHash: null,
  },
  {
    id: 'position-open',
    tag: 'CORE',
    label: 'POSITION OPENED',
    detail: 'Self-custodial vault',
    ownership: 'MOCHATRADE CORE · SELF-CUSTODY',
    latencyMs: 180,
    txHash: '0x8f3e…c2',
  },
  {
    id: 'upi-settlement',
    tag: 'VENDOR',
    label: 'PAYMENT SETTLEMENT',
    detail: 'UPI rail',
    ownership: 'PARTNER RAIL → MOCHATRADE RECONCILIATION',
    latencyMs: 65,
    txHash: null,
  },
]

export const tradeFlowSummary = {
  ownStackCount: 4,
  vendorStepCount: 2,
  totalSteps: 6,
  headline: '4 of 6 hops run on MochaTrade\u2019s own stack.',
  subline:
    'The 2 partner hops execute behind the control layer — governed, validated, and swappable without touching core code.',
}

export const tradeOrder = {
  side: 'LONG',
  market: 'BTC-PERP',
  leverage: '5x',
  notional: '₹2,000',
}

export const tradeFlowMessage = 'EXTERNAL EXECUTION ≠ EXTERNAL DECISION OWNERSHIP.'