/**
 * supabaseService.js — PlanYatri Unified Supabase Data Layer
 *
 * All DB reads/writes go through here. Components never call supabase directly
 * (except auth, which stays in AuthContext).
 */

import { supabase } from './supabaseClient'
import { compressImage } from '../utils/imageCompressor'

// ─────────────────────────────────────────────────────────────────────
// PROFILES
// ─────────────────────────────────────────────────────────────────────
export const profileService = {
  /** Fetch full profile for a user */
  async get(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
    return data
  },

  /** Upsert profile (used after OAuth or sign-up) */
  async upsert(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() })
      .select()
      .single()
    if (error) throw error
    return data
  },

  /** Upload avatar to storage and update profile (auto-compressed to WebP) */
  async uploadAvatar(userId, rawFile) {
    const file = await compressImage(rawFile, { maxWidth: 512, maxHeight: 512, quality: 0.85 })
    const ext = file.name.split('.').pop()
    const path = `${userId}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('profile-avatars')
      .upload(path, file, { upsert: true, contentType: file.type })
    if (uploadError) throw uploadError

    const { data: urlData } = supabase.storage
      .from('profile-avatars')
      .getPublicUrl(path)

    await profileService.upsert(userId, { avatar_url: urlData.publicUrl })
    return urlData.publicUrl
  },

  /** Fetch registered community profiles */
  async getAllProfiles(limit = 30) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(limit)
      if (error) return []
      return data || []
    } catch {
      return []
    }
  },
}

// ─────────────────────────────────────────────────────────────────────
// TRIPS
// ─────────────────────────────────────────────────────────────────────
export const tripService = {
  /** Fetch all trips for current user (own + member of) */
  async getAll(userId) {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        trip_members!inner(user_id, role)
      `)
      .or(`user_id.eq.${userId},trip_members.user_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (error) {
      // Fallback: just own trips
      const { data: ownData, error: ownError } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (ownError) throw ownError
      return ownData || []
    }

    // Deduplicate
    const seen = new Set()
    return (data || []).filter(t => {
      if (seen.has(t.id)) return false
      seen.add(t.id)
      return true
    })
  },

  /** Fetch single trip with all nested data */
  async getById(tripId) {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        trip_members(user_id, role, profiles(full_name, avatar_url)),
        itinerary_days(*, activities(*))
      `)
      .eq('id', tripId)
      .single()
    if (error) throw error
    return data
  },

  /** Create a new trip */
  async create(userId, tripData) {
    const { data, error } = await supabase
      .from('trips')
      .insert({
        user_id: userId,
        title: tripData.dest || tripData.title,
        destination: tripData.dest || tripData.destination,
        subtitle: tripData.subtitle || null,
        start_date: tripData.startDate || null,
        end_date: tripData.endDate || null,
        days: tripData.days || 1,
        status: tripData.status || 'Upcoming',
        budget_inr: tripData.budgetINR || 0,
        cover_image_url: tripData.img || null,
        notes: tripData.notes || null,
      })
      .select()
      .single()
    if (error) throw error
    return data
  },

  /** Update a trip */
  async update(tripId, updates) {
    const payload = {}
    if (updates.dest || updates.title)   payload.title = updates.dest || updates.title
    if (updates.destination)             payload.destination = updates.destination
    if (updates.subtitle !== undefined)  payload.subtitle = updates.subtitle
    if (updates.status)                  payload.status = updates.status
    if (updates.budgetINR !== undefined) payload.budget_inr = updates.budgetINR
    if (updates.progress !== undefined)  payload.progress = updates.progress
    if (updates.notes !== undefined)     payload.notes = updates.notes
    if (updates.img)                     payload.cover_image_url = updates.img
    if (updates.is_public !== undefined) payload.is_public = updates.is_public

    const { data, error } = await supabase
      .from('trips')
      .update(payload)
      .eq('id', tripId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  /** Delete a trip */
  async delete(tripId) {
    const { error } = await supabase.from('trips').delete().eq('id', tripId)
    if (error) throw error
    return tripId
  },

  /** Upload trip cover image (auto-compressed to high-def WebP) */
  async uploadCover(tripId, rawFile) {
    const file = await compressImage(rawFile, { maxWidth: 1600, maxHeight: 900, quality: 0.84 })
    const ext = file.name.split('.').pop()
    const path = `${tripId}/cover.${ext}`
    const { error } = await supabase.storage
      .from('trip-covers')
      .upload(path, file, { upsert: true, contentType: file.type })
    if (error) throw error
    const { data } = supabase.storage.from('trip-covers').getPublicUrl(path)
    await tripService.update(tripId, { img: data.publicUrl })
    return data.publicUrl
  },

  /** Subscribe to realtime trip changes for a user */
  subscribeToUserTrips(userId, callback) {
    return supabase
      .channel(`trips:user:${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'trips',
        filter: `user_id=eq.${userId}`,
      }, callback)
      .subscribe()
  },

  /** Subscribe to realtime changes on a specific trip (collaboration) */
  subscribeToTrip(tripId, callback) {
    return supabase
      .channel(`trip:${tripId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'activities',
        filter: `trip_id=eq.${tripId}`,
      }, payload => callback('activity', payload))
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'itinerary_days',
        filter: `trip_id=eq.${tripId}`,
      }, payload => callback('day', payload))
      .subscribe()
  },
}

