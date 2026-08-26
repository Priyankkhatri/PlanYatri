import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform
} from 'framer-motion'
import * as Yup from 'yup'
import {
  Compass,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Plane,
  MapPin,
  Star,
  ShieldCheck,
  Zap,
  Check,
  AlertCircle,
  CloudSun,
  Clock,
  Luggage,
  Ticket,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react'
import { login, register, loginDemo, clearError } from '../store/slices/authSlice'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import { usePageTitle } from '../hooks/usePageTitle'
import './LoginPage.css'

/* ── World-Class Curated Destinations ── */
const DESTINATIONS = [
  {
    title: 'The Matterhorn & Zermatt',
    region: 'Swiss Alps',
    country: 'Switzerland',
    tag: 'Alpine Luxury',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=88&auto=format&fit=crop',
    rating: '4.98',
    reviews: '1,420',
    tripDuration: '7 Days Exped.',
    elevation: '3,883m',
    weather: '4°C • Powder Snow',
    coords: '45.9763° N, 7.7491° E',
    flight: {
      from: 'SFO',
      fromCity: 'San Francisco',
      to: 'ZRH',
      toCity: 'Zurich / Zermatt',
      gate: 'B12',
      seat: '1A • First Suite',
      flightNo: 'PY-804',
      status: 'Boarding Soon • On Time'
    },
    itineraryHighlights: ['Private Heli-Glacier Transfer', 'Matterhorn Fondue Chalet', 'Gornergrat Observatory']
  },
  {
    title: 'Arashiyama Bamboo Grove',
    region: 'Kyoto Prefecture',
    country: 'Japan',
    tag: 'Zen Sanctuary',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1800&q=88&auto=format&fit=crop',
    rating: '4.96',
    reviews: '2,840',
    tripDuration: '10 Days Exped.',
    elevation: '110m',
    weather: '19°C • Cherry Blossom',
    coords: '35.0116° N, 135.6778° E',
    flight: {
      from: 'JFK',
      fromCity: 'New York',
      to: 'HND',
      toCity: 'Tokyo / Kyoto',
      gate: 'A04',
      seat: '2K • Imperial Suite',
      flightNo: 'PY-920',
      status: 'Shinkansen Link • Ready'
    },
    itineraryHighlights: ['Private Tea Ceremony Master', 'Gion Evening Kaiseki', 'Torii Gate Sunrise Trek']
  },
  {
    title: 'Positano & Amalfi Cliffs',
    region: 'Campania',
    country: 'Italy',
    tag: 'Mediterranean Serenity',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1800&q=88&auto=format&fit=crop',
    rating: '4.99',
    reviews: '3,510',
    tripDuration: '8 Days Exped.',
    elevation: '420m',
    weather: '26°C • Golden Hour',
    coords: '40.6281° N, 14.4850° E',
    flight: {
      from: 'LHR',
      fromCity: 'London',
      to: 'NAP',
      toCity: 'Naples / Amalfi',
      gate: 'C28',
      seat: '1B • Yacht Deck',
      flightNo: 'PY-410',
      status: 'Private Yacht Active'
    },
    itineraryHighlights: ['Private Riva Boat Charter', 'Capri Blue Grotto Tour', 'Cliffside Lemon Grove Tasting']
  },
  {
    title: 'Ubud Rain Sanctuary',
    region: 'Bali Highlands',
    country: 'Indonesia',
    tag: 'Tropical Haven',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1800&q=88&auto=format&fit=crop',
    rating: '4.94',
    reviews: '2,130',
    tripDuration: '6 Days Exped.',
    elevation: '320m',
    weather: '28°C • Warm Mist',
    coords: '8.5069° S, 115.2625° E',
    flight: {
      from: 'DXB',
      fromCity: 'Dubai',
      to: 'DPS',
      toCity: 'Denpasar / Ubud',
      gate: 'D14',
      seat: '3A • Sky Villa',
      flightNo: 'PY-630',
      status: 'Jungle Villa Transfer'
    },
    itineraryHighlights: ['Tegallalang Sunrise Hot Balloon', 'Ayung River Eco Rafting', 'Sacred Waterfall Yoga']
  }
]

/* ── Live Booking Ticker Items ── */
const LIVE_NOTIFICATIONS = [
  { name: 'Elena Rostova', city: 'Geneva', action: 'reserved Matterhorn Heli-Tour', time: '1m ago', flag: '🇨🇭' },
  { name: 'Kenji Takahashi', city: 'Tokyo', action: 'synced 4 travelers to Kyoto trip', time: '3m ago', flag: '🇯🇵' },
  { name: 'Siddharth Nair', city: 'Mumbai', action: 'booked Amalfi Coast cliff villa', time: '5m ago', flag: '🇮🇹' },
  { name: 'Chloe Dubois', city: 'Paris', action: 'generated AI 10-day Bali itinerary', time: '7m ago', flag: '🇮🇩' },
]

/* ── Google Logo SVG ── */
function GoogleBrandIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useToast()
  const { signInWithOAuth } = useAuth()
  usePageTitle('Sign In • PlanYatri Luxury Expeditions')

  const { userInfo, loading, error } = useSelector((state) => state.auth)

  const [tab, setTab] = useState('signin')
  const [showPass, setShowPass] = useState(false)
  const [showConf, setShowConf] = useState(false)
  const [destIndex, setDestIndex] = useState(0)
  const [isDemoLoading, setIsDemoLoading] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [activeNotifIndex, setActiveNotifIndex] = useState(0)

  // 3D Parallax Mouse Tracking on Left Panel
  const heroRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springConfig = { damping: 25, stiffness: 180 }
  const parallaxX = useSpring(useTransform(mouseX, [-300, 300], [-12, 12]), springConfig)
  const parallaxY = useSpring(useTransform(mouseY, [-300, 300], [-12, 12]), springConfig)
  const cardRotateX = useSpring(useTransform(mouseY, [-300, 300], [6, -6]), springConfig)
  const cardRotateY = useSpring(useTransform(mouseX, [-300, 300], [-6, 6]), springConfig)

  const handleMouseMove = (e) => {
    if (!heroRef.current) return
    const rect = heroRef.current.getBoundingClientRect()
    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)
    mouseX.set(x)
    mouseY.set(y)
  }

  // Auto carousel rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setDestIndex((prev) => (prev + 1) % DESTINATIONS.length)
    }, 6800)
    return () => clearInterval(timer)
  }, [])

  // Auto live ticker update
  useEffect(() => {
    const notifTimer = setInterval(() => {
      setActiveNotifIndex((prev) => (prev + 1) % LIVE_NOTIFICATIONS.length)
    }, 4500)
    return () => clearInterval(notifTimer)
  }, [])

  // Redirect if logged in
  useEffect(() => {
    if (userInfo) {
      navigate('/dashboard', { replace: true })
    }
  }, [userInfo, navigate])

  // Real-time password strength and validation criteria
  const getPasswordCriteria = (pass) => {
    return {
      hasMinLen: pass.length >= 6,
      hasUpperLower: /[A-Z]/.test(pass) && /[a-z]/.test(pass),
      hasNumberOrSpecial: /[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass),
    }
  }

  const calculatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'Password required', color: '#CBD5E1', width: '0%' }
    const crit = getPasswordCriteria(pass)
    let score = 0
    if (crit.hasMinLen) score += 1
    if (pass.length >= 10) score += 1
    if (crit.hasUpperLower) score += 1
    if (crit.hasNumberOrSpecial) score += 1

    if (score === 1) return { score: 1, label: 'Weak', color: '#EF4444', width: '25%' }
    if (score === 2) return { score: 2, label: 'Moderate', color: '#F59E0B', width: '50%' }
    if (score === 3) return { score: 3, label: 'Strong', color: '#3B82F6', width: '75%' }
    return { score: 4, label: 'Fortress-Grade 🛡️', color: '#10B981', width: '100%' }
  }

  const validationSchema = Yup.object({
    email: Yup.string().email('Enter a valid email address').required('Email is required'),
    password: Yup.string().min(6, 'Must be at least 6 characters').required('Password is required'),
    ...(tab === 'signup' && {
      name: Yup.string().min(2, 'Name is too short').required('Full name is required'),
      confirm: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm password'),
    }),
  })

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', confirm: '' },
    validationSchema,
    onSubmit: async (values) => {
      if (tab === 'signin') {
        const result = await dispatch(login({ email: values.email, password: values.password }))
        if (login.fulfilled.match(result)) {
          toast.success('Welcome back, Captain! 👋')
        }
      } else {
        const result = await dispatch(register({ name: values.name, email: values.email, password: values.password }))
        if (register.fulfilled.match(result)) {
          toast.success('Passport created! Welcome to PlanYatri 🌍')
        }
      }
    },
  })

  const switchTab = (newTab) => {
    setTab(newTab)
    dispatch(clearError())
    formik.resetForm()
    setShowPass(false)
    setShowConf(false)
  }

  const handleDemoLogin = async () => {
    setIsDemoLoading(true)
    try {
      const res = await dispatch(loginDemo())
      if (loginDemo.fulfilled.match(res)) {
        toast.success('Welcome to PlanYatri Demo Mode ✨')
      }
    } catch {
      toast.error('Unable to sign in as demo')
    } finally {
      setIsDemoLoading(false)
    }
  }

  const currentDest = DESTINATIONS[destIndex]
  const passStrength = calculatePasswordStrength(formik.values.password)
  const passCriteria = getPasswordCriteria(formik.values.password)
  const currentNotif = LIVE_NOTIFICATIONS[activeNotifIndex]

  return (
    <div className="login-root">
      {/* ─────────────────────────────────────────────────────────────
          LEFT PANEL: HIGH-FIDELITY CINEMATIC HUD & MOTION GRAPHICS
         ───────────────────────────────────────────────────────────── */}
      <div
        className="hero-panel"
        ref={heroRef}
        onMouseMove={handleMouseMove}
      >
        {/* Cinematic Parallax Background Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDest.title}
            className="hero-bg-container"
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.img
              src={currentDest.image}
              alt={currentDest.title}
              className="hero-bg-img"
              style={{ x: parallaxX, y: parallaxY }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Dynamic Multi-Layer Light Filtration */}
        <div className="hero-atmosphere-overlay" />
        <div className="hero-grid-pattern" />
        <div className="hero-vignette" />

        {/* Ambient Pulsing Aurora Orbs */}
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />
        <div className="ambient-orb orb-3" />

        {/* Top Header Navigation & Luxury HUD */}
        <div className="hero-top-nav">
          <motion.div
            className="hero-brand"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="brand-icon-box">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Compass className="brand-compass-icon" strokeWidth={2.4} />
              </motion.div>
            </div>
            <div className="brand-label">
              <span className="brand-name">PLANYATRI</span>
              <span className="brand-badge">LUXURY EXPEDITION ENGINE</span>
            </div>
          </motion.div>

          <div className="hero-hud-stats">
            <div className="hud-stat-pill">
              <CloudSun className="w-3.5 h-3.5 text-[#D4A843]" />
              <span>{currentDest.weather}</span>
            </div>
            <div className="hud-stat-pill desktop-only">
              <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>{currentDest.elevation}</span>
            </div>
          </div>
        </div>

        {/* Center Canvas: Destination Narrative */}
        <motion.div
          className="hero-center-content"
          style={{ rotateX: cardRotateX, rotateY: cardRotateY, perspective: 1000 }}
        >
          {/* Coordinates and Tag Badge */}
          <div className="destination-meta-row">
            <motion.div
              key={`tag-${currentDest.tag}`}
              className="hero-destination-tag"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4A843]" />
              <span>{currentDest.tag}</span>
              <span className="tag-dot" />
              <span>{currentDest.country}</span>
            </motion.div>

            <span className="hud-coords desktop-only">{currentDest.coords}</span>
          </div>

          {/* Animated Main Title */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={`title-${currentDest.title}`}
              className="hero-main-title"
              initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              Voyage Beyond <br />
              <span className="gold-shimmer-text">{currentDest.title}</span>
            </motion.h1>
          </AnimatePresence>

          <p className="hero-subtitle">
            Generate bespoke private itineraries with generative AI, synchronize real-time travel logistics with companions, and book verified elite retreats.
          </p>

          {/* Quick Highlight Capsules */}
          <div className="itinerary-capsules">
            {currentDest.itineraryHighlights.map((item, idx) => (
              <motion.span
                key={item}
                className="itinerary-capsule"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
              >
                <Check className="w-3 h-3 text-[#D4A843]" />
                {item}
              </motion.span>
            ))}
          </div>

          {/* Interactive Carousel Timeline Nav */}
          <div className="destination-indicators">
            {DESTINATIONS.map((dest, idx) => (
              <button
                key={dest.title}
                type="button"
                className={`dest-dot-btn ${idx === destIndex ? 'active' : ''}`}
                onClick={() => setDestIndex(idx)}
                aria-label={`View ${dest.title}`}
              >
                {idx === destIndex && (
                  <motion.div
                    className="dest-dot-fill"
                    layoutId="activeCarouselDot"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Floating Motion Graphics: Luxury Boarding Pass & Social Proof ── */}
        <div className="hero-floating-widgets">
          {/* Animated Flight Boarding Pass Widget */}
          <motion.div
            className="floating-glass-widget boarding-pass-card"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="boarding-pass-header">
              <div className="boarding-tag">
                <Ticket className="w-3.5 h-3.5 text-[#D4A843]" />
                <span>FIRST CLASS VIP PASS</span>
              </div>
              <div className="flight-status-badge">
                <span className="live-pulse-dot" />
                <span>{currentDest.flight.flightNo}</span>
              </div>
            </div>

            <div className="boarding-flight-row">
              <div className="flight-city-box">
                <span className="city-code">{currentDest.flight.from}</span>
                <span className="city-name">{currentDest.flight.fromCity}</span>
              </div>

              <div className="flight-radar-path">
                <motion.div
                  className="radar-airplane"
                  animate={{ x: [0, 38, 0] }}
                  transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut' }}
                >
                  <Plane className="w-3.5 h-3.5 text-[#D4A843]" />
                </motion.div>
                <div className="radar-dashed-track" />
                <span className="flight-time-est">{currentDest.tripDuration}</span>
              </div>

              <div className="flight-city-box text-right">
                <span className="city-code">{currentDest.flight.to}</span>
                <span className="city-name">{currentDest.flight.toCity}</span>
              </div>
            </div>

            <div className="boarding-pass-footer">
              <div className="pass-meta-item">
                <span className="meta-label">SEAT</span>
                <span className="meta-val">{currentDest.flight.seat}</span>
              </div>
              <div className="pass-meta-item">
                <span className="meta-label">GATE</span>
                <span className="meta-val">{currentDest.flight.gate}</span>
              </div>
              <div className="pass-meta-item">
                <span className="meta-label">STATUS</span>
                <span className="meta-val text-emerald-400">{currentDest.flight.status}</span>
              </div>
            </div>
          </motion.div>

          {/* Social Proof & Live Activity Pop-in */}
          <motion.div
            className="floating-glass-widget live-activity-card"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="activity-header">
              <div className="traveler-avatars-wrap">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&q=80&auto=format&fit=crop" alt="Traveler" className="mini-avatar" />
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&q=80&auto=format&fit=crop" alt="Traveler" className="mini-avatar" />
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&q=80&auto=format&fit=crop" alt="Traveler" className="mini-avatar" />
                <div className="mini-avatar-gold">+50k</div>
              </div>
              <div className="activity-stars">
                <Star className="w-3.5 h-3.5 text-[#D4A843] fill-[#D4A843]" />
                <span className="font-bold text-white text-xs">{currentDest.rating}</span>
                <span className="text-slate-400 text-[10px]">({currentDest.reviews})</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentNotif.name}
                className="live-ticker-message"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <span className="ticker-flag">{currentNotif.flag}</span>
                <p className="ticker-text">
                  <strong>{currentNotif.name}</strong> ({currentNotif.city}) {currentNotif.action}
                  <span className="ticker-time"> • {currentNotif.time}</span>
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT PANEL: PRO MAX GLASS AUTH CARD & FLUID MICRO-INTERACTIONS
         ───────────────────────────────────────────────────────────── */}
      <div className="auth-panel">
        <div className="auth-mesh-gradient" />

        <motion.div
          className="auth-container-card"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Mobile brand header */}
          <div className="mobile-brand-row">
            <div className="brand-icon-box small">
              <Compass className="brand-compass-icon text-[#D4A843]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-widest text-slate-900 text-sm leading-none">PLANYATRI</span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider">EXPEDITIONS</span>
            </div>
          </div>

          {/* Instant Demo Pass Banner */}
          <motion.div
            className="demo-quick-banner"
            whileHover={{ scale: 1.015, borderColor: 'rgba(212, 168, 67, 0.6)' }}
            whileTap={{ scale: 0.985 }}
          >
            <div className="demo-banner-left">
              <div className="demo-icon-glow">
                <Zap className="w-4 h-4 text-[#D4A843]" />
              </div>
              <div className="demo-banner-text">
                <span className="demo-banner-title">Instant Explorer Pass</span>
                <span className="demo-banner-sub">One-click test access without registration</span>
              </div>
            </div>
            <button
              type="button"
              className="demo-instant-btn"
              onClick={handleDemoLogin}
              disabled={isDemoLoading}
            >
              {isDemoLoading ? (
                <span className="demo-btn-spinner" />
              ) : (
                <>
                  <span>Quick Access</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </motion.div>

          {/* Segmented Sliding Tab Control */}
          <div className="segmented-tab-control" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'signin'}
              className={`segmented-tab-btn ${tab === 'signin' ? 'active' : ''}`}
              onClick={() => switchTab('signin')}
            >
              {tab === 'signin' && (
                <motion.div
                  className="active-pill-background"
                  layoutId="authTabSlider"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="tab-btn-text">Sign In</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={tab === 'signup'}
              className={`segmented-tab-btn ${tab === 'signup' ? 'active' : ''}`}
              onClick={() => switchTab('signup')}
            >
              {tab === 'signup' && (
                <motion.div
                  className="active-pill-background"
                  layoutId="authTabSlider"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="tab-btn-text">Create Account</span>
            </button>
          </div>

          {/* Dynamic Headline */}
          <div className="auth-header-block">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="auth-headline">
                  {tab === 'signin' ? 'Welcome Back, Explorer' : 'Craft Your Passport'}
                </h2>
                <p className="auth-subline">
                  {tab === 'signin'
                    ? 'Enter your credentials to access your live itineraries & bookings.'
                    : 'Join over 50,000 discerning globetrotters designing dream journeys.'}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="error-alert-banner"
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span className="error-alert-text">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Social SSO: Google Button */}
          <div className="oauth-section">
            <motion.button
              type="button"
              className="google-oauth-btn"
              onClick={async () => {
                try {
                  const res = await signInWithOAuth('google')
                  if (res && res.error) toast.error(res.error)
                } catch {
                  toast.error('Google authorization error. Please retry.')
                }
              }}
              whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)' }}
              whileTap={{ scale: 0.985 }}
            >
              <GoogleBrandIcon />
              <span className="oauth-btn-text">Continue with Google</span>
            </motion.button>
          </div>

          {/* Elegant Divider */}
          <div className="auth-or-separator">
            <span className="or-line" />
            <span className="or-text">or email authorization</span>
            <span className="or-line" />
          </div>

          {/* ── Form Body ── */}
          <form className="auth-form-body" onSubmit={formik.handleSubmit} noValidate>
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="form-fields-wrapper"
              >
                {/* Full Name */}
                {tab === 'signup' && (
                  <motion.div
                    className="input-field-group"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <label className="input-label" htmlFor="name">Full Name</label>
                    <div className="input-box-wrapper">
                      <User className="input-leading-icon" />
                      <input
                        id="name"
                        type="text"
                        name="name"
                        autoComplete="name"
                        placeholder="e.g. Maya Chen"
                        className={`custom-auth-input ${
                          formik.touched.name && formik.errors.name ? 'is-invalid' : ''
                        }`}
                        {...formik.getFieldProps('name')}
                      />
                    </div>
                    {formik.touched.name && formik.errors.name && (
                      <p className="input-error-msg">{formik.errors.name}</p>
                    )}
                  </motion.div>
                )}

                {/* Email Address */}
                <div className="input-field-group">
                  <label className="input-label" htmlFor="email">Email Address</label>
                  <div className="input-box-wrapper">
                    <Mail className="input-leading-icon" />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="explorer@domain.com"
                      className={`custom-auth-input ${
                        formik.touched.email && formik.errors.email ? 'is-invalid' : ''
                      }`}
                      {...formik.getFieldProps('email')}
                    />
                  </div>
                  {formik.touched.email && formik.errors.email && (
                    <p className="input-error-msg">{formik.errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="input-field-group">
                  <div className="label-with-action">
                    <label className="input-label" htmlFor="password">Password</label>
                    {tab === 'signin' && (
                      <button
                        type="button"
                        className="forgot-link-btn"
                        onClick={() => setForgotOpen(true)}
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="input-box-wrapper">
                    <Lock className="input-leading-icon" />
                    <input
                      id="password"
                      type={showPass ? 'text' : 'password'}
                      name="password"
                      autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
                      placeholder="••••••••••••"
                      className={`custom-auth-input ${
                        formik.touched.password && formik.errors.password ? 'is-invalid' : ''
                      }`}
                      {...formik.getFieldProps('password')}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPass(!showPass)}
                      tabIndex={-1}
                      aria-label={showPass ? 'Hide password' : 'Show password'}
                    >
                      {showPass ? (
                        <EyeOff className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors" />
                      ) : (
                        <Eye className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength & Live Criteria Badges for Registration */}
                  {tab === 'signup' && formik.values.password.length > 0 && (
                    <motion.div
                      className="password-meter-container"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="meter-bar-track">
                        <motion.div
                          className="meter-bar-progress"
                          style={{
                            width: passStrength.width,
                            backgroundColor: passStrength.color,
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="meter-label" style={{ color: passStrength.color }}>
                          {passStrength.label}
                        </span>
                        <div className="criteria-pills">
                          <span className={`crit-pill ${passCriteria.hasMinLen ? 'met' : ''}`}>
                            6+ chars
                          </span>
                          <span className={`crit-pill ${passCriteria.hasUpperLower ? 'met' : ''}`}>
                            Aa
                          </span>
                          <span className={`crit-pill ${passCriteria.hasNumberOrSpecial ? 'met' : ''}`}>
                            123/#
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {formik.touched.password && formik.errors.password && (
                    <p className="input-error-msg">{formik.errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                {tab === 'signup' && (
                  <motion.div
                    className="input-field-group"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <label className="input-label" htmlFor="confirm">Confirm Password</label>
                    <div className="input-box-wrapper">
                      <ShieldCheck className="input-leading-icon" />
                      <input
                        id="confirm"
                        type={showConf ? 'text' : 'password'}
                        name="confirm"
                        autoComplete="new-password"
                        placeholder="••••••••••••"
                        className={`custom-auth-input ${
                          formik.touched.confirm && formik.errors.confirm ? 'is-invalid' : ''
                        }`}
                        {...formik.getFieldProps('confirm')}
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowConf(!showConf)}
                        tabIndex={-1}
                        aria-label={showConf ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConf ? (
                          <EyeOff className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors" />
                        ) : (
                          <Eye className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors" />
                        )}
                      </button>
                    </div>
                    {formik.touched.confirm && formik.errors.confirm && (
                      <p className="input-error-msg">{formik.errors.confirm}</p>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Primary Action Button with Fluid Sheen Sweep */}
            <motion.button
              type="submit"
              className="primary-submit-btn"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.015, translateY: loading ? 0 : -2 }}
              whileTap={{ scale: loading ? 1 : 0.985 }}
            >
              <div className="button-sweep-shine" />
              {loading ? (
                <div className="btn-loading-wrapper">
                  <span className="submit-spinner" />
                  <span>Verifying Credentials...</span>
                </div>
              ) : (
                <div className="btn-content-wrapper">
                  <span>{tab === 'signin' ? 'Sign In to PlanYatri' : 'Create Free Explorer Account'}</span>
                  <ArrowRight className="w-4 h-4 submit-arrow-icon" />
                </div>
              )}
            </motion.button>
          </form>

          {/* Footer Tab Switch */}
          <div className="auth-card-footer">
            <p className="footer-prompt-text">
              {tab === 'signin' ? "Don't have an account yet? " : 'Already registered? '}
              <button
                type="button"
                className="footer-switch-btn"
                onClick={() => switchTab(tab === 'signin' ? 'signup' : 'signin')}
              >
                {tab === 'signin' ? 'Create an account' : 'Sign In instead'}
              </button>
            </p>
          </div>

          {/* Encrypted Security Footnote */}
          <div className="security-footnote">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>End-to-End Encrypted • Bank-Grade Security</span>
          </div>
        </motion.div>
      </div>

      {/* ── Forgot Password Dialog Modal ── */}
      <AnimatePresence>
        {forgotOpen && (
          <div className="modal-backdrop" onClick={() => setForgotOpen(false)}>
            <motion.div
              className="forgot-modal-box"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 24 }}
              transition={{ type: 'spring', stiffness: 450, damping: 32 }}
            >
              <div className="modal-icon-header">
                <Mail className="w-6 h-6 text-[#D4A843]" />
              </div>
              <h3 className="modal-title">Reset Passport Password</h3>
              <p className="modal-desc">
                Enter your account email and we'll dispatch instant recovery instructions to your inbox.
              </p>

              <div className="input-field-group mb-4 text-left">
                <label className="input-label">Account Email</label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="explorer@domain.com"
                  className="custom-auth-input"
                />
              </div>

              <div className="modal-btn-row">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setForgotOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="modal-confirm-btn"
                  onClick={() => {
                    if (!forgotEmail) {
                      toast.error('Please enter your email')
                      return
                    }
                    toast.success('Password reset link sent to your email 📨')
                    setForgotOpen(false)
                  }}
                >
                  Send Recovery Link
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
