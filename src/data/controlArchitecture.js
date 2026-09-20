export const controlStack = {
  core: {
    name: 'MOCHATRADE CORE',
    badge: 'OUR CODE · BUILT',
    items: [
      'Trading logic',
      'Risk decisions',
      'Customer experience',
      'Security policy',
      'Failure handling',
      'Internal controls',
    ],
  },
  layer: {
    name: 'ADAPTER / CONTROL LAYER',
    badge: 'OUR PROPOSED ARCHITECTURE',
    items: ['Retries', 'Circuit breaker', 'Freshness & divergence validation', 'Vendor health', 'Audit trail', 'Failover routing'],
  },
  vendors: [
    { id: 'vendor-a', name: 'VENDOR A', detail: 'KYC / AML', key: 'a' },
    { id: 'vendor-b', name: 'VENDOR B', detail: 'KYC / AML · standby', key: 'b' },
    { id: 'rail', name: 'PAYMENT RAIL', detail: 'UPI / banking', key: 'rail' },
    { id: 'feed', name: 'DATA FEED', detail: 'Market prices', key: 'feed' },
  ],
}

export const vendorSwapSteps = [
  { text: 'VENDOR A :: HEARTBEAT LOST', note: 'timeout after retries exhausted', status: 'error' },
  { text: 'ADAPTER LAYER :: CIRCUIT BREAKER', note: 'dependency isolated from core', status: 'warn' },
  { text: 'VENDOR B :: FAILOVER PATH ACTIVATED', note: 'secondary provider takes over', status: 'ok' },
  { text: 'MOCHATRADE CORE :: UNCHANGED', note: 'no core code recompiled', status: 'ok' },
]

export const vendorSwapClaims = ['CORE APPLICATION UNCHANGED', 'DEPENDENCY ISOLATED', 'FAILOVER PATH ACTIVE']

export const controlMessage = 'PARTNERS CAN CHANGE. CORE DECISIONS SHOULD NOT.'