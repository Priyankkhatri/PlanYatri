# 🏔️ PlanYatri Enterprise Monorepo

Welcome to **PlanYatri**, an enterprise-grade full-stack travel orchestration platform.

## 📂 Repository Structure

```
PlanYatri/
├── apps/
│   ├── web/        # Next.js 16 App Router Frontend (React 19, TSX, Tailwind)
│   └── backend/    # Node.js Express REST API & Gemini AI Microservice (TS)
├── packages/
│   ├── types/      # Shared TypeScript contracts & interfaces
│   ├── config/     # Shared ESLint & TSConfig base definitions
│   └── database/   # Supabase SQL schemas, migrations & database seeders
├── package.json    # Monorepo workspace configuration
└── README.md
```

## 🚀 Quickstart Commands

### 1. Frontend Web App (Next.js)
```bash
cd apps/web
npm run dev
```
Runs on **http://localhost:3000**.

### 2. Backend Express API
```bash
cd apps/backend
npm run dev
```
Runs on **http://localhost:5000**.

### 3. Run Both Concurrently (Root)
```bash
npm run dev
```
