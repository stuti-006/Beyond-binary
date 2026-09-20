export const decisionBoardComponents = [
  {
    id: 'wallet',
    icon: '🔐',
    name: 'Self-Custodial Wallet Technology',
    decision: 'HYBRID',
    caseRequirement: 'Case requires a self-custodial / non-custodial wallet model. Users, not the platform, retain control of funds.',
    why: 'Self-custody is the trust promise the product is built on — "we never hold your funds." The wallet contract logic, custody policy and governance create the differentiation, while specialized key-management infrastructure is rented.',
    whyNot: [
      {
        label: 'WHY NOT PURE PARTNER',
        text: 'Handing custody wholesale to a vendor surrenders the exact trust edge the product is built on.',
      },
      {
        label: 'WHY NOT PURE BUILD',
        text: 'Key custody hardware and MPC infrastructure demand deep security specialization; building all of it from scratch delays launch for low differentiation.',
      },
    ],
    owns: [
      'Wallet contract logic',
      'Custody & signing policy',
      'Governance & admin controls',
      'Decision of who can move funds, and when',
    ],
    partnerOwns: [
      'MPC / HSM key-management infrastructure',
      'Key shard generation & hardware',
      'Secure enclave operations',
    ],
    keyRisk: 'Key-management or custody-bridge failure becomes a single point of failure for user funds.',
    mitigation: 'Contract audits, multi-signature governance, key-infrastructure SLA, and a policy that prevents a single party from moving funds alone.',
    economics: {
      upfront: 'HIGH',
      ongoing: 'MEDIUM',
      engineering: 'MEDIUM',
      compliance: 'HIGH',
      switching: 'MEDIUM',
      strategicValue: 'HIGH',
    },
  },
  {
    id: 'payments',
    icon: '💳',
    name: 'UPI / Banking Rails',
    decision: 'PARTNER',
    caseRequirement: 'Case requires INR deposits and withdrawals via UPI and banking rails.',
    why: 'Regulated national payment rails already carry the certifications and mature workflows we would otherwise need to build. Integrating a certified rail is faster, safer, and carries zero differentiation downside.',
    whyNot: [
      {
        label: 'WHY NOT BUILD',
        text: 'Deposit / withdrawal rails are commodity plumbing with heavy certification and regulatory burden and effectively no competitive edge.',
      },
    ],
    owns: [
      'Deposit & withdrawal policy',
      'Reconciliation ledger',
      'Retry / notification decisioning',
      'Customer settlement experience',
    ],
    partnerOwns: [
      'UPI / banking connectivity',
      'Switch & certification integration',
      'Downstream settlement execution',
    ],
    keyRisk: 'Rail outage delays deposits or withdrawals and erodes user confidence.',
    mitigation: 'Retry and reconciliation queue, proactive customer notification, secondary-rail readiness, and a design where open positions are never touched by a rail outage.',
    economics: {
      upfront: 'LOW',
      ongoing: 'MEDIUM',
      engineering: 'LOW',
      compliance: 'MEDIUM',
      switching: 'MEDIUM',
      strategicValue: 'LOW',
    },
  },
  {
    id: 'kyc',
    icon: '🆔',
    name: 'KYC / AML Verification',
    decision: 'PARTNER',
    caseRequirement: 'Case requires customer identity verification and AML screening.',
    why: 'Specialized compliance infrastructure, faster integration, mature workflows, and continuously evolving regulatory requirements make a dedicated verification provider the right owner of execution.',
    whyNot: [
      {
        label: 'WHY NOT BUILD',
        text: 'High maintenance and compliance burden with limited differentiation. The decision surface, not the document checks, is where we create value.',
      },
    ],
    owns: [
      'Policy',
      'Decisioning',
      'Monitoring',
      'Escalation',
      'Auditability',
    ],
    partnerOwns: [
      'Identity verification execution',
      'Document & liveness checks',
      'Watchlist screening infrastructure',
    ],
    keyRisk: 'Verification vendor timeout or outage gates onboarding and blocks trades.',
    mitigation: 'SLA + security review + audit rights + monitoring + secondary-provider readiness. A vendor failure never bypasses compliance.',
    economics: {
      upfront: 'LOW',
      ongoing: 'MEDIUM',
      engineering: 'LOW',
      compliance: 'HIGH',
      switching: 'MEDIUM',
      strategicValue: 'MEDIUM',
    },
  },
  {
    id: 'trading',
    icon: '⚙️',
    name: 'Trading Engine',
    decision: 'BUILD',
    caseRequirement: 'Case requires core trading execution: matching, margin, and position management.',
    why: 'The trading engine is the product. Matching and risk decisions define the customer outcome, and liquidation behavior is the platform\u2019s most consequential code — it cannot be a vendor ticket at 3 AM.',
    whyNot: [
      {
        label: 'WHY NOT PARTNER',
        text: 'Off-the-shelf matching / risk packages peer into the exact decision surface that differentiates us and hand over control of how positions behave in a crisis.',
      },
    ],
    owns: [
      'Matching logic',
      'Margin checks',
      'Position lifecycle',
      'Liquidation & risk policy',
      'Internal controls',
    ],
    partnerOwns: 'Only commodity infrastructure beneath it (hosting, networking). No business logic.',
    keyRisk: 'A bug or volume surge in matching / risk logic cascades into a liquidation event.',
    mitigation: 'Layered risk checks, kill switches, paper beta before real capital, controlled volume ramp, and a full internal audit trail.',
    economics: {
      upfront: 'HIGH',
      ongoing: 'HIGH',
      engineering: 'HIGH',
      compliance: 'MEDIUM',
      switching: 'HIGH',
      strategicValue: 'HIGH',
    },
  },
  {
    id: 'feeds',
    icon: '📈',
    name: 'Market Data Feeds',
    decision: 'CONTROLLED',
    caseRequirement: 'Case requires reliable price feeds for perpetual contracts.',
    why: 'Quote sourcing is specialized infrastructure, but price integrity is a core decision surface. Partner the sources; control the validation. Feed data enters the risk engine only after our confidence checks.',
    whyNot: [
      {
        label: 'WHY NOT PURE BUILD',
        text: 'Standing up an independent market-data network from scratch is years of distribution engineering with no advantage at our stage.',
      },
      {
        label: 'WHY NOT PURE PARTNER',
        text: 'Consuming a single feed blindly hands price risk — staleness, manipulation, divergence — straight into liquidation logic.',
      },
    ],
    owns: [
      'Feed ingestion control',
      'Freshness & divergence validation',
      'Tick safety checks',
      'Price-confidence policy',
    ],
    partnerOwns: [
      'Quote sourcing',
      'Network health',
      'Delivery SLA',
    ],
    keyRisk: 'Stale or divergent ticks trigger wrongful liquidations before anyone notices.',
    mitigation: 'Dual feeds, divergence thresholds, freshness checks, a pause-trading path when confidence fails, and no single feed ever holding liquidation authority.',
    economics: {
      upfront: 'MEDIUM',
      ongoing: 'HIGH',
      engineering: 'MEDIUM',
      compliance: 'LOW',
      switching: 'LOW',
      strategicValue: 'HIGH',
    },
  },
]

export const caseRequirements = [
  'Self-custodial wallets',
  'UPI / banking rails',
  'KYC / AML verification',
  'Trading engine',
  'Market data feeds',
]

export const proposedArchitecture = [
  'Adapter / control layer',
  'Risk engine',
  'Monitoring',
  'Failover',
  'Vendor health',
]

export const caseVsProposedNote =
  'Proposed controls are solution architecture — they are not explicit requirements of the case.'