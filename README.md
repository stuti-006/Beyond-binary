# ☕ MochaTrade — Hybrid Infrastructure Prototype

> **Own the Risk. Rent the Plumbing.**

[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8.svg)](https://tailwindcss.com)

MochaTrade is a self-custodial, mobile-first perpetual futures trading platform designed for non-US retail traders — India-first, with UPI deposits, INR settlement, and no US brokerage requirement. 

This repository is an interactive, local prototype built to demonstrate our core strategic thesis: **a live map of every system we build vs. rent, a real trade routing simulator, and an industrial vendor failure simulator.**

---

## 🎯 Executive Summary

Every early-stage trading platform faces an infrastructure dilemma:

| Strategy | Speed to Market | Capital Required | System Resilience & Risk |
| :--- | :--- | :--- | :--- |
| **🏗️ Build-All** | ❌ 12–18 Months | ❌ ₹15–20 Cr | 🛡️ High internal control, high overhead |
| **📦 Rent-All** | ⚡ 1–2 Months | 💰 Low initial capital | ⚠️ Zero resilience — 1 vendor outage destroys user trust |
| **⚡ MochaTrade Hybrid** | 🚀 **16 Weeks** | 💎 **Fraction of capital** | 🔒 **Max Resilience** (Adapter Bus isolates core risk) |

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

## 🛠️ Section Navigation

The prototype includes a sticky section navigation bar for quick access across the story:
1. 🗺️ **Infra Map**: Interactive node layout with cost, build time, and SLA tooltips.
2. ⚡ **Trade Flow**: Real-time telemetry log tracing trade execution hops.
3. 💥 **Failure Sim**: Interactive fault injector demonstrating adapter resilience.
4. 📍 **Roadmap**: 16-week launch timeline & re-evaluation trigger thresholds.

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
- 🎬 **Demo Video**: Record Panel 3 (Vendor Failure Simulator) and save as `public/demo-video.mp4`.
- 📐 **Architecture Diagram**: Static version optional at `public/architecture.png`.

---

## 📄 License

Distributed under the **MIT License**. Created for **YC S26** application prototype.