// ─────────────────────────────────────────────────────────────────────
// ITINERARY DAYS
// ─────────────────────────────────────────────────────────────────────
export const itineraryService = {
  async getDaysForTrip(tripId) {
    const { data, error } = await supabase
      .from('itinerary_days')
      .select('*, activities(*)')
      .eq('trip_id', tripId)
      .order('day_number', { ascending: true })
    if (error) throw error
    return data || []
  },

  async createDay(tripId, dayData) {
    const { data, error } = await supabase
      .from('itinerary_days')
      .insert({ trip_id: tripId, ...dayData })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateDay(dayId, updates) {
    const { data, error } = await supabase
      .from('itinerary_days')
      .update(updates)
      .eq('id', dayId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteDay(dayId) {
    const { error } = await supabase.from('itinerary_days').delete().eq('id', dayId)
    if (error) throw error
  },
}

// ─────────────────────────────────────────────────────────────────────
// ACTIVITIES
// ─────────────────────────────────────────────────────────────────────
export const activityService = {
  async create(dayId, tripId, activityData) {
    const { data, error } = await supabase
      .from('activities')
      .insert({
        day_id: dayId,
        trip_id: tripId,
        name: activityData.name,
        time: activityData.time || null,
        category: activityData.category || 'Sightseeing',
        cost_inr: activityData.costINR || 0,
        description: activityData.desc || null,
        duration: activityData.duration || null,
        status: activityData.status || 'planned',
      })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(activityId, updates) {
    const { data, error } = await supabase
      .from('activities')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', activityId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async markComplete(activityId) {
    return activityService.update(activityId, { status: 'completed' })
  },

  async delete(activityId) {
    const { error } = await supabase.from('activities').delete().eq('id', activityId)
    if (error) throw error
  },
}

// ─────────────────────────────────────────────────────────────────────
// BOOKINGS
// ─────────────────────────────────────────────────────────────────────
export const bookingService = {
  async getAll(userId) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, trips(title, destination)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async getForTrip(tripId) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('trip_id', tripId)
      .order('check_in', { ascending: true })
    if (error) throw error
    return data || []
  },

  async create(userId, bookingData) {
    const { data, error } = await supabase
      .from('bookings')
      .insert({ user_id: userId, ...bookingData })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(bookingId, updates) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', bookingId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async uploadDocument(userId, bookingId, file) {
    const path = `${userId}/${bookingId}/${file.name}`
    const { error } = await supabase.storage
      .from('booking-documents')
      .upload(path, file, { upsert: true })
    if (error) throw error
    const { data } = supabase.storage.from('booking-documents').getPublicUrl(path)
    return data.publicUrl
  },

  async delete(bookingId) {
    const { error } = await supabase.from('bookings').delete().eq('id', bookingId)
    if (error) throw error
  },
}

// ─────────────────────────────────────────────────────────────────────
// MESSAGES (Realtime)
// ─────────────────────────────────────────────────────────────────────
export const messageService = {
  /** Load message history for a room */
  async getForRoom(roomId, limit = 50) {
    const { data, error } = await supabase
      .from('messages')
      .select('*, profiles(full_name, avatar_url)')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(limit)
    if (error) throw error
    return data || []
  },

  /** Send a message */
  async send({ roomId, userId, senderName, text, senderType = 'user', contactId = null }) {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        room_id: roomId,
        user_id: userId || null,
        sender_name: senderName,
        sender_type: senderType,
        text,
        message_type: 'text',
        contact_id: contactId ? String(contactId) : null,
      })
      .select()
      .single()
    if (error) throw error
    return data
  },

  /** Subscribe to realtime messages in a room */
  subscribe(roomId, onMessage) {
    return supabase
      .channel(`messages:${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`,
      }, payload => onMessage(payload.new))
      .subscribe()
  },

  unsubscribe(channel) {
    if (channel) supabase.removeChannel(channel)
  },
}

