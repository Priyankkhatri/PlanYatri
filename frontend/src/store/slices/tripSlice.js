/**
 * tripSlice.js — Redux slice for trips
 * Reads/writes go to Supabase via supabaseService.
 * Falls back to Express API if Supabase is unavailable.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { tripService, seedDemoTrip } from '../../services/supabaseService'
import api from '../../services/api'

// ── Default trips for demo / unauthenticated users ──
const DEFAULT_TRIPS = [
  {
    id: 'trip_demo_1', _id: 'trip_demo_1',
    title: 'Bali, Indonesia', dest: 'Bali, Indonesia',
    destination: 'Bali, Indonesia', subtitle: 'Ubud → Seminyak → Nusa Penida',
    status: 'Upcoming', start_date: '2024-05-20', end_date: '2024-06-02',
    days: 12, budget_inr: 75000, spent_inr: 38500, budgetINR: 75000,
    progress: 70, budget: '₹75,000', spent: '₹38,500',
    cover_image_url: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&h=400&q=80&auto=format&fit=crop',
    img: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&h=400&q=80&auto=format&fit=crop',
    activities: ['Temple Tour', 'Surfing', 'Rice Terraces'], members: 2,
    notes: 'Book villa in Ubud. Check visa requirements.',
  },
  {
    id: 'trip_demo_2', _id: 'trip_demo_2',
    title: 'Santorini, Greece', dest: 'Santorini, Greece',
    destination: 'Santorini, Greece', subtitle: 'Fira → Oia → Caldera',
    status: 'Upcoming', days: 10, budget_inr: 95000, spent_inr: 28000,
    budgetINR: 95000, progress: 30, budget: '₹95,000', spent: '₹28,000',
    cover_image_url: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&h=400&q=80&auto=format&fit=crop',
    img: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&h=400&q=80&auto=format&fit=crop',
    activities: ['Caldera View', 'Wine Tasting', 'Sailing'], members: 2,
    notes: '',
  },
  {
    id: 'trip_demo_3', _id: 'trip_demo_3',
    title: 'Kyoto, Japan', dest: 'Kyoto, Japan',
    destination: 'Kyoto, Japan', subtitle: 'Arashiyama → Gion → Fushimi Inari',
    status: 'Wishlist', days: 9, budget_inr: 130000, spent_inr: 0,
    budgetINR: 130000, progress: 10, budget: '₹1,30,000', spent: '₹0',
    cover_image_url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&h=400&q=80&auto=format&fit=crop',
    img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&h=400&q=80&auto=format&fit=crop',
    activities: ['Geisha District', 'Tea Ceremony', 'Bamboo Grove'], members: 1,
    notes: 'Cherry blossom season is April.',
  },
]

/** Normalize a Supabase trip row to match frontend shape */
function normalize(t) {
  return {
    ...t,
    _id: t.id,
    dest: t.title || t.destination,
    img: t.cover_image_url || t.img,
    budgetINR: t.budget_inr || t.budgetINR || 0,
    budget: `₹${Number(t.budget_inr || 0).toLocaleString('en-IN')}`,
    spent: `₹${Number(t.spent_inr || 0).toLocaleString('en-IN')}`,
    members: t.trip_members?.length || 1,
  }
}

// ── Async Thunks ──

export const fetchTrips = createAsyncThunk('trips/fetchTrips', async (_, { getState }) => {
  const userId = getState().auth?.userInfo?.id
  const isDemo = getState().auth?.userInfo?.isDemo

  if (!userId || isDemo) {
    // Try Express API fallback
    try {
      const { data } = await api.get('/trips')
      return data && data.length > 0 ? data : DEFAULT_TRIPS
    } catch {
      return DEFAULT_TRIPS
    }
  }

  try {
    const rows = await tripService.getAll(userId)
    if (!rows || rows.length === 0) {
      // Seed demo trip for brand-new users
      await seedDemoTrip(userId)
      const seededRows = await tripService.getAll(userId)
      return seededRows?.length > 0 ? seededRows.map(normalize) : DEFAULT_TRIPS
    }
    return rows.map(normalize)
  } catch (e) {
    console.warn('Supabase trips fetch failed, using API fallback:', e.message)
    try {
      const { data } = await api.get('/trips')
      return data && data.length > 0 ? data : DEFAULT_TRIPS
    } catch {
      return DEFAULT_TRIPS
    }
  }
})

