import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Sidebar from '../components/Sidebar'
import { useToast } from '../context/ToastContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { PlaneIcon, HotelIcon, ShieldIcon, WaveIcon, MountainIcon, CompassIcon, SparkleIcon } from '../components/icons/LuxuryIcons'
import { WIKIMEDIA_REAL_IMAGES } from '../services/placeImageService'
import './Bookings.css'

export default function Bookings() {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  usePageTitle('Travel Bookings & Logistics — PlanYatri')

  const { userInfo } = useSelector((state) => state.auth)
  const { trips = [] } = useSelector((state) => state.trips)
  const userKey = userInfo?.id || userInfo?._id || userInfo?.email || 'guest'

  const [bookings, setBookings] = useState(() => {
    try {
      const storageKey = `planyatri_bookings_${userKey}`
      const saved = localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      const storageKey = `planyatri_bookings_${userKey}`
      localStorage.setItem(storageKey, JSON.stringify(bookings))
    } catch (err) {
      console.warn('Failed to save bookings:', err)
    }
  }, [bookings, userKey])

  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedBookingForModal, setSelectedBookingForModal] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const upcomingTrip = trips.length > 0 ? trips[0] : null
  const upcomingBooking = bookings.find((b) => !b.isCompleted) || (bookings.length > 0 ? bookings[0] : null)

  useEffect(() => {
    if (location.state?.newBooking) {
      const nb = location.state.newBooking
      setBookings((prev) => [nb, ...prev])
      toast.success(`🎉 Confirmed booking added for "${nb.title}"!`)
      window.history.replaceState({}, document.title)
    } else if (location.state?.newBookings && Array.isArray(location.state.newBookings)) {
      const nbs = location.state.newBookings
      setBookings((prev) => [...nbs, ...prev])
      const tripName = location.state.tripName || 'your trip'
      toast.success(`🎉 Confirmed ${nbs.length} reservations for ${tripName}!`)
      window.history.replaceState({}, document.title)
    }
  }, [location.state, toast])

  // New Booking State
  const [newTitle, setNewTitle] = useState('')
  const [newSubtitle, setNewSubtitle] = useState('')
  const [newType, setNewType] = useState('Stay')
  const [newDates, setNewDates] = useState('')
  const [newPrice, setNewPrice] = useState('₹45,000')

  const filteredBookings = useMemo(() => {
    return bookings.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(search.toLowerCase()) ||
        item.ref.toLowerCase().includes(search.toLowerCase())

      let matchesTab = true
      if (activeTab === 'Upcoming') matchesTab = !item.isCompleted
      else if (activeTab === 'Completed') matchesTab = item.isCompleted
      else if (activeTab === 'Flights') matchesTab = item.type === 'Flight'
      else if (activeTab === 'Stays') matchesTab = item.type === 'Stay'

      return matchesSearch && matchesTab
    })
  }, [bookings, search, activeTab])

  const handleCreateBooking = (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const newBookingObj = {
      id: `bk-${Date.now()}`,
      type: newType,
      title: newTitle.trim(),
      subtitle: newSubtitle || 'Confirmed travel reservation',
      dates: newDates || 'Nov 20 — Nov 27 2026',
      time: 'Confirmed Booking',
      terminal: '★ CONFIRMED RESERVATION',
      status: 'Confirmed',
      isCompleted: false,
      price: newPrice || '₹50,000',
      ref: `YTR-${Math.floor(1000 + Math.random() * 9000)}`,
      img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&q=85&auto=format&fit=crop',
      icon: newType === 'Flight' ? '✈️' : newType === 'Stay' ? '🏨' : '🎯',
    }

    setBookings((prev) => [newBookingObj, ...prev])
    setShowAddModal(false)
    setNewTitle('')
    setNewSubtitle('')
    toast.success(`🎉 Booking for ${newBookingObj.title} added!`)
  }

  return (
    <div className="bk-page-root">
      <Sidebar />

      <main className="bk-main-content">
        <div className="bk-scroll-container">
          {/* ── 1. TOP HEADER & METRICS ── */}
          <header className="bk-top-header">
            <div className="bk-title-group">
              <h1 className="bk-hero-title">Travel Bookings & Logistics</h1>
              <p className="bk-hero-sub">
                Manage confirmed flight boarding passes, luxury villas, transport logistics, and past journey receipts.
              </p>
            </div>

            <div className="bk-header-actions">
              <button className="bk-add-btn" onClick={() => setShowAddModal(true)}>
                <span>+ Add Booking</span>
              </button>
            </div>
          </header>

          {/* ── 2. LOGISTICS BANNER (DYNAMIC BASED ON REAL TRIPS / BOOKINGS) ── */}
          <section className="bk-hero-logistics-banner">
            <div className="bhl-left-info">
              <span className="bhl-tag">
                {upcomingBooking || upcomingTrip
                  ? `UPCOMING IMMERSION • ${upcomingBooking?.dates || upcomingTrip?.dates || 'CONFIRMED'}`
                  : 'PLANYATRI DIGITAL CONCIERGE'}
              </span>
              <h2 className="bhl-title">
                {upcomingTrip ? `${upcomingTrip.dest} Itinerary & Logistics` : upcomingBooking ? `${upcomingBooking.title} Logistics` : 'Smart Travel Bookings & Flight Passes'}
              </h2>
              <p className="bhl-desc">
                {upcomingTrip
                  ? `Your curated journey (${upcomingTrip.subtitle || upcomingTrip.dest}) is actively tracked with verified digital vouchers, flight gates, and stay check-ins.`
                  : upcomingBooking
                  ? `Active reservation for ${upcomingBooking.subtitle}. Access high-resolution boarding passes and fast-track check-in vouchers.`
                  : 'Keep all your verified flight e-tickets, boutique luxury hotel reservations, and travel insurance policies organized in one unified digital vault.'}
              </p>

              <div className="bhl-actions">
                {upcomingBooking ? (
                  <button
                    className="bhl-btn-primary"
                    onClick={() => {
                      setSelectedBookingForModal(upcomingBooking)
                      toast.success('Opening digital voucher!')
                    }}
                  >
                    <span>View Digital Voucher</span>
                    <span>→</span>
                  </button>
                ) : (
                  <button
                    className="bhl-btn-primary"
                    onClick={() => navigate('/destinations')}
                  >
                    <SparkleIcon size={14} color="#18181B" />
                    <span>Explore Destinations</span>
                    <span>→</span>
                  </button>
                )}
                <button
                  className="bhl-btn-secondary"
                  onClick={() => navigate('/messages', { state: { prompt: upcomingTrip ? `Help me with flight transfers and hotel logistics for my ${upcomingTrip.dest} trip.` : 'Help me arrange flight and hotel bookings.' } })}
                >
                  <CompassIcon size={14} color="currentColor" />
                  <span>Travel Concierge</span>
                </button>
              </div>
            </div>

            <div className="bhl-right-quick-pills">
              <div className="bhl-quick-card" onClick={() => navigate('/trips')} style={{ cursor: 'pointer' }}>
                <div className="bqc-icon-box dark">
                  <PlaneIcon size={16} color="#FFFFFF" />
                </div>
                <div>
                  <span className="bqc-label">{upcomingTrip ? upcomingTrip.dest : 'MULTI-CITY STUDIO'}</span>
                  <p className="bqc-val">{upcomingTrip ? `${upcomingTrip.days || 7} Days Journey →` : 'Build Custom Itinerary →'}</p>
                </div>
              </div>

              <div className="bhl-quick-card" onClick={() => navigate('/emergency')} style={{ cursor: 'pointer' }}>
                <div className="bqc-icon-box gold">
                  <ShieldIcon size={16} color="#D4A843" />
                </div>
                <div>
                  <span className="bqc-label">SOLO SAFE PROTECTION</span>
                  <p className="bqc-val">24/7 Global SOS Active →</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── 3. SEARCH & TABS FILTER BAR ── */}
          <div className="bk-filter-bar">
            <div className="bk-tabs-group">
              {['All', 'Upcoming', 'Stays', 'Flights', 'Completed'].map((tab) => (
                <button
                  key={tab}
                  className={`bk-tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="bk-search-box">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8C867A" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search bookings or ref #..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bk-search-input"
              />
            </div>
          </div>

          {/* ── 4. BOOKINGS CARDS GRID ── */}
          {filteredBookings.length === 0 ? (
            <div className="bk-empty-state-box" style={{ textAlign: 'center', padding: '48px 24px', background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)', margin: '20px 0' }}>
              <span style={{ fontSize: '38px', display: 'block', marginBottom: 12 }}>✈️</span>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px', color: '#FAF8F5' }}>No active bookings found</h3>
              <p style={{ fontSize: '13px', color: 'rgba(250,248,245,0.6)', maxWidth: 420, margin: '0 auto 16px' }}>
                You have no reservations logged yet. Add your flights, boutique stays, or expedition vouchers here.
              </p>
              <button
                className="bhl-btn-primary"
                onClick={() => setShowAddModal(true)}
                style={{ background: '#D4A843', color: '#121316', fontWeight: 700, padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer' }}
              >
                + Add New Reservation
              </button>
            </div>
          ) : (
            <div className="bk-grid-layout">
              {filteredBookings.map((b) => (
                <div key={b.id} className="bk-editorial-card">
                <div className="bk-card-media">
                  <img
                    src={b.img}
                    alt={b.title}
                    className="bk-media-img"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = 'https://images.pexels.com/photos/1583244/pexels-photo-1583244.jpeg?auto=compress&cs=tinysrgb&w=900&h=1100&fit=crop'
                    }}
                  />
                  <div className="bk-status-chip">
                    <span className={`bk-dot ${b.isCompleted ? 'completed' : 'confirmed'}`} />
                    <span>{b.status}</span>
                  </div>
                  <span className="bk-type-badge">{b.type}</span>
                </div>

                <div className="bk-card-content">
                  <div className="bk-card-top-info">
                    <span className="bk-card-ref">REF: {b.ref}</span>
                    <span className="bk-card-terminal">{b.terminal}</span>
                  </div>

                  <h3 className="bk-card-title">{b.title}</h3>
                  <p className="bk-card-sub">{b.subtitle}</p>

                  <div className="bk-card-details-box">
                    <div className="bk-detail-item">
                      <span className="bdi-lbl">DATES & TIMING</span>
                      <span className="bdi-val">{b.dates} • {b.time}</span>
                    </div>
                  </div>

                  <div className="bk-card-footer">
                    <div className="bk-price-column">
                      <span className="bpc-lbl">TOTAL AMOUNT</span>
                      <span className="bpc-val">{b.price}</span>
                    </div>

                    <button
                      className="bk-action-btn"
                      onClick={() => {
                        toast.success(`📄 Accessing voucher for ${b.title}...`)
                        setSelectedBookingForModal(b)
                      }}
                    >
                      <span>View Voucher</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>

        {/* ── 5. LUXURY DIGITAL VOUCHER & BOARDING PASS MODAL ── */}
        {selectedBookingForModal && (
          <div className="bk-modal-backdrop" onClick={() => setSelectedBookingForModal(null)}>
            <div className="bk-modal-window" style={{ maxWidth: '640px', padding: 0, overflow: 'hidden', border: '1px solid rgba(212,168,67,0.3)' }} onClick={(e) => e.stopPropagation()}>
              
              {/* Header */}
              <div className="bk-modal-hdr" style={{ background: '#0C1B2A', color: '#FBF9F5', padding: '20px 24px', margin: 0 }}>
                <div>
                  <span className="modal-ref-tag" style={{ color: '#D4A843', letterSpacing: '1px', fontWeight: 600 }}>OFFICIAL PLANYATRI VOUCHER • {selectedBookingForModal.ref}</span>
                  <h3 className="modal-title" style={{ color: '#FFFFFF', marginTop: 4 }}>{selectedBookingForModal.title}</h3>
                </div>
                <button className="modal-close" style={{ color: '#A0AEC0' }} onClick={() => setSelectedBookingForModal(null)}>
                  ✕
                </button>
              </div>

              {/* Voucher Content Printable Area */}
              <div className="bk-voucher-body" id="printable-voucher-area" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
                  <img
                    src={selectedBookingForModal.img}
                    alt={selectedBookingForModal.title}
                    style={{ width: '130px', height: '100px', objectFit: 'cover', borderRadius: '10px', border: '1px solid rgba(212,168,67,0.2)' }}
                  />
                  <div>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', tracking: '1px', background: 'rgba(16,185,129,0.15)', color: '#10B981', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>
                      {selectedBookingForModal.status} RESERVATION
                    </span>
                    <h4 style={{ fontSize: '16px', fontWeight: 600, margin: '8px 0 4px', color: 'var(--text-color, #1E293B)' }}>{selectedBookingForModal.subtitle}</h4>
                    <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>{selectedBookingForModal.dates}</p>
                  </div>
                </div>

                <div className="voucher-fields-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', background: 'rgba(212,168,67,0.06)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(212,168,67,0.15)' }}>
                  <div className="v-field">
                    <span className="vf-lbl" style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, letterSpacing: '0.5px' }}>PASSENGER / GUEST</span>
                    <span className="vf-val" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-color, #0F172A)' }}>{userInfo?.name || 'Guest Traveler'}</span>
                  </div>
                  <div className="v-field">
                    <span className="vf-lbl" style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, letterSpacing: '0.5px' }}>BOOKING REFERENCE</span>
                    <span className="vf-val" style={{ fontSize: '13px', fontWeight: 700, color: '#D4A843' }}>{selectedBookingForModal.ref}</span>
                  </div>
                  <div className="v-field">
                    <span className="vf-lbl" style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, letterSpacing: '0.5px' }}>TIME & LOGISTICS</span>
                    <span className="vf-val" style={{ fontSize: '13px', fontWeight: 600 }}>{selectedBookingForModal.time || selectedBookingForModal.terminal}</span>
                  </div>
                  <div className="v-field">
                    <span className="vf-lbl" style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700, letterSpacing: '0.5px' }}>AMOUNT CONFIRMED</span>
                    <span className="vf-val" style={{ fontSize: '13px', fontWeight: 700, color: '#10B981' }}>{selectedBookingForModal.price}</span>
                  </div>
                </div>

                {/* QR Code & Barcode Section */}
                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0C1B2A', padding: '16px', borderRadius: '10px', color: '#FFF' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '11px', color: '#D4A843', fontWeight: 600, letterSpacing: '1px', margin: '0 0 4px 0' }}>DIGITAL CONCIERGE ACCESS</p>
                    <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>Scan at check-in counter or airport gate for fast-track entry.</p>
                  </div>
                  <div style={{ background: '#FFF', padding: '6px', borderRadius: '8px', marginLeft: '16px' }}>
                    <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
                      <rect width="100" height="100" fill="white"/>
                      <path d="M10 10h30v30H10zM60 10h30v30H60zM10 60h30v30H10z" fill="black"/>
                      <path d="M20 20h10v10H20zM70 20h10v10H70zM20 70h10v10H20z" fill="white"/>
                      <path d="M50 10h5v80h-5zM10 50h80v5h-80zM60 60h15v15H60zM75 75h15v15H75zM60 85h10v5H60z" fill="black"/>
                    </svg>
                  </div>
                </div>

                <div className="voucher-modal-actions" style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                  <button
                    className="v-btn-primary"
                    style={{ flex: 1, padding: '12px', background: '#D4A843', color: '#0C1B2A', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    onClick={() => {
                      toast.success('🖨️ Opening official PDF voucher for printing!')
                      window.print()
                    }}
                  >
                    <span>Print / Save PDF Voucher</span>
                    <span>→</span>
                  </button>
                  <button
                    style={{ padding: '12px 20px', background: 'transparent', color: '#64748B', borderRadius: '8px', border: '1px solid #CBD5E1', cursor: 'pointer', fontWeight: 600 }}
                    onClick={() => setSelectedBookingForModal(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 6. ADD BOOKING MODAL ── */}
        {showAddModal && (
          <div className="bk-modal-backdrop" onClick={() => setShowAddModal(false)}>
            <div className="bk-modal-window" onClick={(e) => e.stopPropagation()}>
              <div className="bk-modal-hdr">
                <h3 className="modal-title">Add Reservation / Booking</h3>
                <button className="modal-close" onClick={() => setShowAddModal(false)}>
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateBooking} className="bk-modal-form">
                <div className="bm-field">
                  <label>Title (Hotel, Flight or Experience) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alila Ubud Luxury Resort"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>

                <div className="bm-field">
                  <label>Location / Details</label>
                  <input
                    type="text"
                    placeholder="e.g. Deluxe Terrace Pool Villa, Bali"
                    value={newSubtitle}
                    onChange={(e) => setNewSubtitle(e.target.value)}
                  />
                </div>

                <div className="bm-grid-2">
                  <div className="bm-field">
                    <label>Category</label>
                    <select value={newType} onChange={(e) => setNewType(e.target.value)}>
                      <option value="Stay">Luxury Stay</option>
                      <option value="Flight">Flight / Charter</option>
                      <option value="Activity">Experience / Activity</option>
                      <option value="Insurance">Travel Insurance</option>
                    </select>
                  </div>

                  <div className="bm-field">
                    <label>Amount (Price)</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹55,000"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="bm-field">
                  <label>Dates</label>
                  <input
                    type="text"
                    placeholder="e.g. 15 Nov — 22 Nov 2024"
                    value={newDates}
                    onChange={(e) => setNewDates(e.target.value)}
                  />
                </div>

                <div className="bm-actions">
                  <button
                    type="button"
                    className="bm-btn-cancel"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="bm-btn-submit">
                    Confirm Booking
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
