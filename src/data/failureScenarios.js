export const failureScenarios = [
  {
    id: 'kyc-timeout',
    buttonLabel: 'KYC PROVIDER TIMEOUT',
    target: 'Identity verification vendor stops responding.',
    timeline: [
      { tag: 'VENDOR', text: 'KYC request → vendor timeout', note: 'no response after retries', status: 'error' },
      { tag: 'CONTROL', text: 'Adapter layer detects failure', note: 'verification route tripped', status: 'warn' },
      { tag: 'CONTROL', text: 'Retry → secondary provider', note: 'failover route attempted', status: 'warn' },
      { tag: 'VENDOR', text: 'Secondary provider unavailable', note: 'verification cannot complete', status: 'error' },
      { tag: 'CORE', text: 'Verification unavailable → TRADE BLOCKED', note: 'compliance gate cannot be bypassed', status: 'error' },
    ],
    statusBoard: [
      { label: 'CUSTOMER FUNDS', value: 'SAFE', tone: 'ok' },
      { label: 'TRADE', value: 'BLOCKED', tone: 'bad' },
      { label: 'AUDIT LOG', value: 'CREATED', tone: 'ok' },
      { label: 'RETRY', value: 'SCHEDULED', tone: 'warn' },
    ],
    resultLabel: 'TRADE BLOCKED',
    resultTone: 'blocked',
    message: 'A vendor failure never bypasses compliance.',
    banner: {
      tone: 'blocked',
      text: 'Trade hard-blocked until verification completes. Customer funds remain in the self-custodial vault — untouched, un-lendable, un-spendable.',
    },
    takeaway:
      'A failing vendor must never force an uncontrolled product decision. Kill the path, log it, retry it.',
  },
  {
    id: 'feed-failure',
    buttonLabel: 'MARKET DATA FEED FAILURE',
    target: 'Primary price feed (Feed A) goes down.',
    timeline: [
      { tag: 'VENDOR', text: 'Feed A → DOWN', note: 'no fresh quotes delivered', status: 'error' },
      { tag: 'CONTROL', text: 'Adapter detects staleness', note: 'freshness threshold crossed', status: 'warn' },
      { tag: 'CONTROL', text: 'Switch → Feed B', note: 'secondary source takes over', status: 'ok' },
      { tag: 'CONTROL', text: 'Validate freshness / divergence', note: 'cross-checking both sources', status: 'ok' },
      { tag: 'CORE', text: 'Confidence confirmed', note: 'continue trading on validated data', status: 'ok' },
    ],
    statusBoard: [
      { label: 'FEED A', value: 'DOWN', tone: 'bad' },
      { label: 'FEED B', value: 'ACTIVE', tone: 'ok' },
      { label: 'FRESHNESS', value: 'VALIDATED', tone: 'ok' },
      { label: 'TRADING PATH', value: 'CONTINUES', tone: 'ok' },
    ],
    resultLabel: 'CONTINUED SAFE',
    resultTone: 'hybrid',
    message: 'A single feed going down should never end a session — or silently poison one.',
    banner: {
      tone: 'success',
      text: 'Feed B took over and the adapter validated freshness and divergence within thresholds. Trading continued without manual intervention.',
    },
    takeaway:
      'Partner the sources. Own the confidence decision. A feed is data; the adapter decides what is trustworthy.',
    confidenceFailure: {
      label: 'IF DATA CANNOT BE TRUSTED',
      blocks: ['PRICE CONFIDENCE FAILED', 'TRADING PATH PAUSED'],
      note: 'If divergence or staleness exceeds thresholds across all available sources, the adapter pauses price-dependent trading rather than act on untrusted ticks.',
    },
  },
  {
    id: 'upi-outage',
    buttonLabel: 'UPI / BANKING OUTAGE',
    target: 'Deposit rail (UPI) unreachable.',
    timeline: [
      { tag: 'VENDOR', text: 'UPI rail unreachable', note: 'deposit cannot confirm', status: 'error' },
      { tag: 'CONTROL', text: 'Deposit → DELAYED', note: 'queued for retry / reconciliation', status: 'warn' },
      { tag: 'CONTROL', text: 'Retry + reconciliation engine', note: 'deposit matched on next check', status: 'ok' },
      { tag: 'CONTROL', text: 'Customer notified', note: 'transparent status message dispatched', status: 'ok' },
      { tag: 'CORE', text: 'Existing trading state', note: 'positions, orders, risk engine untouched', status: 'ok' },
    ],
    statusBoard: [
      { label: 'DEPOSIT', value: 'DELAYED', tone: 'warn' },
      { label: 'RETRY', value: 'SCHEDULED', tone: 'ok' },
      { label: 'CUSTOMER', value: 'NOTIFIED', tone: 'ok' },
      { label: 'TRADING STATE', value: 'UNAFFECTED', tone: 'ok' },
    ],
    resultLabel: 'DEPOSIT DELAYED — TRADING UNAFFECTED',
    resultTone: 'retry',
    message: 'Deposits can wait. Open positions cannot be left to fate.',
    banner: {
      tone: 'warn',
      text: 'The deposit enters the reconciliation queue and retries automatically. The customer is told the truth immediately — while trading, positions and risk controls never pause.',
    },
    takeaway:
      'Banking rails are plumbing: delay them, reconcile them, never let them corrupt an open position.',
  },
]