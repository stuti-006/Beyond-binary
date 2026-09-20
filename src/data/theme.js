export const decisionMeta = {
  BUILD: {
    label: 'BUILD',
    color: '#e8590c',
    badgeClass: 'badge-build',
    text: 'text-build',
    border: 'border-build-border',
    dim: 'bg-build-dim',
    glow: 'shadow-glow-build',
    dot: 'bg-build shadow-[0_0_8px_#e8590c]',
  },
  PARTNER: {
    label: 'PARTNER',
    color: '#1971c2',
    badgeClass: 'badge-partner',
    text: 'text-partner',
    border: 'border-partner-border',
    dim: 'bg-partner-dim',
    glow: 'shadow-glow-partner',
    dot: 'bg-partner shadow-[0_0_8px_#1971c2]',
  },
  HYBRID: {
    label: 'HYBRID',
    color: '#2f9e44',
    badgeClass: 'badge-hybrid',
    text: 'text-hybrid',
    border: 'border-hybrid-border',
    dim: 'bg-hybrid-dim',
    glow: 'shadow-glow-hybrid',
    dot: 'bg-hybrid shadow-[0_0_8px_#2f9e44]',
  },
  CONTROLLED: {
    label: 'PARTNER / HYBRID CONTROL',
    color: '#2f9e44',
    badgeClass: 'badge-hybrid',
    text: 'text-hybrid',
    border: 'border-hybrid-border',
    dim: 'bg-hybrid-dim',
    glow: 'shadow-glow-hybrid',
    dot: 'bg-hybrid shadow-[0_0_8px_#2f9e44]',
  },
}

export const tagMeta = {
  VENDOR: {
    text: 'text-partner',
    chip: 'bg-partner-dim border-partner-border text-partner shadow-[0_0_8px_rgba(25,113,194,0.2)]',
    dot: 'bg-partner',
  },
  CORE: {
    text: 'text-build',
    chip: 'bg-build-dim border-build-border text-build shadow-[0_0_8px_rgba(232,89,12,0.2)]',
    dot: 'bg-build',
  },
  CONTROL: {
    text: 'text-hybrid',
    chip: 'bg-hybrid-dim border-hybrid-border text-hybrid shadow-[0_0_8px_rgba(47,158,68,0.2)]',
    dot: 'bg-hybrid',
  },
}

export const levelColors = {
  LOW: 'text-hybrid bg-hybrid-dim border-hybrid-border',
  MEDIUM: 'text-amber-300 bg-amber-950/40 border-amber-500/50',
  HIGH: 'text-build bg-build-dim border-build-border',
}

export const econLabels = {
  upfront: 'UPFRONT COST',
  ongoing: 'ONGOING COST',
  engineering: 'ENGINEERING BURDEN',
  compliance: 'COMPLIANCE BURDEN',
  switching: 'SWITCHING COST',
  strategicValue: 'STRATEGIC VALUE',
}