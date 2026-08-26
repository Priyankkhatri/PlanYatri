import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { logout } from '../store/slices/authSlice'
import { MoonIcon, SunIcon, GiftIcon, LogoutIcon } from './icons/LuxuryIcons'
import {
  LayoutDashboard,
  Compass,
  Briefcase,
  CalendarCheck,
  Heart,
  MessageSquare,
  Sparkles,
  Settings,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User
} from 'lucide-react'
import './Sidebar.css'

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',    path: '/dashboard',    Icon: LayoutDashboard },
  { id: 'destinations', label: 'Destinations', path: '/destinations', Icon: Compass },
  { id: 'trips',        label: 'Trips',        path: '/trips',        Icon: Briefcase },
  { id: 'bookings',     label: 'Bookings',     path: '/bookings',     Icon: CalendarCheck },
  { id: 'favorites',    label: 'Favorites',    path: '/favorites',    Icon: Heart },
  { id: 'messages',     label: 'Messages',     path: '/messages',     Icon: MessageSquare, badge: 3 },
  { id: 'travel-style', label: 'Travel Style', path: '/travel-style', Icon: Sparkles },
  { id: 'settings',     label: 'Settings',     path: '/settings',     Icon: Settings },
  { id: 'emergency',    label: 'Emergency',    path: '/emergency',    Icon: ShieldAlert },
]

export default function Sidebar() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const dispatch   = useDispatch()
  const { dark, toggle } = useTheme()
  const { userInfo } = useSelector((state) => state.auth)
  const [collapsed, setCollapsed] = useState(false)

  const displayName = userInfo?.name || 'Explorer'
  const avatarSrc   = userInfo?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&q=80&auto=format&fit=crop'
  const firstName   = displayName.split(' ')[0]

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <motion.aside
      className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28, delay: 0.05 }}
    >
      {/* Brand Logo Header */}
      <div className="sb-logo" onClick={() => navigate('/dashboard')}>
        {!collapsed ? (
          <div className="sb-logo-wanderlust">
            <span className="sb-logo-title">PLANYATRI</span>
            <span className="sb-logo-subtitle">LUXURY EXPEDITIONS</span>
          </div>
        ) : (
          <div className="sb-logo-mark">
            <span className="font-extrabold text-[#D4A843] text-lg">P</span>
          </div>
        )}
        <button
          type="button"
          className="sb-collapse-btn"
          onClick={e => { e.stopPropagation(); setCollapsed(p => !p) }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="sb-nav">
        {NAV.map(item => {
          const isActive = location.pathname === item.path
          const ItemIcon = item.Icon

          return (
            <motion.button
              key={item.id}
              className={`sb-item relative ${isActive ? 'sb-item--active' : ''}`}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : ''}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-[#D4A843]/10 rounded-xl border-l-[3px] border-[#D4A843]"
                  layoutId="activeNavHighlight"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}

              <span className={`sb-item-icon relative z-10 ${isActive ? 'text-[#D4A843]' : 'text-slate-500'}`}>
                <ItemIcon className="w-4 h-4" />
              </span>

              {!collapsed && (
                <span className={`sb-item-label relative z-10 ${isActive ? 'font-bold text-slate-900 dark:text-white' : ''}`}>
                  {item.label}
                </span>
              )}

              {!collapsed && item.badge && !isActive && (
                <span className="sb-badge relative z-10">{item.badge}</span>
              )}
              {collapsed && item.badge && (
                <span className="sb-badge sb-badge--dot relative z-10" />
              )}
            </motion.button>
          )
        })}
      </nav>

      {/* Bottom Profile / Quick Menu */}
      {!collapsed && (
        <div className="sb-bottom">
          <div className="sb-theme-row">
            <span className="sb-theme-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {dark ? <MoonIcon size={14} color="#A1A1AA" /> : <SunIcon size={14} color="#D4A843" />}
              {dark ? 'Dark' : 'Light'} Mode
            </span>
            <button className={`sb-toggle ${dark ? 'sb-toggle--on' : ''}`} onClick={toggle} aria-label="Toggle Theme">
              <span className="sb-toggle-thumb" />
            </button>
          </div>

          <div className="sb-referral" onClick={() => navigate('/profile')}>
            <div className="sb-referral-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GiftIcon size={16} color="#D4A843" />
            </div>
            <div>
              <p className="sb-referral-title">Explorer Rewards</p>
              <p className="sb-referral-desc">Invite companions & earn perks</p>
            </div>
          </div>

          <div className="sb-profile" onClick={() => navigate('/profile')}>
            <img src={avatarSrc} className="sb-avatar" alt={displayName} />
            <div className="sb-profile-info">
              <p className="sb-profile-name">{displayName}</p>
              <p className="sb-profile-role">Passport Active</p>
            </div>
          </div>

          <button className="sb-logout" onClick={handleLogout}>
            <LogOut className="w-3.5 h-3.5 text-red-500" />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {collapsed && (
        <div className="sb-collapsed-bottom">
          <button className={`sb-icon-btn ${dark ? 'sb-icon-btn--active' : ''}`} onClick={toggle} title="Toggle theme">
            {dark ? <MoonIcon size={14} /> : <SunIcon size={14} />}
          </button>
          <img src={avatarSrc} className="sb-avatar" alt={firstName} onClick={() => navigate('/profile')} style={{ cursor:'pointer' }} />
          <button className="sb-icon-btn sb-icon-btn--danger" onClick={handleLogout} title="Logout">
            <LogOut className="w-3.5 h-3.5 text-red-500" />
          </button>
        </div>
      )}
    </motion.aside>
  )
}