export const createTrip = createAsyncThunk('trips/createTrip', async (tripData, { getState, rejectWithValue }) => {
  const userId = getState().auth?.userInfo?.id
  const isDemo = getState().auth?.userInfo?.isDemo

  if (!userId || isDemo) {
    // Local-only for demo
    const localTrip = {
      ...tripData,
      id: `trip_local_${Date.now()}`,
      _id: `trip_local_${Date.now()}`,
      dest: tripData.dest || tripData.destination || tripData.title,
      img: tripData.img || tripData.cover_image_url,
      budgetINR: tripData.budgetINR || 0,
      budget: `₹${Number(tripData.budgetINR || 0).toLocaleString('en-IN')}`,
      spent: '₹0',
      spent_inr: 0,
      progress: 0,
      status: tripData.status || 'Upcoming',
      created_at: new Date().toISOString(),
    }
    return localTrip
  }

  try {
    const row = await tripService.create(userId, tripData)
    return normalize(row)
  } catch (e) {
    // Fallback to Express
    try {
      const { data } = await api.post('/trips', tripData)
      return data
    } catch (apiErr) {
      return rejectWithValue(apiErr.response?.data?.message || apiErr.message)
    }
  }
})

export const updateTrip = createAsyncThunk('trips/updateTrip', async ({ id, tripData }, { getState, rejectWithValue }) => {
  const isDemo = getState().auth?.userInfo?.isDemo

  if (isDemo || id?.startsWith('trip_demo_') || id?.startsWith('journey-')) {
    return { ...tripData, id, _id: id }
  }

  try {
    const row = await tripService.update(id, tripData)
    return normalize(row)
  } catch (e) {
    try {
      const { data } = await api.put(`/trips/${id}`, tripData)
      return data
    } catch (apiErr) {
      return rejectWithValue(apiErr.response?.data?.message || apiErr.message)
    }
  }
})

export const deleteTrip = createAsyncThunk('trips/deleteTrip', async (id, { getState, rejectWithValue }) => {
  const isDemo = getState().auth?.userInfo?.isDemo

  if (isDemo || id?.startsWith('trip_demo_') || id?.startsWith('journey-')) {
    return id
  }

  try {
    await tripService.delete(id)
    return id
  } catch (e) {
    try {
      await api.delete(`/trips/${id}`)
      return id
    } catch (apiErr) {
      return rejectWithValue(apiErr.response?.data?.message || apiErr.message)
    }
  }
})

// ── Slice ──
const tripSlice = createSlice({
  name: 'trips',
  initialState: {
    trips: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Allow local optimistic updates (for demo mode)
    addTripLocal(state, action) {
      state.trips.unshift(action.payload)
    },
    updateTripLocal(state, action) {
      const idx = state.trips.findIndex(t => t.id === action.payload.id || t._id === action.payload._id)
      if (idx !== -1) state.trips[idx] = { ...state.trips[idx], ...action.payload }
    },
    removeTripLocal(state, action) {
      state.trips = state.trips.filter(t => t.id !== action.payload && t._id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrips.pending,   s => { s.loading = true; s.error = null })
      .addCase(fetchTrips.fulfilled, (s, a) => { s.loading = false; s.trips = a.payload })
      .addCase(fetchTrips.rejected,  (s, a) => { s.loading = false; s.error = a.payload; s.trips = DEFAULT_TRIPS })

      .addCase(createTrip.pending,   s => { s.loading = true })
      .addCase(createTrip.fulfilled, (s, a) => { s.loading = false; s.trips.unshift(a.payload) })
      .addCase(createTrip.rejected,  (s, a) => { s.loading = false; s.error = a.payload })

      .addCase(updateTrip.fulfilled, (s, a) => {
        const idx = s.trips.findIndex(t => t.id === a.payload.id || t._id === a.payload._id)
        if (idx !== -1) s.trips[idx] = { ...s.trips[idx], ...a.payload }
      })
      .addCase(updateTrip.rejected, (s, a) => { s.error = a.payload })

      .addCase(deleteTrip.fulfilled, (s, a) => {
        s.trips = s.trips.filter(t => t.id !== a.payload && t._id !== a.payload)
      })
      .addCase(deleteTrip.rejected, (s, a) => { s.error = a.payload })
  },
})

export const { addTripLocal, updateTripLocal, removeTripLocal } = tripSlice.actions
export default tripSlice.reducer
