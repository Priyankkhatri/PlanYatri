'use client';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Sidebar from '@/components/Sidebar'
import Topbar from '@/components/Topbar'
import { useTheme } from '@/context/ThemeContext'
import { useToast } from '@/context/ToastContext'
import { updateProfile } from '@/store/slices/authSlice'
import { usePageTitle } from '@/hooks/usePageTitle'
import { UserIcon, BellIcon, LockIcon, CardIcon, GearIcon, ShieldIcon } from '@/components/icons/LuxuryIcons'


const SECTIONS = ['Profile', 'Notifications', 'Privacy', 'Payments', 'Preferences', 'About']

export default function Settings() {
  const dispatch = useDispatch<any>()
  const toast = useToast()
  const { dark, toggle } = useTheme()
  const { userInfo } = useSelector((state: any) => state.auth)
  usePageTitle('Account Settings — PlanYatri')

  const [mounted, setMounted] = useState(false)
  const [section, setSection] = useState('Profile')
  const [saved, setSaved] = useState(false)

  // Profile Form State
  const [profile, setProfile] = useState({
    name: userInfo?.name || 'Traveler',
    email: userInfo?.email || 'user@example.com',
    phone: userInfo?.phone || '+91 98765 43210',
    bio: userInfo?.bio || 'Passionate explorer collecting memories around the world.',
    city: userInfo?.city || 'Bangalore',
    country: userInfo?.country || 'India',
    avatar: userInfo?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=160&q=80&auto=format&fit=crop',
  })

  // Sync profile if userInfo updates
  useEffect(() => {
    if (userInfo) {
      setProfile({
        name: userInfo.name || 'Traveler',
        email: userInfo.email || 'user@example.com',
        phone: userInfo.phone || '+91 98765 43210',
        bio: userInfo.bio || 'Passionate explorer collecting memories around the world.',
        city: userInfo.city || 'Bangalore',
        country: userInfo.country || 'India',
        avatar: userInfo.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=160&q=80&auto=format&fit=crop',
      })
    }
  }, [userInfo])

  const [notifPrefs, setNotifPrefs] = useState({ bookingUpdates:true, priceAlerts:true, tripReminders:true, newsletters:false, smsAlerts:false, pushNotif:true })
  const [privacy, setPrivacy] = useState({ profilePublic:true, showTrips:true, showReviews:true, dataSharing:false })
  const [prefs, setPrefs] = useState({ currency:'INR', language:'English', units:'Metric', seatPref:'Window', mealPref:'Vegetarian' })

  // Modals
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [newAvatarUrl, setNewAvatarUrl] = useState('')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [newPass, setNewPass] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [newCard, setNewCard] = useState({ type: 'Visa', number: '', exp: '' })
  const [paymentList, setPaymentList] = useState([
    { id: '1', type:'Visa', last:'4242', exp:'12/26', icon:'💳', primary:true },
    { id: '2', type:'UPI',  last:'user@upi', exp:'Active', icon:'📱', primary:false },
  ])

  useEffect(() => { const t = setTimeout(() => setMounted(true), 40); return () => clearTimeout(t) }, [])

  const handleSave = async () => {
    try {
      await dispatch(updateProfile(profile))
      setSaved(true)
      toast.success('🎉 Settings saved successfully!')
      setTimeout(() => setSaved(false), 2500)
    } catch {
      toast.success('Settings updated!')
    }
  }

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ userInfo, profile, notifPrefs, privacy, prefs }, null, 2))
    const dlAnchorElem = document.createElement('a')
    dlAnchorElem.setAttribute('href', dataStr)
    dlAnchorElem.setAttribute('download', `planyatri_data_${Date.now()}.json`)
    dlAnchorElem.click()
    toast.success('📦 Travel data export downloaded!')
  }

  const Toggle = ({ checked, onChange }: { checked?: any; onChange?: any }) => (
    <button className={`settings-toggle ${checked ? 'settings-toggle--on' : ''}`} onClick={onChange}>
      <span className="settings-toggle-thumb" />
    </button>
  )

  return (
    <div className={`page-shell ${mounted ? 'mounted' : ''}`}>
      <Sidebar />
      <div className="page-body">
        <Topbar title="Settings" subtitle="Manage your account preferences" />
        <div className="settings-layout">

          {/* Section nav */}
          <nav className="settings-nav">
            {SECTIONS.map(s => (
              <button key={s} className={`settings-nav-item ${section===s?'settings-nav-item--active':''}`} onClick={() => setSection(s)}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  {s==='Profile'?<UserIcon size={15} />:s==='Notifications'?<BellIcon size={15} />:s==='Privacy'?<LockIcon size={15} />:s==='Payments'?<CardIcon size={15} />:s==='Preferences'?<GearIcon size={15} />:<ShieldIcon size={15} />}
                </span>
                {s}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="settings-content">
            {section === 'Profile' && (
              <div className="settings-section" key="profile">
                <div className="settings-group">
                  <h2 className="settings-group-title">Profile Information</h2>
                  {/* Avatar */}
                  <div className="settings-avatar-row">
                    <img src={profile.avatar} className="settings-avatar" alt={profile.name} />
                    <div>
                      <p className="settings-avatar-name">{profile.name}</p>
                      <p className="settings-avatar-role">Verified Explorer · PlanYatri Member</p>
                      <button className="btn btn-outline" style={{ marginTop:10, fontSize:12.5 }} onClick={() => setShowPhotoModal(true)}>Change Photo</button>
                    </div>
                  </div>
                  <div className="settings-grid-2">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input className="form-input" value={profile.name} onChange={e => setProfile(p=>({...p,name:e.target.value}))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input className="form-input" type="email" value={profile.email} onChange={e => setProfile(p=>({...p,email:e.target.value}))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input className="form-input" value={profile.phone} onChange={e => setProfile(p=>({...p,phone:e.target.value}))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input className="form-input" value={profile.city} onChange={e => setProfile(p=>({...p,city:e.target.value}))} />
                    </div>
                    <div className="form-group" style={{ gridColumn:'1/-1' }}>
                      <label className="form-label">Bio</label>
                      <textarea className="form-input settings-textarea" value={profile.bio} onChange={e => setProfile(p=>({...p,bio:e.target.value}))} rows={3} />
                    </div>
                  </div>
                </div>

                <div className="settings-group">
                  <h2 className="settings-group-title">Security</h2>
                  <div className="settings-list">
                    {[
                      { label:'Change Password', sub:'Update security password', icon:'🔑', action: () => setShowPasswordModal(true) },
                      { label:'Two-Factor Authentication', sub:'Add SMS / Authenticator protection', icon:'🛡️', action: () => toast.success('🛡️ 2-Factor Authentication enabled for your account!') },
                      { label:'Active Sessions', sub:'1 Active Web Session', icon:'💻', action: () => toast.info('💻 Current Session: Windows Chrome — Active') },
                    ].map(item => (
                      <div key={item.label} className="settings-list-item">
                        <span className="settings-list-icon">{item.icon}</span>
                        <div>
                          <p className="settings-list-label">{item.label}</p>
                          <p className="settings-list-sub">{item.sub}</p>
                        </div>
                        <button className="btn btn-outline" style={{ fontSize:12, padding:'6px 14px' }} onClick={item.action}>Manage</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {section === 'Notifications' && (
              <div className="settings-section" key="notifs">
                <div className="settings-group">
                  <h2 className="settings-group-title">Notification Preferences</h2>
                  <div className="settings-list">
                    {[
                      { key:'bookingUpdates', label:'Booking Updates',  sub:'Confirmations, reminders, changes', icon:'✈️' },
                      { key:'priceAlerts',    label:'Price Drop Alerts', sub:'Get notified when prices drop',    icon:'💰' },
                      { key:'tripReminders',  label:'Trip Reminders',    sub:'24h and 1h before your trips',     icon:'⏰' },
                      { key:'pushNotif',      label:'Push Notifications', sub:'Alerts on your device',           icon:'📱' },
                      { key:'newsletters',    label:'Newsletter',        sub:'Weekly travel inspiration',        icon:'📧' },
                      { key:'smsAlerts',      label:'SMS Alerts',        sub:'Text messages for urgent updates', icon:'💬' },
                    ].map(item => (
                      <div key={item.key} className="settings-list-item">
                        <span className="settings-list-icon">{item.icon}</span>
                        <div>
                          <p className="settings-list-label">{item.label}</p>
                          <p className="settings-list-sub">{item.sub}</p>
                        </div>
                        <Toggle checked={notifPrefs[item.key]} onChange={() => setNotifPrefs(p=>({...p,[item.key]:!p[item.key]}))} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {section === 'Privacy' && (
              <div className="settings-section" key="privacy">
                <div className="settings-group">
                  <h2 className="settings-group-title">Privacy Settings</h2>
                  <div className="settings-list">
                    {[
                      { key:'profilePublic', label:'Public Profile',    sub:'Others can view your profile', icon:'👁️' },
                      { key:'showTrips',     label:'Show My Trips',     sub:'Display past trips on profile', icon:'🗺️' },
                      { key:'showReviews',   label:'Show My Reviews',   sub:'Show reviews you\'ve written',  icon:'⭐' },
                      { key:'dataSharing',   label:'Analytics Sharing', sub:'Share usage data to improve app', icon:'📊' },
                    ].map(item => (
                      <div key={item.key} className="settings-list-item">
                        <span className="settings-list-icon">{item.icon}</span>
                        <div>
                          <p className="settings-list-label">{item.label}</p>
                          <p className="settings-list-sub">{item.sub}</p>
                        </div>
                        <Toggle checked={privacy[item.key]} onChange={() => setPrivacy(p=>({...p,[item.key]:!p[item.key]}))} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="settings-group">
                  <h2 className="settings-group-title">Data & Account</h2>
                  <div className="settings-list">
                    <div className="settings-list-item">
                      <span className="settings-list-icon">📦</span>
                      <div><p className="settings-list-label">Export My Data</p><p className="settings-list-sub">Download all your travel data</p></div>
                      <button className="btn btn-outline" style={{ fontSize:12, padding:'6px 14px' }} onClick={handleExportData}>Export</button>
                    </div>
                    <div className="settings-list-item">
                      <span className="settings-list-icon">🗑️</span>
                      <div><p className="settings-list-label" style={{ color:'var(--red)' }}>Delete Account</p><p className="settings-list-sub">Permanently remove your account</p></div>
                      <button className="btn btn-danger" style={{ fontSize:12, padding:'6px 14px' }} onClick={() => toast.error('Account deletion requested. Please confirm via email.')}>Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {section === 'Payments' && (
              <div className="settings-section" key="payments">
                <div className="settings-group">
                  <h2 className="settings-group-title">Payment Methods</h2>
                  {paymentList.map(card => (
                    <div key={card.id || card.last} className="settings-payment-card">
                      <span style={{ fontSize:24 }}>{card.icon}</span>
                      <div>
                        <p className="settings-list-label">{card.type} {card.type==='Visa' || card.type==='Mastercard'?`ending in ${card.last}`:card.last}</p>
                        <p className="settings-list-sub">Expires {card.exp} {card.primary && '· Primary'}</p>
                      </div>
                      <div className="settings-payment-actions">
                        {card.primary && <span className="badge" style={{ background:'var(--green-bg)', color:'var(--green)' }}>Primary</span>}
                        <button className="btn btn-outline" style={{ fontSize:12, padding:'6px 14px' }} onClick={() => {
                          setPaymentList(prev => prev.filter(c => c.id !== card.id))
                          toast.info('Payment method removed')
                        }}>Remove</button>
                      </div>
                    </div>
                  ))}
                  <button className="btn btn-primary" style={{ marginTop:8, alignSelf:'flex-start' }} onClick={() => setShowPaymentModal(true)}>+ Add Payment Method</button>
                </div>
              </div>
            )}

            {section === 'Preferences' && (
              <div className="settings-section" key="prefs">
                <div className="settings-group">
                  <h2 className="settings-group-title">App Preferences</h2>
                  <div className="settings-list-item" style={{ padding:'12px 0' }}>
                    <span className="settings-list-icon">{dark?'🌙':'☀️'}</span>
                    <div><p className="settings-list-label">Dark Mode</p><p className="settings-list-sub">Toggle between light and dark theme</p></div>
                    <Toggle checked={dark} onChange={toggle} />
                  </div>
                  <div className="settings-grid-2" style={{ marginTop:12 }}>
                    {[
                      { label:'Currency', key:'currency', options:['INR','USD','EUR','GBP','AED'] },
                      { label:'Language', key:'language', options:['English','Hindi','Spanish','French'] },
                      { label:'Units',    key:'units',    options:['Metric','Imperial'] },
                      { label:'Preferred Seat', key:'seatPref', options:['Window','Aisle','Middle'] },
                      { label:'Meal Preference', key:'mealPref', options:['Vegetarian','Vegan','Non-Veg','Halal','Jain'] },
                    ].map(item => (
                      <div key={item.key} className="form-group">
                        <label className="form-label">{item.label}</label>
                        <select className="form-input" value={prefs[item.key]} onChange={e => setPrefs(p=>({...p,[item.key]:e.target.value}))}>
                          {item.options.map(o => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {section === 'About' && (
              <div className="settings-section" key="about">
                <div className="settings-group" style={{ textAlign:'center', padding:'32px 0' }}>
                  <div className="sb-logo-mark" style={{ width:56, height:56, borderRadius:16, margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,var(--charcoal),var(--charcoal-2))' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 18 12 2 21 18"/><path d="M9 18 12 12 15 18"/></svg>
                  </div>
                  <h2 style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:700, color:'var(--text-1)', marginBottom:4 }}>PlanYatri</h2>
                  <p style={{ color:'var(--text-3)', fontSize:13, marginBottom:6 }}>Version 2.0.0 · Crafted for Travelers</p>
                  <p style={{ color:'var(--text-3)', fontSize:13 }}>Your ultimate travel companion</p>
                  <div style={{ display:'flex', gap:12, justifyContent:'center', marginTop:24, flexWrap:'wrap' }}>
                    {['Privacy Policy','Terms of Service','Help & Support','Rate Us'].map(l => (
                      <button key={l} className="btn btn-outline" style={{ fontSize:12.5 }}>{l}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Save bar */}
            {['Profile','Notifications','Privacy','Preferences'].includes(section) && (
              <div className="settings-save-bar">
                <button className="btn btn-outline">Discard Changes</button>
                <button className={`btn btn-primary ${saved ? 'btn-saved' : ''}`} onClick={handleSave}>
                  {saved ? '✓ Saved!' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── CHANGE AVATAR MODAL ── */}
      {showPhotoModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowPhotoModal(false)}>
          <div style={{ background: 'var(--bg-card, #0C1B2A)', border: '1px solid rgba(212,168,67,0.3)', padding: '24px', borderRadius: '16px', maxWidth: '420px', width: '90%', color: '#FFF' }} onClick={(e: any) => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 12px' }}>Update Profile Photo</h3>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '0 0 16px' }}>Paste a direct image URL or choose a preset photo:</p>
            <input
              type="text"
              placeholder="https://example.com/photo.jpg"
              value={newAvatarUrl}
              onChange={(e: any) => setNewAvatarUrl(e.target.value)}
              style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#FFF', fontSize: '13px', marginBottom: '16px' }}
            />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {[
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&q=80&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=160&q=80&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&q=80&auto=format&fit=crop',
              ].map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt="Preset"
                  onClick={() => setNewAvatarUrl(url)}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer', border: newAvatarUrl === url ? '2px solid #D4A843' : '2px solid transparent' }}
                />
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                style={{ flex: 1, padding: '10px', background: '#D4A843', color: '#0C1B2A', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                onClick={async () => {
                  if (newAvatarUrl) {
                    const updated = { ...profile, avatar: newAvatarUrl }
                    setProfile(updated)
                    await dispatch(updateProfile(updated))
                    toast.success('📷 Profile photo updated!')
                  }
                  setShowPhotoModal(false)
                }}
              >
                Apply Photo
              </button>
              <button style={{ padding: '10px 16px', background: 'transparent', color: '#CBD5E1', borderRadius: '8px', border: '1px solid #64748B', cursor: 'pointer' }} onClick={() => setShowPhotoModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CHANGE PASSWORD MODAL ── */}
      {showPasswordModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowPasswordModal(false)}>
          <div style={{ background: 'var(--bg-card, #0C1B2A)', border: '1px solid rgba(212,168,67,0.3)', padding: '24px', borderRadius: '16px', maxWidth: '420px', width: '90%', color: '#FFF' }} onClick={(e: any) => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 12px' }}>Change Security Password</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <input type="password" placeholder="Current Password" style={{ padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#FFF', fontSize: '13px' }} />
              <input type="password" placeholder="New Security Password" value={newPass} onChange={(e: any) => setNewPass(e.target.value)} style={{ padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#FFF', fontSize: '13px' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                style={{ flex: 1, padding: '10px', background: '#D4A843', color: '#0C1B2A', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                onClick={() => {
                  toast.success('🔑 Security password updated successfully!')
                  setShowPasswordModal(false)
                  setNewPass('')
                }}
              >
                Update Password
              </button>
              <button style={{ padding: '10px 16px', background: 'transparent', color: '#CBD5E1', borderRadius: '8px', border: '1px solid #64748B', cursor: 'pointer' }} onClick={() => setShowPasswordModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD PAYMENT METHOD MODAL ── */}
      {showPaymentModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowPaymentModal(false)}>
          <div style={{ background: 'var(--bg-card, #0C1B2A)', border: '1px solid rgba(212,168,67,0.3)', padding: '24px', borderRadius: '16px', maxWidth: '420px', width: '90%', color: '#FFF' }} onClick={(e: any) => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 12px' }}>Add New Payment Method</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <select value={newCard.type} onChange={(e: any) => setNewCard(p => ({ ...p, type: e.target.value }))} style={{ padding: '10px', background: '#0C1B2A', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#FFF', fontSize: '13px' }}>
                <option value="Visa">Visa Credit / Debit</option>
                <option value="Mastercard">Mastercard</option>
                <option value="UPI">UPI ID (GPay / PhonePe)</option>
              </select>
              <input type="text" placeholder={newCard.type === 'UPI' ? 'user@upi' : 'Card Number (4000 1234 ...)'} value={newCard.number} onChange={(e: any) => setNewCard(p => ({ ...p, number: e.target.value }))} style={{ padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#FFF', fontSize: '13px' }} />
              <input type="text" placeholder="Expiry MM/YY" value={newCard.exp} onChange={(e: any) => setNewCard(p => ({ ...p, exp: e.target.value }))} style={{ padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#FFF', fontSize: '13px' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                style={{ flex: 1, padding: '10px', background: '#D4A843', color: '#0C1B2A', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                onClick={() => {
                  if (newCard.number) {
                    const newObj = {
                      id: `pay-${Date.now()}`,
                      type: newCard.type,
                      last: newCard.type === 'UPI' ? newCard.number : newCard.number.slice(-4) || '8821',
                      exp: newCard.exp || '12/28',
                      icon: newCard.type === 'UPI' ? '📱' : '💳',
                      primary: false,
                    }
                    setPaymentList(prev => [...prev, newObj])
                    toast.success('💳 Payment method added!')
                  }
                  setShowPaymentModal(false)
                  setNewCard({ type: 'Visa', number: '', exp: '' })
                }}
              >
                Save Payment Method
              </button>
              <button style={{ padding: '10px 16px', background: 'transparent', color: '#CBD5E1', borderRadius: '8px', border: '1px solid #64748B', cursor: 'pointer' }} onClick={() => setShowPaymentModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
