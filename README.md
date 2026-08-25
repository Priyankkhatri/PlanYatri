# 🏔️ PlanYatri — Developer Quickstart Guide

Welcome to **PlanYatri**, the luxury travel orchestration platform built with a clean **Frontend & Backend** full-stack structure.

---

## 📂 Project Architecture

```text
PlanYatri/
├── frontend/                     👉 Next.js 16 App Router (React 19, TypeScript, Tailwind)
│   ├── src/app/                  👉 App Router File-System Pages (/dashboard, /trips, /emergency, etc.)
│   ├── src/components/           👉 UI Component Library (StatCards, SOSButton, VelocityPulse, etc.)
│   ├── src/context/              👉 React Context Providers (Auth, Theme, Toast, Favorites)
│   ├── src/store/                👉 Redux Toolkit Global Store (authSlice, tripSlice, emergencySlice)
│   ├── src/types/                👉 TypeScript Interface Contracts
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                      👉 Express REST API & Gemini AI Microservice (Node.js, TypeScript)
│   ├── src/controllers/          👉 API Controllers (auth, trips, bookings, emergency, gemini)
│   ├── src/routes/               👉 Router Endpoints (/api/auth, /api/trips, /api/emergency, etc.)
│   ├── src/middleware/           👉 JWT Auth & Error Handling Middlewares
│   ├── package.json
│   └── tsconfig.json
│
├── supabase_migration.sql        👉 PostgreSQL & Supabase Database Migration Schema
├── PLANYATRI_ARCHITECTURE_FEATURES.md 👉 Architectural Diagrams & Feature Deep-Dive
└── README.md                     👉 Root Developer Documentation
```

---

## 🚀 How to Run the Project

### 1. Run Frontend App (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Server starts at **http://localhost:3000**.

### 2. Run Backend API (Express Node.js)
```bash
cd backend
npm install
npm run dev
```
Server starts at **http://localhost:5000**.

---

*Built with ❤️ by PlanYatri Engineering Team.*
