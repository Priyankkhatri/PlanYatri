import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import { fetchTrips } from '../store/slices/tripSlice'
import { WIKIMEDIA_REAL_IMAGES } from '../services/placeImageService'
import { usePageTitle } from '../hooks/usePageTitle'
import { useFavorites } from '../context/FavoritesContext'
import { useToast } from '../context/ToastContext'
import { CalendarIcon, UsersIcon, FlameIcon, SparkleIcon, MapPinIcon, ShieldIcon, CompassIcon, PlaneIcon } from '../components/icons/LuxuryIcons'
import WeatherWidget from '../components/WeatherWidget'
import CurrencyConverter from '../components/CurrencyConverter'
import FlightTracker from '../components/FlightTracker'
import AIJourneyPlannerModal from '../components/AIJourneyPlannerModal'
import './Dashboard.css'

/* ── Animation Variants ── */
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.25, 0.46, 0.45, 0.94] } },
}
const staggerContainer = {
  animate: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}
const cardVariant = {
  initial: { opacity: 0, y: 24, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 320, damping: 26 } },
}
const heroTextVariant = {
  initial: { opacity: 0, x: -28 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState('')
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSuccess, setNewsletterSuccess] = useState(false)
  const [showAIPlannerModal, setShowAIPlannerModal] = useState(false)
  const [userCity, setUserCity] = useState('Bangalore, India')

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useToast()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { userInfo } = useSelector((state) => state.auth)
  const { trips = [] } = useSelector((state) => state.trips)

  usePageTitle('Dashboard — PlanYatri')

  const displayName = userInfo?.name || 'Traveler'
  const firstName = displayName.split(' ')[0]
  const nextTrip = Array.isArray(trips) && trips.length > 0 ? trips[0] : null

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40)
    dispatch(fetchTrips())

    // Detect user location gracefully
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
            const data = await res.json()
            if (data.city || data.locality) {
              setUserCity(`${data.city || data.locality}, ${data.countryName || 'India'}`)
            }
          } catch {}
        },
        () => {}
      )
    }

    return () => clearTimeout(t)
  }, [dispatch])

  const handleToggleFav = (e, destObj) => {
    e.stopPropagation()
    toggleFavorite(destObj)
    const fav = isFavorite(destObj.id)
    if (!fav) {
      toast.success(`❤️ Added ${destObj.name} to your Saved Favorites!`)
    } else {
      toast.info(`Removed ${destObj.name} from Favorites.`)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate('/destinations', { state: { search: search.trim() } })
    }
  }

  const handleNewsletter = (e) => {
    e.preventDefault()
    if (newsletterEmail) {
      setNewsletterSuccess(true)
      toast.success('🎉 Subscribed to PlanYatri Travel Digest!')
      setTimeout(() => {
        setNewsletterEmail('')
        setNewsletterSuccess(false)
      }, 4000)
    }
  }

  return (
    <div className={`db-root ${mounted ? 'db-on' : ''}`}>
      {/* ── SIDEBAR ── */}
      <Sidebar />

      {/* ── MAIN CONTENT ── */}
      <div className="db-main">
        {/* ── TOP HEADER ── */}
        <header className="db-topbar">
          <form className="db-search-form" onSubmit={handleSearchSubmit}>
            <div className="db-search-box">
              <svg className="db-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8C867A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="db-search-input"
                placeholder="Search destinations, experiences..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="db-search-submit">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </form>

          <div className="db-topbar-right">
            <button className="db-notif-btn" title="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="db-notif-dot" />
            </button>

            <div className="db-user-chip" onClick={() => navigate('/profile')}>
              <img
                src={userInfo?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&q=80&auto=format&fit=crop'}
                className="db-user-avatar"
                alt="Profile"
              />
              <div className="db-user-info">
                <p className="db-user-name">Hi, {firstName}</p>
                <p className="db-user-sub">Explorer <span>▾</span></p>
              </div>
            </div>
          </div>
        </header>

      {/* ── SCROLLABLE DASHBOARD BODY ── */}
        <motion.div
          className="db-scroll-body"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* 1. HERO SECTION */}
          <motion.section className="db-hero-section" variants={fadeUp}>
            <div className="db-hero-content">
              <div className="db-hero-text">
                <h1 className="db-hero-h1">
                  <span>EXPLORE</span>
                  <span>MORE</span>
                  <span>LIVE MORE</span>
                </h1>
                <p className="db-hero-cursive">The world is waiting for you</p>
              </div>

              {/* Collect Moments Badge */}
              <div className="db-collect-badge">
                <span className="badge-star">★</span>
                <span className="badge-text">COLLECT<br />MOMENTS</span>
              </div>

              {/* Tilted Travel Postcard Cards */}
              <div className="db-hero-cards">
                <div className="db-hero-card-tilt card-tilt-1">
                  <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=700&q=80&auto=format&fit=crop"
                    alt="Valley Escapes"
                  />
                </div>
                <div className="db-hero-card-tilt card-tilt-2">
                  <img
                    src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=700&q=80&auto=format&fit=crop"
                    alt="Scenic Mountain Lake"
                  />
                </div>
              </div>
            </div>
        </motion.section>

          {/* 2. LOCATION & NEXT TRIP BAR */}
          <motion.section className="db-widget-bar" variants={fadeUp}>
            <div className="widget-loc-item">
              <div className="widget-icon-box orange">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <p className="widget-lbl">Current Location</p>
                <p className="widget-val">{userCity}</p>
              </div>
            </div>

            {/* Clean & Elegant Travel Planner Button */}
            <button
              className="widget-center-planner-btn"
              onClick={() => setShowAIPlannerModal(true)}
              title="Plan Your Journey"
            >
              <div className="planner-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
              </div>
              <span className="planner-btn-label">Plan Journey</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="planner-btn-arrow">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>

            <div
              className="widget-trip-item"
              onClick={() => nextTrip ? navigate('/trips') : setShowAIPlannerModal(true)}
              style={{ cursor: 'pointer' }}
              title={nextTrip ? "View Trip Itinerary" : "Plan a trip with AI"}
            >
              <div>
                <p className="widget-lbl">Your Next Trip</p>
                <p className="widget-val">{nextTrip ? (nextTrip.dest || nextTrip.title) : 'No trips planned yet'}</p>
              </div>
              <div className="widget-cal-tag">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <div>
                  <span className="cal-sub">{nextTrip ? 'Upcoming Trip' : 'Start Journey'}</span>
                  <span className="cal-days">{nextTrip ? `${nextTrip.days || 5} Days Trip` : 'Plan with AI →'}</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 3. RECOMMENDED FOR YOU */}
          <motion.section className="db-section" variants={fadeUp}>
            <div className="db-section-hdr">
              <h2 className="db-section-title">Recommended For You</h2>
              <button className="db-view-all" onClick={() => navigate('/destinations')}>
                View All →
              </button>
            </div>

            <motion.div className="db-rec-grid" variants={staggerContainer} initial="initial" animate="animate">
              {/* Card 1: Maldives */}
              <motion.div className="rec-card" variants={cardVariant} whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 350, damping: 22 }} onClick={() => navigate('/destinations', { state: { selectedDest: 'Maldives' } })}>
                <div className="rec-img-wrap">
                  <img src={WIKIMEDIA_REAL_IMAGES['maldives']} alt="Maldives" />
                  <button
                    className={`rec-heart-btn ${isFavorite('fav-maldives') ? 'active' : ''}`}
                    onClick={(e) => handleToggleFav(e, { id: 'fav-maldives', name: 'Maldives', country: 'MALDIVES', img: WIKIMEDIA_REAL_IMAGES['maldives'], desc: 'Paradise on Earth with turquoise lagoons.' })}
                    title="Save to Favorites"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={isFavorite('fav-maldives') ? '#EF4444' : 'none'} stroke={isFavorite('fav-maldives') ? '#EF4444' : '#FFFFFF'} strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>
                <div className="rec-body">
                  <h3 className="rec-name">Maldives</h3>
                  <p className="rec-tag">Paradise on Earth</p>
                  <p className="rec-rating"><span className="star">★</span> 4.8 <span className="reviews">(320 reviews)</span></p>
                </div>
              </motion.div>

              {/* Card 2: Switzerland */}
              <motion.div className="rec-card" variants={cardVariant} whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 350, damping: 22 }} onClick={() => navigate('/destinations', { state: { selectedDest: 'Switzerland' } })}>
                <div className="rec-img-wrap">
                  <img src={WIKIMEDIA_REAL_IMAGES['switzerland']} alt="Switzerland" />
                  <button
                    className={`rec-heart-btn ${isFavorite('fav-swiss') ? 'active' : ''}`}
                    onClick={(e) => handleToggleFav(e, { id: 'fav-swiss', name: 'Switzerland', country: 'SWITZERLAND', img: WIKIMEDIA_REAL_IMAGES['switzerland'], desc: 'Alpine Wonderland with majestic peaks.' })}
                    title="Save to Favorites"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={isFavorite('fav-swiss') ? '#EF4444' : 'none'} stroke={isFavorite('fav-swiss') ? '#EF4444' : '#FFFFFF'} strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>
                <div className="rec-body">
                  <h3 className="rec-name">Switzerland</h3>
                  <p className="rec-tag">Alpine Wonderland</p>
                  <p className="rec-rating"><span className="star">★</span> 4.9 <span className="reviews">(180 reviews)</span></p>
                </div>
              </motion.div>

              {/* Card 3: Greece */}
              <motion.div className="rec-card" variants={cardVariant} whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 350, damping: 22 }} onClick={() => navigate('/destinations', { state: { selectedDest: 'Greece' } })}>
                <div className="rec-img-wrap">
                  <img src={WIKIMEDIA_REAL_IMAGES['greece']} alt="Greece" />
                  <button
                    className={`rec-heart-btn ${isFavorite('fav-greece') ? 'active' : ''}`}
                    onClick={(e) => handleToggleFav(e, { id: 'fav-greece', name: 'Greece', country: 'GREECE', img: WIKIMEDIA_REAL_IMAGES['greece'], desc: 'Timeless beauty and Aegean sunsets.' })}
                    title="Save to Favorites"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={isFavorite('fav-greece') ? '#EF4444' : 'none'} stroke={isFavorite('fav-greece') ? '#EF4444' : '#FFFFFF'} strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>
                <div className="rec-body">
                  <h3 className="rec-name">Greece</h3>
                  <p className="rec-tag">Timeless Beauty</p>
                  <p className="rec-rating"><span className="star">★</span> 4.7 <span className="reviews">(210 reviews)</span></p>
                </div>
              </motion.div>

              {/* Card 4: Bali */}
              <motion.div className="rec-card" variants={cardVariant} whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 350, damping: 22 }} onClick={() => navigate('/destinations', { state: { selectedDest: 'Bali' } })}>
                <div className="rec-img-wrap">
                  <img src={WIKIMEDIA_REAL_IMAGES['bali']} alt="Bali" />
                  <button
                    className={`rec-heart-btn ${isFavorite('fav-ubud') ? 'active' : ''}`}
                    onClick={(e) => handleToggleFav(e, { id: 'fav-ubud', name: 'Bali', country: 'INDONESIA', img: WIKIMEDIA_REAL_IMAGES['bali'], desc: 'Island of Gods and lush emerald terraces.' })}
                    title="Save to Favorites"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={isFavorite('fav-ubud') ? '#EF4444' : 'none'} stroke={isFavorite('fav-ubud') ? '#EF4444' : '#FFFFFF'} strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>
                <div className="rec-body">
                  <h3 className="rec-name">Bali</h3>
                  <p className="rec-tag">Island of Gods</p>
                  <p className="rec-rating"><span className="star">★</span> 4.8 <span className="reviews">(420 reviews)</span></p>
                </div>
              </motion.div>
            </motion.div>
          </motion.section>

          {/* 4. PLAN YOUR NEXT ADVENTURE */}
          <motion.section className="db-section" variants={fadeUp}>
            <h2 className="db-section-title">Plan Your Next Adventure</h2>

            <div className="db-adv-grid">
              {/* Left Big Card with Split Graphic and Form CTA */}
              <div className="adv-left-card">
                <div className="adv-graphic-half">
                  <svg viewBox="0 0 400 300" className="mountain-vector-svg">
                    <rect width="400" height="300" fill="#0C1B2A" />
                    {/* Stars */}
                    <circle cx="40" cy="30" r="1.5" fill="#FFFFFF" opacity="0.6" />
                    <circle cx="120" cy="45" r="1" fill="#FFFFFF" opacity="0.8" />
                    <circle cx="280" cy="35" r="1.2" fill="#FFFFFF" opacity="0.7" />
                    <circle cx="340" cy="60" r="1" fill="#FFFFFF" opacity="0.5" />
                    <circle cx="200" cy="20" r="1.8" fill="#FFFFFF" opacity="0.9" />
                    {/* Distant Mountains */}
                    <polygon points="0,300 80,180 180,300" fill="#183654" />
                    <polygon points="120,300 240,140 360,300" fill="#244D76" />
                    <polygon points="260,300 330,190 400,300" fill="#1C3D5E" />
                    {/* Snow Caps */}
                    <polygon points="240,140 215,180 240,172 265,180" fill="#E2E8F0" />
                    <polygon points="80,180 60,210 80,205 100,210" fill="#CBD5E1" />
                    {/* Foreground Pine Ridge */}
                    <polygon points="0,300 50,240 100,300 150,250 200,300 280,245 350,300 400,255 400,300" fill="#0B131F" />
                  </svg>
                </div>

                <div className="adv-content-half">
                  <h3 className="adv-h3">Plan your dream<br />trip today!</h3>
                  <p className="adv-sub">Tell us your preferences and we'll craft the perfect journey for you.</p>

                  <div className="adv-steps-row">
                    <div className="adv-step-item">
                      <div className="adv-step-icon">○</div>
                      <span className="adv-step-lbl">CHOOSE DESTINATION</span>
                    </div>
                    <div className="adv-step-item">
                      <div className="adv-step-icon">📅</div>
                      <span className="adv-step-lbl">SELECT DATES</span>
                    </div>
                    <div className="adv-step-item">
                      <div className="adv-step-icon">✈️</div>
                      <span className="adv-step-lbl">TRAVEL STYLE</span>
                    </div>
                  </div>

                  <button className="adv-cta-btn" onClick={() => setShowAIPlannerModal(true)}>
                    <span>Let's Plan Your Trip with AI</span>
                    <span className="adv-arrow">→</span>
                  </button>
                </div>
              </div>

              {/* Right Card with Quote & Watermark */}
              <div className="adv-right-quote-card">
                <div className="quote-watermark-bg">
                  <svg viewBox="0 0 200 150" className="watermark-svg">
                    <polygon points="0,150 70,80 140,150" fill="#EFEAE2" opacity="0.6" />
                    <polygon points="80,150 140,60 200,150" fill="#E5DFD5" opacity="0.7" />
                  </svg>
                </div>
                <div className="adv-quote-wrapper">
                  <p className="adv-quote-text">
                    "One day you'll leave this world behind<br />so live a life you will remember."
                  </p>
                  <span className="adv-quote-author">~ The Nights</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 5. YOUR UPCOMING TRIPS (DYNAMICALLY RENDERED FROM USER TRIPS) */}
          <motion.section className="db-section" variants={fadeUp}>
            <div className="db-section-hdr">
              <h2 className="db-section-title">Your Upcoming Trips</h2>
              <button className="db-view-all" onClick={() => navigate('/trips')}>
                View All →
              </button>
            </div>

            {trips.length === 0 ? (
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 20,
                  border: '1px solid #EFEAE2',
                  padding: '48px 32px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <span style={{ fontSize: 42 }}>🧭</span>
                <h3 style={{ fontFamily: 'var(--font-display, serif)', fontSize: 22, fontWeight: 700, margin: 0, color: '#18181B' }}>
                  No Journeys Scheduled Yet
                </h3>
                <p style={{ fontSize: 14, color: '#8C867A', maxWidth: 440, margin: '0 0 8px' }}>
                  Ready for your next adventure? Start drafting your personalized multi-city itinerary with our AI Travel Concierge.
                </p>
                <button
                  onClick={() => setShowAIPlannerModal(true)}
                  style={{
                    padding: '12px 24px',
                    background: '#D4A843',
                    color: '#18181B',
                    border: 'none',
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 4px 14px rgba(212, 168, 67, 0.25)',
                  }}
                >
                  <SparkleIcon size={14} color="#18181B" /> 🚀 Plan Your First Trip with AI
                </button>
              </div>
            ) : (
              <div className="db-upcoming-layout">
                {/* Main Feature Trip */}
                <div className="upcoming-main-card" onClick={() => navigate('/trips', { state: { selectedTripId: trips[0]._id || trips[0].id } })}>
                  <div className="upcoming-img-box">
                    <img src={trips[0].img || WIKIMEDIA_REAL_IMAGES['udaipur']} alt={trips[0].dest || trips[0].title} />
                  </div>
                  <div className="upcoming-main-info">
                    <div>
                      <h3 className="upcoming-main-title">{trips[0].dest || trips[0].title}</h3>
                      <p className="upcoming-dates">{trips[0].dates || 'Upcoming Journey'}</p>
                    </div>

                    <div className="upcoming-meta-row">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <CalendarIcon size={13} color="#D4A843" /> {trips[0].days || 7} Days Trip
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        <UsersIcon size={13} color="#D4A843" /> {trips[0].members?.length || 2} People
                      </span>
                    </div>

                    <div className="upcoming-progress-wrap">
                      <span className="prog-label">{trips[0].progress || 60}% Prepared</span>
                      <div className="prog-bar-bg">
                        <div className="prog-bar-fill" style={{ width: `${trips[0].progress || 60}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Side Mini Trips */}
                {trips.length > 1 && (
                  <div className="upcoming-side-list">
                    {trips.slice(1, 3).map((tr, idx) => (
                      <div
                        key={tr._id || tr.id || idx}
                        className="upcoming-side-item"
                        onClick={() => navigate('/trips', { state: { selectedTripId: tr._id || tr.id } })}
                      >
                        <div className="side-thumb-box">
                          <img src={tr.img || WIKIMEDIA_REAL_IMAGES['swiss']} alt={tr.dest || tr.title} />
                        </div>
                        <div className="side-item-info">
                          <h4 className="side-item-title">{tr.dest || tr.title}</h4>
                          <p className="side-item-dates">{tr.dates || 'Upcoming'}</p>
                          <p className="side-item-meta" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                              <CalendarIcon size={12} color="#8C867A" /> {tr.days || 5} Days
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.section>

          {/* 6. TRAVEL INSPIRATION */}
          <motion.section className="db-section" variants={fadeUp}>
            <div className="db-section-hdr">
              <h2 className="db-section-title">Travel Inspiration</h2>
              <button className="db-view-all" onClick={() => navigate('/experiences')}>
                View All →
              </button>
            </div>

            <div className="db-blog-grid">
              <div className="blog-article-card" onClick={() => navigate('/experiences')}>
                <img src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&h=400&q=85&auto=format&fit=crop" alt="Cappadocia" className="blog-card-img" />
                <div className="blog-card-body">
                  <h4 className="blog-card-title">A Complete Guide to Cappadocia</h4>
                  <p className="blog-card-desc">Discover the magical land of hot air balloons.</p>
                  <span className="blog-card-date">April 20, 2024</span>
                </div>
              </div>

              <div className="blog-article-card" onClick={() => navigate('/experiences')}>
                <img src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&h=400&q=85&auto=format&fit=crop" alt="Coastal Towns" className="blog-card-img" />
                <div className="blog-card-body">
                  <h4 className="blog-card-title">10 Most Beautiful Coastal Towns</h4>
                  <p className="blog-card-desc">Stunning views and relaxing vibes.</p>
                  <span className="blog-card-date">May 15, 2024</span>
                </div>
              </div>

              <div className="blog-article-card" onClick={() => navigate('/experiences')}>
                <img src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&h=400&q=85&auto=format&fit=crop" alt="Hidden Gems in Asia" className="blog-card-img" />
                <div className="blog-card-body">
                  <h4 className="blog-card-title">Top 7 Hidden Gems in Asia</h4>
                  <p className="blog-card-desc">Offbeat places you must explore.</p>
                  <span className="blog-card-date">June 18, 2024</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* 7. LIVE TRAVEL TOOLS */}
          <motion.section className="db-section" variants={fadeUp}>
            <div className="db-section-hdr">
              <h2 className="db-section-title">Live Travel Tools</h2>
              <span className="db-section-badge">Real-Time Data</span>
            </div>
            <div className="db-tools-grid">
              <WeatherWidget />
              <CurrencyConverter />
              <FlightTracker />
            </div>
          </motion.section>

          {/* 8. NEWSLETTER BANNER */}
          <motion.section className="db-newsletter-box" variants={fadeUp}>
            <div className="nl-stamp-left">
              <div className="vintage-postmark">
                <span>PASSPORT</span>
                <span>VERIFIED</span>
                <span>2026</span>
              </div>
            </div>

            <div className="nl-content-center">
              <h3 className="nl-heading">GET TRAVEL UPDATES</h3>
              <p className="nl-desc">Subscribe to receive travel tips, exclusive deals and inspiration straight to your inbox.</p>
              
              <form className="nl-form-row" onSubmit={handleNewsletter}>
                <input
                  type="email"
                  className="nl-input-field"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                />
                <button type="submit" className="nl-submit-btn">
                  {newsletterSuccess ? 'SUBSCRIBED! ✓' : 'SUBSCRIBE'}
                </button>
              </form>
            </div>

            <div className="nl-stamp-right">
              <div className="vintage-seal-circle">
                <span>PLANYATRI</span>
                <span>TRAVEL</span>
                <span>III</span>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </div>

      {/* AI Journey Planner Modal */}
      {showAIPlannerModal && (
        <AIJourneyPlannerModal onClose={() => setShowAIPlannerModal(false)} />
      )}
    </div>
  )
}
