'use client';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import Sidebar from '@/components/Sidebar'
import { logout, updateProfile } from '@/store/slices/authSlice'
import { useToast } from '@/context/ToastContext'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useFavorites } from '@/context/FavoritesContext'


export default function Profile() {
  const router = useRouter();
  const dispatch = useDispatch<any>()
  const toast = useToast()
  const { userInfo } = useSelector((state: any) => state.auth)
  const { favorites, removeFavorite } = useFavorites()

  usePageTitle('Profile — Wanderlust')

  const [name, setName] = useState(userInfo?.name || 'Elena Rodriguez')
  const [quote, setQuote] = useState(
    userInfo?.bio || '"Collect moments, one boarding pass at a time."'
  )
  const [avatar, setAvatar] = useState(
    userInfo?.avatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&q=85&auto=format&fit=crop'
  )
  const [showEditModal, setShowEditModal] = useState(false)
  const [editName, setEditName] = useState(name)
  const [editQuote, setEditQuote] = useState(quote)
  const [editAvatarUrl, setEditAvatarUrl] = useState(avatar)

  const handleSaveProfile = async (e: any) => {
    e.preventDefault()
    setName(editName)
    setQuote(editQuote)
    setAvatar(editAvatarUrl)
    await dispatch(updateProfile({ name: editName, bio: editQuote, avatar: editAvatarUrl }))
    setShowEditModal(false)
    toast.success('✨ Profile updated successfully!')
  }

  const handleSignOut = () => {
    dispatch(logout())
    toast.info('Signed out successfully')
    router.push('/')
  }

  return (
    <div className="prof-page-root">
      <Sidebar />

      <main className="prof-main-content">
        <div className="prof-scroll-container">
          {/* ── 1. TOP PROFILE & STATS ROW ── */}
          <section className="prof-hero-row">
            {/* Left User Identity */}
            <div className="prof-user-card">
              <div className="prof-avatar-wrapper" onClick={() => setShowEditModal(true)}>
                <img src={avatar} alt={name} className="prof-avatar-img" />
                <button className="prof-edit-pencil-badge" title="Edit Profile">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </button>
              </div>

              <div className="prof-user-text">
                <h1 className="prof-user-name">{name}</h1>
                <p className="prof-user-quote">{quote}</p>
              </div>
            </div>

            {/* Right 4 Metric Stat Cards */}
            <div className="prof-stats-grid">
              <div className="prof-stat-box">
                <span className="prof-stat-number">24</span>
                <span className="prof-stat-lbl">TRIPS TAKEN</span>
              </div>

              <div className="prof-stat-box">
                <span className="prof-stat-number">12</span>
                <span className="prof-stat-lbl">COUNTRIES VISITED</span>
              </div>

              <div className="prof-stat-box">
                <span className="prof-stat-number">84</span>
                <span className="prof-stat-lbl">SAVED PLACES</span>
              </div>

              <div className="prof-stat-box">
                <span className="prof-stat-number">2.4k</span>
                <span className="prof-stat-lbl">MILES LOGGED</span>
              </div>
            </div>
          </section>

          {/* ── 2. TWO-COLUMN LAYOUT: BUCKET LIST + ACCOUNT SETTINGS ── */}
          <section className="prof-columns-grid">
            {/* ── LEFT COLUMN: BUCKET LIST / SAVED FAVORITES ── */}
            <div className="prof-bucket-col">
              <div className="prof-section-header">
                <h2 className="prof-section-title">Bucket List ({favorites.length})</h2>
                <button className="prof-view-all-link" onClick={() => router.push('/favorites')}>
                  View All ({favorites.length}) →
                </button>
              </div>

              {favorites.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p style={{ color: '#94A3B8', fontSize: '14px', margin: '0 0 12px' }}>Your bucket list is currently empty.</p>
                  <button onClick={() => router.push('/destinations')} style={{ padding: '8px 16px', background: '#D4A843', color: '#0C1B2A', fontWeight: 600, borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                    Explore Destinations →
                  </button>
                </div>
              ) : (
                <>
                  {/* Priority Featured Item (First Favorite) */}
                  {favorites[0] && (
                    <div
                      className="prof-priority-card"
                      onClick={() => router.push('/destinations', { state: { search: favorites[0].name.split(',')[0] } })}
                    >
                      <img
                        src={favorites[0].img}
                        alt={favorites[0].name}
                        className="prof-priority-img"
                      />
                      <div className="prof-priority-overlay" />

                      <div className="prof-priority-tag">
                        <span>TOP PRIORITY</span>
                      </div>

                      <div className="prof-priority-bottom">
                        <div>
                          <h3 className="prof-priority-title">{favorites[0].name}</h3>
                          <p className="prof-priority-location">{favorites[0].country}</p>
                        </div>

                        <div className="prof-date-pill">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span>{favorites[0].targetDate || '2026'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Remaining Mini Cards */}
                  {favorites.length > 1 && (
                    <div className="prof-bucket-duo-grid">
                      {favorites.slice(1, 5).map((item: any) => (
                        <div
                          key={item.id}
                          className="prof-mini-bucket-card"
                          onClick={() => router.push('/destinations', { state: { search: item.name.split(',')[0] } })}
                        >
                          <div className="prof-mini-img-box">
                            <img src={item.img} alt={item.name} />
                            <button
                              className="prof-mini-heart-btn"
                              title="Remove from Bucket List"
                              onClick={(e: any) => {
                                e.stopPropagation()
                                removeFavorite(item.id)
                                toast.info(`Removed ${item.name} from Bucket List`)
                              }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="#EF4444" stroke="#EF4444" strokeWidth="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                              </svg>
                            </button>
                          </div>
                          <div className="prof-mini-body">
                            <h4 className="prof-mini-title">{item.name}</h4>
                            <p className="prof-mini-sub">{item.country}</p>
                            <div className="prof-mini-meta">
                              <span className="prof-trend-dot">✦</span>
                              <span>{item.category || 'SAVED ESCAPE'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── RIGHT COLUMN: ACCOUNT SETTINGS & GO PRO ── */}
            <div className="prof-settings-col">
              <h2 className="prof-section-title">Account Settings</h2>

              <div className="prof-settings-list">
                {/* 1. Personal Info */}
                <div className="prof-setting-item" onClick={() => setShowEditModal(true)}>
                  <div className="prof-setting-icon-box">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="prof-setting-info">
                    <h4 className="prof-setting-name">Personal Information</h4>
                    <p className="prof-setting-desc">Email, phone, and name</p>
                  </div>
                  <span className="prof-setting-arrow">›</span>
                </div>

                {/* 2. Security */}
                <div className="prof-setting-item" onClick={() => router.push('/settings')}>
                  <div className="prof-setting-icon-box">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div className="prof-setting-info">
                    <h4 className="prof-setting-name">Security</h4>
                    <p className="prof-setting-desc">Password and MFA</p>
                  </div>
                  <span className="prof-setting-arrow">›</span>
                </div>

                {/* 3. Notifications */}
                <div className="prof-setting-item" onClick={() => router.push('/settings')}>
                  <div className="prof-setting-icon-box">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  </div>
                  <div className="prof-setting-info">
                    <h4 className="prof-setting-name">Notifications</h4>
                    <p className="prof-setting-desc">Preferences and alerts</p>
                  </div>
                  <span className="prof-setting-arrow">›</span>
                </div>

                {/* 4. Payment Methods */}
                <div className="prof-setting-item" onClick={() => router.push('/bookings')}>
                  <div className="prof-setting-icon-box">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                  </div>
                  <div className="prof-setting-info">
                    <h4 className="prof-setting-name">Payment Methods</h4>
                    <p className="prof-setting-desc">Saved cards and wallet</p>
                  </div>
                  <span className="prof-setting-arrow">›</span>
                </div>

                {/* 5. Sign Out */}
                <div className="prof-setting-item prof-signout-item" onClick={handleSignOut}>
                  <div className="prof-setting-icon-box red">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </div>
                  <div className="prof-setting-info">
                    <h4 className="prof-setting-name text-red">Sign Out</h4>
                    <p className="prof-setting-desc text-red-sub">End your current session</p>
                  </div>
                </div>
              </div>

              {/* Go Pro Obsidian Card */}
              <div className="prof-gopro-box">
                <div className="prof-gopro-content">
                  <h3 className="prof-gopro-title">Go Pro</h3>
                  <p className="prof-gopro-desc">
                    Unlock exclusive travel guides and priority booking for your next adventure.
                  </p>
                  <button
                    className="prof-gopro-btn"
                    onClick={() => toast.success('👑 Welcome to PlanYatri Pro Concierge Access!')}
                  >
                    <span>UPGRADE NOW</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ── EDIT PROFILE MODAL ── */}
        {showEditModal && (
          <div className="prof-modal-backdrop" onClick={() => setShowEditModal(false)}>
            <div className="prof-modal-window" onClick={(e: any) => e.stopPropagation()}>
              <div className="prof-modal-header">
                <h3 className="prof-modal-title">Edit Profile Information</h3>
                <button className="prof-modal-close" onClick={() => setShowEditModal(false)}>
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="prof-modal-form">
                <div className="prof-form-group">
                  <label className="prof-form-label">Full Name</label>
                  <input
                    type="text"
                    className="prof-form-input"
                    value={editName}
                    onChange={(e: any) => setEditName(e.target.value)}
                    required
                  />
                </div>

                <div className="prof-form-group">
                  <label className="prof-form-label">Profile Quote / Bio</label>
                  <input
                    type="text"
                    className="prof-form-input"
                    value={editQuote}
                    onChange={(e: any) => setEditQuote(e.target.value)}
                  />
                </div>

                <div className="prof-form-group">
                  <label className="prof-form-label">Avatar Image URL</label>
                  <input
                    type="url"
                    className="prof-form-input"
                    value={editAvatarUrl}
                    onChange={(e: any) => setEditAvatarUrl(e.target.value)}
                  />
                </div>

                <div className="prof-modal-actions">
                  <button
                    type="button"
                    className="prof-btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="prof-btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
