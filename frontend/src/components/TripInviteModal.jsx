// TripInviteModal.jsx — QR-based group invite system
// Leader generates QR → shares → others scan → join trip
import { useState, useEffect, useRef, useCallback } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { inviteService } from '../services/supabaseService'
import './TripInviteModal.css'

const ROLES = [
  { value: 'editor', label: '✏️ Editor', desc: 'Can edit itinerary & add activities' },
  { value: 'viewer', label: '👁️ Viewer', desc: 'Can view the trip only' },
]

export default function TripInviteModal({ trip, userId, onClose }) {
  const [invite, setInvite]       = useState(null)
  const [loading, setLoading]     = useState(false)
  const [copied, setCopied]       = useState(false)
  const [shared, setShared]       = useState(false)
  const [role, setRole]           = useState('viewer')
  const [maxUses, setMaxUses]     = useState(10)
  const [days, setDays]           = useState(7)
  const [activeTab, setActiveTab] = useState('qr')
  const [existingInvites, setExistingInvites] = useState([])
  const [qrPulse, setQrPulse]     = useState(false)
  const [revoking, setRevoking]   = useState(null)
  const timerRef = useRef()

  const isDemo = !trip?.id || trip.id.startsWith('trip_demo_') || trip.id.startsWith('journey-')
  const inviteUrl = invite ? inviteService.buildUrl(invite.token) : ''

  // ── Load existing invites ──
  const loadExisting = useCallback(async () => {
    if (isDemo || !trip?.id) return
    try {
      const rows = await inviteService.listForTrip(trip.id)
      setExistingInvites(rows)
    } catch {}
  }, [trip?.id, isDemo])

  useEffect(() => { loadExisting() }, [loadExisting])

  // ── Generate invite ──
  const generate = async () => {
    if (isDemo) {
      // Demo mode: fake token
      const fakeToken = `demo_${Math.random().toString(36).slice(2, 14)}`
      setInvite({ token: fakeToken, role, max_uses: maxUses, expires_at: new Date(Date.now() + days * 86400000).toISOString() })
      setQrPulse(true)
      timerRef.current = setTimeout(() => setQrPulse(false), 1500)
      return
    }
    setLoading(true)
    try {
      const newInvite = await inviteService.create(trip.id, userId, { role, maxUses, expiresInDays: days })
      setInvite(newInvite)
      setQrPulse(true)
      timerRef.current = setTimeout(() => setQrPulse(false), 1500)
      await loadExisting()
    } catch (e) {
      console.error('Invite creation failed:', e.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Copy to clipboard ──
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea')
      ta.value = inviteUrl
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  // ── Native share ──
  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join my trip: ${trip?.title || trip?.dest}`,
          text: `Hey! Join me on PlanYatri for our ${trip?.destination || trip?.dest} trip 🌍`,
          url: inviteUrl,
        })
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      } catch {}
    } else {
      copyLink()
    }
  }

  // ── Download QR as PNG ──
  const downloadQR = () => {
    const svg = document.querySelector('#invite-qr-svg svg')
    if (!svg) return
    const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `planyatri-invite-${trip?.dest?.replace(/\s/g, '-') || 'trip'}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── Revoke ──
  const revoke = async (inv) => {
    setRevoking(inv.id)
    try {
      await inviteService.revoke(inv.id)
      setExistingInvites(p => p.filter(i => i.id !== inv.id))
      if (invite?.id === inv.id) setInvite(null)
    } catch {}
    setRevoking(null)
  }

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const expiresLabel = invite
    ? new Date(invite.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''

  return (
    <div className="tim-backdrop" onClick={onClose}>
      <div className="tim-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="tim-header">
          <div className="tim-header-left">
            <div className="tim-icon">🔗</div>
            <div>
              <h2 className="tim-title">Invite to Trip</h2>
              <p className="tim-subtitle">{trip?.title || trip?.dest} · {trip?.destination || trip?.dest}</p>
            </div>
          </div>
          <button className="tim-close" onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div className="tim-tabs">
          {['qr', 'link', 'manage'].map(t => (
            <button
              key={t}
              className={`tim-tab ${activeTab === t ? 'active' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t === 'qr' ? '📱 QR Code' : t === 'link' ? '🔗 Share Link' : '⚙️ Manage'}
            </button>
          ))}
        </div>

        {/* QR TAB */}
        {activeTab === 'qr' && (
          <div className="tim-body">
            {!invite ? (
              <div className="tim-generate-section">
                <div className="tim-qr-placeholder">
                  <div className="tim-qr-ghost">
                    <span className="tim-qr-ghost-icon">📷</span>
                    <p>Generate a QR code to invite people</p>
                  </div>
                </div>

                <div className="tim-settings">
                  <div className="tim-setting-row">
                    <label className="tim-setting-label">Role</label>
                    <div className="tim-role-pills">
                      {ROLES.map(r => (
                        <button
                          key={r.value}
                          className={`tim-role-pill ${role === r.value ? 'active' : ''}`}
                          onClick={() => setRole(r.value)}
                        >
                          {r.label}
                          <span className="tim-role-desc">{r.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="tim-setting-row-inline">
                    <div className="tim-field">
                      <label>Max Uses</label>
                      <input
                        type="number" min={1} max={100} value={maxUses}
                        onChange={e => setMaxUses(Number(e.target.value))}
                        className="tim-input"
                      />
                    </div>
                    <div className="tim-field">
                      <label>Expires In</label>
                      <select value={days} onChange={e => setDays(Number(e.target.value))} className="tim-select">
                        <option value={1}>1 day</option>
                        <option value={3}>3 days</option>
                        <option value={7}>7 days</option>
                        <option value={30}>30 days</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button className="tim-generate-btn" onClick={generate} disabled={loading}>
                  {loading ? (
                    <span className="tim-loading-dots">Generating<span>.</span><span>.</span><span>.</span></span>
                  ) : (
                    <><span>✨</span> Generate QR Code</>
                  )}
                </button>
              </div>
            ) : (
              <div className="tim-qr-result">
                {/* Animated QR */}
                <div className={`tim-qr-wrapper ${qrPulse ? 'pulse' : ''}`}>
                  <div className="tim-qr-ring tim-ring-1" />
                  <div className="tim-qr-ring tim-ring-2" />
                  <div className="tim-qr-ring tim-ring-3" />
                  <div id="invite-qr-svg" className="tim-qr-card">
                    <QRCodeSVG
                      value={inviteUrl}
                      size={200}
                      bgColor="#FFFFFF"
                      fgColor="#1A1A1A"
                      level="H"
                      imageSettings={{
                        src: '/logo-sm.png',
                        x: undefined,
                        y: undefined,
                        height: 32,
                        width: 32,
                        excavate: true,
                      }}
                    />
                  </div>
                  <div className="tim-qr-scan-line" />
                </div>

                <div className="tim-invite-meta">
                  <span className="tim-meta-badge">{ROLES.find(r => r.value === invite.role)?.label || invite.role}</span>
                  <span className="tim-meta-badge">⏰ Expires {expiresLabel}</span>
                  <span className="tim-meta-badge">🎟️ {invite.max_uses} uses</span>
                </div>

                <div className="tim-qr-actions">
                  <button className="tim-action-btn tim-copy" onClick={copyLink}>
                    {copied ? '✓ Copied!' : '📋 Copy Link'}
                  </button>
                  <button className="tim-action-btn tim-share" onClick={shareLink}>
                    {shared ? '✓ Shared!' : '📤 Share'}
                  </button>
                  <button className="tim-action-btn tim-download" onClick={downloadQR}>
                    ⬇️ Download QR
                  </button>
                  <button className="tim-action-btn tim-regen" onClick={() => setInvite(null)}>
                    🔄 New Code
                  </button>
                </div>

                <div className="tim-url-display">
                  <span className="tim-url-text">{inviteUrl}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* LINK TAB */}
        {activeTab === 'link' && (
          <div className="tim-body">
            {!invite ? (
              <div className="tim-no-invite">
                <p>Generate a QR code first to get a shareable link.</p>
                <button className="tim-generate-btn" onClick={() => setActiveTab('qr')}>Go to QR Tab →</button>
              </div>
            ) : (
              <div className="tim-link-tab">
                <div className="tim-link-preview">
                  <div className="tim-link-icon">🌍</div>
                  <div className="tim-link-info">
                    <span className="tim-link-title">PlanYatri Trip Invite</span>
                    <span className="tim-link-desc">{trip?.title || trip?.dest} · {ROLES.find(r => r.value === invite.role)?.label}</span>
                  </div>
                </div>

                <div className="tim-link-box">
                  <input readOnly value={inviteUrl} className="tim-link-input" />
                  <button className="tim-link-copy-btn" onClick={copyLink}>
                    {copied ? '✓' : '📋'}
                  </button>
                </div>

                <div className="tim-share-apps">
                  <button className="tim-share-app" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Join my trip on PlanYatri! 🌍 ${inviteUrl}`)}`)} >
                    <span>💬</span> WhatsApp
                  </button>
                  <button className="tim-share-app" onClick={() => window.open(`mailto:?subject=Join my trip on PlanYatri&body=${encodeURIComponent(`Hey! I'd love you to join my trip on PlanYatri.\n\nClick here to join: ${inviteUrl}`)}`)} >
                    <span>📧</span> Email
                  </button>
                  <button className="tim-share-app" onClick={copyLink}>
                    <span>📋</span> Copy
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MANAGE TAB */}
        {activeTab === 'manage' && (
          <div className="tim-body">
            <h4 className="tim-manage-title">Active Invite Links</h4>
            {existingInvites.length === 0 ? (
              <div className="tim-no-invites">No active invite links. Create one in the QR tab.</div>
            ) : (
              <div className="tim-invite-list">
                {existingInvites.map(inv => (
                  <div key={inv.id} className="tim-invite-item">
                    <div className="tim-invite-item-main">
                      <span className="tim-invite-role">{ROLES.find(r => r.value === inv.role)?.label}</span>
                      <span className="tim-invite-uses">{inv.used_count}/{inv.max_uses} used</span>
                      <span className="tim-invite-exp">Expires {new Date(inv.expires_at).toLocaleDateString('en-IN')}</span>
                    </div>
                    <div className="tim-invite-token">...{inv.token.slice(-12)}</div>
                    <div className="tim-invite-item-actions">
                      <button
                        className="tim-inv-copy"
                        onClick={() => { navigator.clipboard.writeText(inviteService.buildUrl(inv.token)); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                      >
                        {copied ? '✓' : '📋 Copy'}
                      </button>
                      <button
                        className="tim-inv-revoke"
                        onClick={() => revoke(inv)}
                        disabled={revoking === inv.id}
                      >
                        {revoking === inv.id ? '...' : '🗑️ Revoke'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {isDemo && (
              <div className="tim-demo-notice">
                ℹ️ Sign in with a real account to create persistent invites.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
