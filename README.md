# 🌍 PlanYatri — Premium AI-Powered MERN Travel Platform

**PlanYatri** is a luxury travel planning web application built on the **MERN Stack** (MongoDB, Express, React + Vite, Node.js), featuring real-time interactive vector maps, AI travel recommendations, luxury dark/light design system, emergency SOS response system, and real-time travel management.

---

## 🏗️ Repository Architecture

The project is organized into a clean monorepo structure:

```text
PlanYatri/
├── frontend/             # Vite + React 18, Tailwind CSS, Redux Toolkit, Framer Motion
│   ├── src/
│   │   ├── components/   # Modular UI components & interactive maps
│   │   ├── context/      # Auth, Theme, Favorites, Toast, Storage contexts
│   │   ├── pages/        # Dashboard, Trips, Destinations, Emergency, etc.
│   │   ├── services/     # API Axios client & place image service
│   │   ├── store/        # Redux Toolkit slices (auth, trips, emergency)
│   │   └── index.css     # Luxury global styling tokens
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/              # Node.js + Express REST API Server
│   ├── controllers/      # Auth, Trip, Destination, Emergency controllers
│   ├── middleware/       # JWT Authentication & Error Handlers
│   ├── routes/           # Express API Router endpoints
│   ├── server.js         # API Server entry point
│   └── package.json
└── README.md             # Platform Documentation
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0+
- **npm**: v9.0.0+

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*Server runs on `http://localhost:5000`*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Application runs on `http://localhost:5173`*

---

## ✨ Core Features & Pages

- 🏔️ **Interactive Destination Explorer**: Filter 120+ destinations by region, budget, & travel style.
- ✈️ **Smart Trip Planner**: Full itinerary builder with day-by-day activity tracking & budget breakdown.
- 🆘 **Emergency Rescue SOS**: Real-time GPS coordinate broadcasting, Audio Siren, & nearest medical facilities.
- 🎨 **Luxury Dark/Light Mode**: Bespoke gold/charcoal aesthetics with Framer Motion animations.
- 🔐 **Authentication**: JWT authentication with demo account quick login.
