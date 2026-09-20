export const scorecardDimensions = [
  { name: 'Regulatory coverage', prompt: 'Does the vendor hold the licenses / registrations our market needs?' },
  { name: 'Security', prompt: 'What certifications, audits, and security posture do they evidence?' },
  { name: 'Reliability', prompt: 'Historical uptime and quality of operations under load.' },
  { name: 'SLA', prompt: 'What does the contract actually guarantee?' },
  { name: 'Incident response', prompt: 'How fast and how transparently do they respond and disclose?' },
  { name: 'Auditability', prompt: 'Can we inspect logs, processes, and decisions?' },
  { name: 'Data portability', prompt: 'Can we take our data elsewhere if we leave?' },
  { name: 'Integration quality', prompt: 'How clean is the API, sandbox, and documentation?' },
  { name: 'Switching cost', prompt: 'What does it cost in money and time to swap them out?' },
  { name: 'Geographic / regulatory fit', prompt: 'Do they operate where we operate, with the right local arrangements?' },
  { name: 'Pricing model', prompt: 'Is pricing predictable at launch and at 10x volume?' },
  { name: 'Business continuity', prompt: 'Do they survive their own failure — and ours?' },
]

export const redFlags = [
  'Weak SLA',
  'No audit rights',
  'Poor data portability',
  'High switching cost',
  'Weak incident disclosure',
  'Single-region dependency',
  'Unclear breach responsibility',
]

export const scorecardNote =
  'No rankings, no scores — this is a diligence exercise, run at onboarding and re-run before every renewal.'