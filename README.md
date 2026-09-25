# ☕ MochaTrade — Hybrid Infrastructure Prototype

> **Own the Risk. Rent the Plumbing.**

[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8.svg)](https://tailwindcss.com)

MochaTrade is a self-custodial, mobile-first perpetual futures trading platform designed for non-US retail traders — India-first, with UPI deposits, INR settlement, and no US brokerage requirement. 

This repository is an interactive, local prototype built to demonstrate our core strategic thesis: **a live map of every system we build vs. rent, a real trade routing simulator, and an industrial vendor failure simulator.** The interface is organized as a control center for evaluating ownership, partner risk, failure behavior, and the resulting architecture.

---

## 🎯 Executive Summary

Every early-stage trading platform faces an infrastructure dilemma:

| Strategy | Speed to Market | Capital Required | System Resilience & Risk |
| :--- | :--- | :--- | :--- |
| **🏗️ Build-All** | ❌ 12–18 Months | ❌ ₹15–20 Cr | 🛡️ High internal control, high overhead |
| **📦 Rent-All** | ⚡ 1–2 Months | 💰 Low initial capital | ⚠️ Zero resilience — 1 vendor outage destroys user trust |
| **⚡ MochaTrade Hybrid** | 🚀 **3 Months to Controlled Alpha** | 💎 **Fraction of capital** | 🔒 **Max Resilience** (Adapter Bus isolates core risk) |

---

## 🏛️ Infrastructure Architecture Breakdown

MochaTrade's infrastructure is divided into **three strategic tiers**:

### 1. 🟠 Core Tier (`BUILD` — MochaTrade Code)
- 🛡️ **Risk & Liquidation Engine**: Real-time margin checking, auto-deleveraging, and maintenance margin liquidation logic.
- 🔐 **Self-Custodial Wallet Vault Contracts**: Smart contracts managing user deposits & positions without third-party asset control.
- ⚡ **Order Matching Engine**: Low-latency off-chain order book & matcher.
- 📱 **Mobile App & API Gateway**: High-throughput gateway serving iOS & Android clients.

### 2. ⚡ Isolation Tier (`ADAPTER LAYER BUS` — MochaTrade Isolation Engine)
- 🔌 **Central Adapter Layer**: A custom code wrapper sitting between core logic and external vendor APIs.
- 🔁 **Circuit Breakers & Retries**: Automatic fallback routing (e.g. secondary oracle switching) and defensive trade blocking during vendor outages.
- 📑 **Vendor Abstraction**: Enables zero-downtime vendor swaps (e.g. switching KYC providers or payment processors) without touching core risk code.

### 3. 🔵 Partner Tier (`RENTED` — Commodity Plumbing)
- 🆔 **KYC / AML Stack**: Regulated identity checks & watchlist screening.
- 📈 **Market Data Oracles**: Dual price feeds (Primary Feed A + Backup Feed B).
- 💳 **Payment Rails**: Fiat on/off ramps (UPI for INR, USDC rails).
- ☁️ **Cloud Infrastructure**: Scalable container hosting & CDN distribution.

---

## 💥 Vendor Failure Simulator (Star Feature)

The prototype allows users to inject real-world failures into an active trade to observe how the **Adapter Layer Bus** reacts:

- 💥 **Primary Oracle Outage**: Primary price feed drops → Adapter detects latency spike → Seamlessly switches to secondary oracle + widens liquidation buffer (`DEGRADED BUT SAFE`).
- 💥 **KYC Vendor Timeout**: Identity vendor goes offline during trade placement → Adapter halts non-verified account trade before execution (`BLOCKED — CUSTODY SAFE`).
- 💥 **Payment Rail Latency**: UPI deposit confirmation times out → Adapter queues retry protocol with transaction locking (`RETRY & QUEUED`).

---

## 🛠️ Control Center Navigation

The prototype includes a persistent sidebar and responsive mobile navigation for the complete decision workflow:
1. 🎯 **Decision Board**: Compare build, partner, and hybrid ownership choices across infrastructure components, economics, strategic value, and operating burden.
2. 🔌 **Control Architecture**: Inspect the proposed core, adapter/control layer, vendor boundaries, circuit breakers, retries, audit trail, and failover routing.
3. ⚖️ **Scoring Matrix**: Customize criteria, weights, components, and 1–5 scores. The matrix calculates weighted build/partner pressure, classifies each component as BUILD, PARTNER, or HYBRID, and explains the top decision drivers. Scenarios persist in browser local storage.
4. ⚡ **Trade Flow**: Run a timestamped trade-routing walkthrough showing each execution hop, ownership boundary, control check, and final settlement state.
5. 💥 **Failure Lab**: Inject KYC timeout, oracle outage, and payment-rail latency scenarios. Observe retries, blocked trades, protected funds, audit creation, fallback behavior, and alternate confidence-failure paths.
6. 🛡️ **Ownership Matrix**: Review who owns each capability, where partner dependencies sit, and which controls remain with MochaTrade.
7. 📊 **Partner Scorecard**: Run a repeatable diligence review across regulatory coverage, security, reliability, SLA, incident response, auditability, portability, integration quality, switching cost, geographic fit, pricing, and continuity.
8. 🧪 **Scenario Lab**: Adjust operating assumptions and compare build-all, rent-all, and hybrid strategies across speed, capital, resilience, and control.
9. 🏛️ **Final Architecture**: Review the selected target state by tier, including the build core, adapter layer, partner plumbing, and explicit ownership boundaries.
10. 📍 **Roadmap**: Explore the 12-month delivery sequence from controlled alpha through paper trading, controlled beta, and scale-the-moat decision gates.

The visual language uses orange for systems MochaTrade builds, blue for rented partner capabilities, green for hybrid controls owned through the adapter layer, and clear red for failed or blocked dependencies. Architecture panels and event logs use light surfaces for readability, while the sidebar uses display and sans-serif typography for faster scanning.

## 🧭 Prototype Capabilities

The control center is designed as an interactive diligence and architecture exercise rather than a production trading application:

- **Editable decision model**: Add, rename, remove, and reweight scoring criteria and components in the Scoring Matrix.
- **Transparent reasoning**: Every matrix classification exposes the weighted pressures and leading criteria behind the recommendation.
- **Failure-safe simulations**: Failure scenarios show what is blocked, what remains protected, and how retry or failover controls respond.
- **Vendor swap walkthrough**: The Control Architecture view demonstrates a vendor failure and replacement without recompiling core logic.
- **Architecture traceability**: Build, partner, and hybrid decisions are repeated across the map, matrix, scorecard, ownership view, final architecture, and roadmap.
- **Responsive navigation**: The persistent desktop sidebar becomes a horizontal mobile navigation bar on smaller screens.
- **Local-only prototype state**: Interactive scoring changes are stored in the browser; there is no backend, authentication, custody, live market data, or real-money execution.

---

## 💻 Local Development & Build

### Prerequisites
- Node.js `18.x` or higher
- npm `9.x` or higher

### Quickstart Commands

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production & preview
npm run build
npm run preview
```

---

## 📹 Demo & Deployment

- 🌐 **Live Web Demo**: `https://<your-vercel-deployment>.vercel.app`
- 🎬 **Demo Video**: Record the Decision Board, Scoring Matrix, Control Architecture vendor swap, Trade Flow, and Failure Lab walkthroughs, then save as `public/demo-video.mp4`.
- 📐 **Architecture Diagram**: Static version optional at `public/architecture.png`.

---

## 📄 License

Distributed under the **MIT License**. Created for **YC S26** application prototype.