// ─────────────────────────────────────────────────────────────────────
// GROUP EXPENSES
// ─────────────────────────────────────────────────────────────────────
export const expenseService = {
  /** Get all expenses for a trip with splits */
  async getForTrip(tripId) {
    const { data, error } = await supabase
      .from('group_expenses')
      .select(`
        *,
        profiles:paid_by(full_name, avatar_url),
        expense_splits(*)
      `)
      .eq('trip_id', tripId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  /** Add an expense and auto-create splits */
  async add(tripId, paidByUserId, { description, amount_inr, split_type = 'equal', category = 'General', members = [] }) {
    // 1. Insert expense
    const { data: expense, error: expError } = await supabase
      .from('group_expenses')
      .insert({
        trip_id: tripId,
        paid_by: paidByUserId,
        description,
        amount_inr,
        split_type,
        category,
      })
      .select()
      .single()
    if (expError) throw expError

    // 2. Create splits
    if (members.length > 0) {
      const perPerson = split_type === 'equal'
        ? Number((amount_inr / members.length).toFixed(2))
        : 0

      const splits = members.map(m => ({
        expense_id: expense.id,
        trip_id: tripId,
        user_id: m.userId || null,
        member_name: m.name,
        amount_owed: m.amount !== undefined ? m.amount : perPerson,
        settled: false,
      }))

      const { error: splitError } = await supabase.from('expense_splits').insert(splits)
      if (splitError) console.warn('Split insert error:', splitError.message)
    }

    return expense
  },

  /** Mark a split as settled */
  async settle(splitId) {
    const { data, error } = await supabase
      .from('expense_splits')
      .update({ settled: true, settled_at: new Date().toISOString() })
      .eq('id', splitId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  /** Delete an expense (cascades to splits) */
  async delete(expenseId) {
    const { error } = await supabase.from('group_expenses').delete().eq('id', expenseId)
    if (error) throw error
  },

  /** Get simplified balances for a trip */
  async getBalances(tripId) {
    const { data, error } = await supabase.rpc('get_trip_balances', { p_trip_id: tripId })
    if (error) {
      // Manual fallback if RPC not yet deployed
      const expenses = await expenseService.getForTrip(tripId)
      const balances = {}
      expenses.forEach(exp => {
        const paidName = exp.profiles?.full_name || 'Unknown'
        balances[paidName] = (balances[paidName] || 0) + Number(exp.amount_inr)
        ;(exp.expense_splits || []).forEach(split => {
          balances[split.member_name] = (balances[split.member_name] || 0) - Number(split.amount_owed)
        })
      })
      return Object.entries(balances).map(([member_name, net_balance]) => ({ member_name, net_balance }))
    }
    return data || []
  },

  /** Subscribe to realtime expense changes for a trip */
  subscribe(tripId, callback) {
    return supabase
      .channel(`expenses:${tripId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'group_expenses',
        filter: `trip_id=eq.${tripId}`,
      }, callback)
      .subscribe()
  },
}

// ─────────────────────────────────────────────────────────────────────
// EMERGENCY CONTACTS
// ─────────────────────────────────────────────────────────────────────
export const emergencyService = {
  async getAll(userId) {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', userId)
      .order('is_primary', { ascending: false })
    if (error) throw error
    return data || []
  },

  async add(userId, contact) {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .insert({ user_id: userId, ...contact })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(contactId, updates) {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .update(updates)
      .eq('id', contactId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(contactId) {
    const { error } = await supabase.from('emergency_contacts').delete().eq('id', contactId)
    if (error) throw error
  },
}

// ─────────────────────────────────────────────────────────────────────
// TRIP MEMBERS / COLLABORATION
// ─────────────────────────────────────────────────────────────────────
export const memberService = {
  async getMembers(tripId) {
    const { data, error } = await supabase
      .from('trip_members')
      .select('*, profiles(full_name, avatar_url, email)')
      .eq('trip_id', tripId)
    if (error) throw error
    return data || []
  },

  /** Invite user by email (they must already be registered) */
  async invite(tripId, email, role = 'viewer') {
    // 1. Look up the user's profile by email
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()
    if (userError) throw new Error('User not found. They must sign up first.')

    // 2. Add them as a member
    const { data, error } = await supabase
      .from('trip_members')
      .insert({ trip_id: tripId, user_id: userData.id, role })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async remove(tripId, userId) {
    const { error } = await supabase
      .from('trip_members')
      .delete()
      .eq('trip_id', tripId)
      .eq('user_id', userId)
    if (error) throw error
  },
}

// ─────────────────────────────────────────────────────────────────────
// DEMO SEED (for new users — pre-fills a Bali trip)
// ─────────────────────────────────────────────────────────────────────
export async function seedDemoTrip(userId) {
  try {
    // Check if user already has trips
    const { data: existing } = await supabase
      .from('trips')
      .select('id')
      .eq('user_id', userId)
      .limit(1)

    if (existing && existing.length > 0) return null // already seeded

    const trip = await tripService.create(userId, {
      dest: 'Bali, Indonesia',
      destination: 'Bali, Indonesia',
      subtitle: 'Ubud → Seminyak → Nusa Penida',
      days: 10,
      status: 'Upcoming',
      budgetINR: 75000,
      img: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=500&q=80&auto=format&fit=crop',
      notes: 'Dream trip! Book villa in Ubud, check visa.',
    })

    // Seed itinerary day 1
    const { data: day1 } = await supabase
      .from('itinerary_days')
      .insert({ trip_id: trip.id, day_number: 1, date: null, city: 'Ubud', theme: 'Arrival & Jungle Vibes' })
      .select()
      .single()

    if (day1) {
      await supabase.from('activities').insert([
        { day_id: day1.id, trip_id: trip.id, name: 'Tegallalang Rice Terraces', time: '09:00 AM', category: 'Sightseeing', cost_inr: 800, duration: '2h', status: 'planned' },
        { day_id: day1.id, trip_id: trip.id, name: 'Traditional Warung Lunch', time: '01:00 PM', category: 'Food', cost_inr: 600, duration: '1h', status: 'planned' },
        { day_id: day1.id, trip_id: trip.id, name: 'Kecak Fire Dance Show', time: '06:00 PM', category: 'Culture', cost_inr: 1200, duration: '1.5h', status: 'planned' },
      ])
    }

    return trip
  } catch (e) {
    console.warn('Demo seed skipped:', e.message)
    return null
  }
}

// ─────────────────────────────────────────────────────────────────────
// GENERIC REALTIME CHANNEL MANAGER
// ─────────────────────────────────────────────────────────────────────
export const realtimeManager = {
  channels: new Map(),

  subscribe(key, channel) {
    this.channels.set(key, channel)
  },

  unsubscribe(key) {
    const ch = this.channels.get(key)
    if (ch) {
      supabase.removeChannel(ch)
      this.channels.delete(key)
    }
  },

  unsubscribeAll() {
    this.channels.forEach((ch) => supabase.removeChannel(ch))
    this.channels.clear()
  },
}

// ─────────────────────────────────────────────────────────────────────
// TRIP INVITES (QR-based group joining)
// ─────────────────────────────────────────────────────────────────────
export const inviteService = {
  /** Create a new invite link for a trip */
  async create(tripId, userId, { role = 'viewer', maxUses = 10, expiresInDays = 7 } = {}) {
    const expiresAt = new Date(Date.now() + expiresInDays * 86400000).toISOString()
    const { data, error } = await supabase
      .from('trip_invites')
      .insert({
        trip_id: tripId,
        created_by: userId,
        role,
        max_uses: maxUses,
        expires_at: expiresAt,
      })
      .select()
      .single()
    if (error) throw error
    return data
  },

  /** Get invite info by token (public — no auth needed to preview) */
  async getByToken(token) {
    const { data, error } = await supabase
      .from('trip_invites')
      .select(`
        *,
        trips(id, title, destination, cover_image_url, days, status),
        profiles:created_by(full_name, avatar_url)
      `)
      .eq('token', token)
      .eq('is_active', true)
      .single()
    if (error) throw error
    return data
  },

  /** List all active invites for a trip */
  async listForTrip(tripId) {
    const { data, error } = await supabase
      .from('trip_invites')
      .select('*')
      .eq('trip_id', tripId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  /** Accept invite via stored function (handles membership insertion) */
  async accept(token) {
    const { data, error } = await supabase.rpc('accept_trip_invite', { p_token: token })
    if (error) throw error
    return data
  },

  /** Revoke / deactivate an invite */
  async revoke(inviteId) {
    const { error } = await supabase
      .from('trip_invites')
      .update({ is_active: false })
      .eq('id', inviteId)
    if (error) throw error
  },

  /** Build the sharable invite URL */
  buildUrl(token) {
    return `${window.location.origin}/join/${token}`
  },
}

export default {
  profiles: profileService,
  trips: tripService,
  itinerary: itineraryService,
  activities: activityService,
  bookings: bookingService,
  messages: messageService,
  expenses: expenseService,
  emergency: emergencyService,
  members: memberService,
  invites: inviteService,
  seedDemoTrip,
  realtime: realtimeManager,
}

