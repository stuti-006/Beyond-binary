export const responsibilityRows = [
  {
    component: 'KYC / AML',
    failure: 'Vendor timeout or screening outage',
    vendor: 'Verification service availability; screening quality',
    mocha: 'Verification policy, decisioning, monitoring, escalation, auditability',
    impact: 'Onboarding gates new orders; funds untouched',
    mitigation: 'SLA + security review + audit rights + secondary provider readiness',
  },
  {
    component: 'Market Data',
    failure: 'Feed outage, stale ticks, divergence',
    vendor: 'Quote sourcing and delivery',
    mocha: 'Freshness / divergence validation, price-confidence policy, trading pauses',
    impact: 'Trading paused when confidence fails; no trusted data → no trades',
    mitigation: 'Dual feeds, thresholds, adapter switch, pause path',
  },
  {
    component: 'Payments',
    failure: 'UPI / banking rail outage',
    vendor: 'Rail connectivity and settlement',
    mocha: 'Reconciliation, retry queue, customer notification, settlement ledger',
    impact: 'Deposits / withdrawals delayed; open positions unaffected',
    mitigation: 'Retry / reconciliation, secondary-rail readiness',
  },
  {
    component: 'Wallet',
    failure: 'Key-management or custody bridge issue',
    vendor: 'MPC / HSM key infrastructure operations',
    mocha: 'Contract logic, custody policy, governance, signing rules',
    impact: 'Deposits frozen; funds remain on-chain under the custody policy',
    mitigation: 'Contract audits, multi-signature governance, key-vendor SLA',
  },
  {
    component: 'Trading Engine',
    failure: 'Bug, surge, or liquidation cascade',
    vendor: 'Only commodity cloud beneath it',
    mocha: 'Everything — matching, margin, risk, internal controls',
    impact: 'The one surface we fully own; highest platform risk',
    mitigation: 'Layered risk checks, kill switches, paper beta, controlled volume ramp',
  },
]

export const responsibilityClosing = [
  'VENDOR ACCOUNTABILITY ≠ MOCHATRADE ACCOUNTABILITY.',
  'MochaTrade cannot outsource responsibility for how its product behaves.',
]