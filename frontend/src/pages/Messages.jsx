// PlanYatri Messages & Co-Traveler QR Invite System
import { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { QRCodeSVG } from 'qrcode.react'
import Sidebar from '../components/Sidebar'
import api from '../services/api'
import { messageService, inviteService, tripService } from '../services/supabaseService'
import { connectSocket, disconnectSocket } from '../services/socket'
import { useToast } from '../context/ToastContext'
import {
  SparkleIcon,
  UsersIcon,
  MapPinIcon,
  CalendarIcon,
  ShieldIcon,
  CompassIcon,
  MountainIcon,
  WaveIcon,
  MonumentIcon,
  LeafIcon,
  CheckCircleIcon,
} from '../components/icons/LuxuryIcons'
import '../components/TripInviteModal.css'
import './Messages.css'

const ROLES = [
  { value: 'editor', label: '✏️ Editor', desc: 'Can edit itinerary & add activities' },
  { value: 'viewer', label: '👁️ Viewer', desc: 'Can view the trip only' },
]

export default function Messages() {
  const toast = useToast()
  const { userInfo } = useSelector((state) => state.auth)
  const userName = userInfo?.name ? userInfo.name.split(' ')[0] : 'Explorer'
  const userKey = userInfo?.id || userInfo?._id || userInfo?.email || 'guest'

  const [activeTab, setActiveTab] = useState('chats') // 'chats' | 'invite'
  const [contacts, setContacts] = useState(() => {
    try {
      const saved = localStorage.getItem(`planyatri_contacts_${userKey}`)
      if (saved) return JSON.parse(saved)
    } catch {}
    return [
      {
        id: 1,
        name: 'PlanYatri AI Concierge',
        role: '24/7 Private Travel Assistant',
        badge: 'VERIFIED CONCIERGE',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&q=80&auto=format&fit=crop',
        lastMsg: `Hello ${userName}! I am your 24/7 PlanYatri AI Concierge. How can I assist your trip today?`,
        time: 'Just now',
        unread: 1,
        online: true,
        category: 'Concierge',
      },
    ]
  })

  const [activeContactId, setActiveContactId] = useState(1)

  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem(`planyatri_conversations_${userKey}`)
      if (saved) return JSON.parse(saved)
    } catch {}
    return {
      1: [
        {
          id: 101,
          from: 'them',
          text: `Hello ${userName}! Welcome to PlanYatri. I am your 24/7 AI Travel Concierge. Tell me where you'd like to go, ask travel questions, or get customized trip plans!`,
          time: 'Just now',
        },
      ],
    }
  })

  // ── TRIP & QR INVITE STATE ──
  const [userTrips, setUserTrips] = useState([])
  const [selectedTripId, setSelectedTripId] = useState('')
  const [invite, setInvite] = useState(null)
  const [loadingInvite, setLoadingInvite] = useState(false)
  const [copiedInvite, setCopiedInvite] = useState(false)
  const [inviteRole, setInviteRole] = useState('viewer')
  const [maxUses, setMaxUses] = useState(10)
  const [expiresDays, setExpiresDays] = useState(7)
  const [existingInvites, setExistingInvites] = useState([])
  const [tripMembers, setTripMembers] = useState([])
  const [qrPulse, setQrPulse] = useState(false)
  const [revokingId, setRevokingId] = useState(null)

  // Save contacts & conversations to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`planyatri_contacts_${userKey}`, JSON.stringify(contacts))
      localStorage.setItem(`planyatri_conversations_${userKey}`, JSON.stringify(conversations))
    } catch (e) {
      console.warn('Failed to save chat data:', e)
    }
  }, [contacts, conversations, userKey])

  // Load User's Real Trips for Invite Hub
  useEffect(() => {
    const fetchUserTrips = async () => {
      try {
        const trips = await tripService.getAll(userInfo?.id)
        if (trips && trips.length > 0) {
          setUserTrips(trips)
          setSelectedTripId(trips[0].id)
        } else {
          const fallback = {
            id: 'circle_main',
            dest: 'My Travel Circle',
            title: 'My Travel Circle',
            destination: 'Global Expeditions',
          }
          setUserTrips([fallback])
          setSelectedTripId('circle_main')
        }
      } catch {
        const fallback = {
          id: 'circle_main',
          dest: 'My Travel Circle',
          title: 'My Travel Circle',
          destination: 'Global Expeditions',
        }
        setUserTrips([fallback])
        setSelectedTripId('circle_main')
      }
    }
    fetchUserTrips()
  }, [userInfo?.id])

  const currentSelectedTrip = userTrips.find((t) => t.id === selectedTripId) || userTrips[0]
  const isDemoTrip = !currentSelectedTrip?.id || currentSelectedTrip.id.startsWith('circle_') || currentSelectedTrip.id.startsWith('journey-')
  const inviteUrl = invite
    ? inviteService.buildUrl(invite.token)
    : `${window.location.origin}/join/${currentSelectedTrip?.id || 'circle'}`

  // Load Invites and Members for Selected Trip
  const loadTripData = useCallback(async () => {
    if (!currentSelectedTrip?.id || isDemoTrip) return
    try {
      const rows = await inviteService.listForTrip(currentSelectedTrip.id)
      setExistingInvites(rows || [])
      const members = await tripService.getMembers(currentSelectedTrip.id)
      setTripMembers(members || [])
    } catch (e) {
      console.warn('Failed to load trip invite data:', e)
    }
  }, [currentSelectedTrip?.id, isDemoTrip])

  useEffect(() => {
    loadTripData()
  }, [loadTripData])

  // ── GENERATE QR & INVITE TOKEN ──
  const handleGenerateInvite = async () => {
    if (isDemoTrip) {
      const fakeToken = `token_${Math.random().toString(36).slice(2, 12)}`
      setInvite({
        id: `inv_${Date.now()}`,
        token: fakeToken,
        role: inviteRole,
        max_uses: maxUses,
        expires_at: new Date(Date.now() + expiresDays * 86400000).toISOString(),
      })
      setQrPulse(true)
      setTimeout(() => setQrPulse(false), 1200)
      toast.success('✨ Fresh QR Code & invite link created!')
      return
    }

    setLoadingInvite(true)
    try {
      const newInv = await inviteService.create(currentSelectedTrip.id, userInfo?.id, {
        role: inviteRole,
        maxUses,
        expiresInDays: expiresDays,
      })
      setInvite(newInv)
      setQrPulse(true)
      setTimeout(() => setQrPulse(false), 1200)
      await loadTripData()
      toast.success('✨ Trip invite token & QR code generated!')
    } catch (e) {
      toast.error(e.message || 'Failed to generate invite')
    } finally {
      setLoadingInvite(false)
    }
  }

  // ── COPY INVITE LINK ──
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopiedInvite(true)
      setTimeout(() => setCopiedInvite(false), 2200)
      toast.success('🔗 Invite link copied to clipboard!')
    } catch {
      toast.success('🔗 Invite link ready!')
    }
  }

  // ── WHATSAPP SHARE ──
  const handleWhatsAppShare = () => {
    const tripTitle = currentSelectedTrip?.dest || currentSelectedTrip?.title || 'Travel Expedition'
    const text = encodeURIComponent(
      `Hey! Join my trip "${tripTitle}" on PlanYatri 🌍\nClick the link or scan my QR to coordinate itinerary & bookings:\n${inviteUrl}`
    )
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
  }

  // ── DOWNLOAD QR CODE SVG ──
  const handleDownloadQR = () => {
    const svg = document.querySelector('#invite-hub-qr svg')
    if (!svg) {
      toast.error('Generate a QR code first.')
      return
    }
    const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `planyatri-qr-${(currentSelectedTrip?.dest || 'trip').replace(/\s/g, '-')}.svg`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('📥 QR code image downloaded!')
  }

  // ── REVOKE AN INVITE ──
  const handleRevokeInvite = async (inv) => {
    setRevokingId(inv.id)
    try {
      await inviteService.revoke(inv.id)
      setExistingInvites((prev) => prev.filter((i) => i.id !== inv.id))
      if (invite?.id === inv.id) setInvite(null)
      toast.success('Invite link revoked successfully.')
    } catch {
      toast.error('Failed to revoke invite.')
    } finally {
      setRevokingId(null)
    }
  }

  // ── START CHAT WITH JOINED CO-TRAVELER ──
  const handleStartChatWithMember = (member) => {
    const memberName = member.user?.name || member.user?.email || 'Co-Traveler'
    const memberId = member.user_id || `member_${Date.now()}`
    const existing = contacts.find((c) => c.id === memberId || c.name === memberName)

    if (!existing) {
      const newContact = {
        id: memberId,
        name: memberName,
        role: `Co-Traveler · ${currentSelectedTrip?.dest || 'Trip Member'}`,
        badge: member.role === 'editor' ? 'TRIP EDITOR' : 'TRIP VIEWER',
        avatar: member.user?.avatar_url || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&q=80&auto=format&fit=crop`,
        lastMsg: `Joined ${currentSelectedTrip?.dest || 'your trip'} via QR invite`,
        time: 'Just now',
        unread: 0,
        online: true,
        category: 'Buddy',
      }
      setContacts((prev) => [newContact, ...prev])
      setConversations((prev) => ({
        ...prev,
        [memberId]: [
          {
            id: Date.now(),
            from: 'them',
            text: `Hey ${userName}! I joined the "${currentSelectedTrip?.dest || 'trip'}" group via your QR invite. Excited to travel together!`,
            time: 'Just now',
          },
        ],
      }))
    }

    setActiveContactId(existing ? existing.id : memberId)
    setActiveTab('chats')
    toast.success(`💬 Chat opened with ${memberName}`)
  }

  // ── MESSAGING & SOCKET STATE ──
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showCallModal, setShowCallModal] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [showDossierModal, setShowDossierModal] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [typingUser, setTypingUser] = useState(null)
  const [socketConnected, setSocketConnected] = useState(false)

  const messagesEndRef = useRef(null)
  const callTimerRef = useRef(null)
  const socketRef = useRef(null)
  const typingTimerRef = useRef(null)

  const activeContact = contacts.find((c) => c.id === activeContactId) || contacts[0]
  const currentMessages = conversations[activeContactId] || []

  // Auto Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeContactId, currentMessages, isTyping])

  // Socket.io Real-Time + Supabase Persistence
  useEffect(() => {
    const room = `contact_${activeContactId}`
    const username = userInfo?.name || 'Explorer'

    const socket = connectSocket({
      room,
      username,
      onConnect: () => setSocketConnected(true),
      onDisconnect: () => setSocketConnected(false),
      onReceiveMessage: (msg) => {
        if (msg.username !== username) {
          setConversations((prev) => ({
            ...prev,
            [activeContactId]: [
              ...(prev[activeContactId] || []),
              { id: msg.id, from: 'them', text: msg.text, time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
            ],
          }))
        }
      },
      onUserJoined: ({ onlineUsers: users }) => setOnlineUsers(users || []),
      onUserLeft: ({ onlineUsers: users }) => setOnlineUsers(users || []),
      onUserTyping: ({ username: typer }) => setTypingUser(typer),
      onUserStopTyping: () => setTypingUser(null),
    })

    socketRef.current = socket

    return () => {
      disconnectSocket()
      socketRef.current = null
    }
  }, [activeContactId, userInfo?.name])

  // Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageInput.trim()) return

    const textToSend = messageInput.trim()
    const newMsg = {
      id: Date.now(),
      from: 'me',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setConversations((prev) => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMsg],
    }))

    setContacts((prev) =>
      prev.map((c) => (c.id === activeContactId ? { ...c, lastMsg: textToSend, time: newMsg.time } : c))
    )

    setMessageInput('')

    if (socketRef.current) {
      socketRef.current.emit('send_message', {
        room: `contact_${activeContactId}`,
        message: textToSend,
        username: userInfo?.name || 'Explorer',
        avatar: userInfo?.avatar || null,
      })
      socketRef.current.emit('stop_typing', {
        room: `contact_${activeContactId}`,
        username: userInfo?.name || 'Explorer',
      })
    }

    // Persist to Supabase
    try {
      await messageService.send({
        roomId: `contact_${activeContactId}`,
        userId: userInfo?.id || null,
        senderName: userInfo?.name || 'Explorer',
        text: textToSend,
        senderType: 'user',
        contactId: activeContactId,
      })
    } catch {}

    // Concierge AI Response
    if (activeContactId === 1) {
      setIsTyping(true)
      try {
        const res = await api.post('/gemini/concierge-reply', {
          message: textToSend,
          contactName: activeContact.name,
        })

        const replyContent =
          res.data?.reply ||
          'Certainly! Our luxury coordination desk has recorded your request and is confirming with our private partners.'

        setTimeout(async () => {
          setIsTyping(false)
          const aiReply = {
            id: Date.now() + 1,
            from: 'them',
            text: replyContent,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }

          setConversations((prev) => ({
            ...prev,
            [1]: [...(prev[1] || []), aiReply],
          }))

          setContacts((prev) =>
            prev.map((c) => (c.id === 1 ? { ...c, lastMsg: replyContent, time: aiReply.time } : c))
          )
        }, 1200)
      } catch {
        setIsTyping(false)
      }
    }
  }

  // Filter contacts by search
  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="msg-root">
      <Sidebar />

      <div className="msg-container">
        {/* ═════════════════════════════════════════════════════════════
            LEFT SIDEBAR: CHATS & INVITE CO-TRAVELERS TABS
        ═════════════════════════════════════════════════════════════ */}
        <aside className="msg-sidebar">
          <div className="msg-sidebar-header">
            <div className="msg-top-nav-tabs">
              <button
                className={`msg-nav-pill ${activeTab === 'chats' ? 'active' : ''}`}
                onClick={() => setActiveTab('chats')}
              >
                <span>Conversations</span>
                <span className="pill-count">{contacts.length}</span>
              </button>
              <button
                className={`msg-nav-pill ${activeTab === 'invite' ? 'active' : ''}`}
                onClick={() => setActiveTab('invite')}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <UsersIcon size={12} color="currentColor" /> Invite (QR)
                </span>
              </button>
            </div>

            <div className="msg-search-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8C867A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="msg-search-input"
              />
            </div>
          </div>

          <div className="msg-contacts-list">
            <div className="msg-category-header">
              <span>ACTIVE THREADS</span>
              <span style={{ fontSize: 10, color: '#22C55E' }}>● LIVE</span>
            </div>

            {filteredContacts.map((contact) => {
              const isActive = contact.id === activeContactId && activeTab === 'chats'
              return (
                <div
                  key={contact.id}
                  className={`msg-contact-card ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setActiveContactId(contact.id)
                    setActiveTab('chats')
                  }}
                >
                  <div className="msg-avatar-wrapper">
                    <img src={contact.avatar} alt={contact.name} className="msg-avatar-img" />
                    {contact.online && <span className="msg-online-badge" />}
                  </div>

                  <div className="msg-contact-info">
                    <div className="msg-info-top">
                      <h4 className="msg-contact-name">{contact.name}</h4>
                      <span className="msg-time-stamp">{contact.time}</span>
                    </div>

                    <p className="msg-preview-text">{contact.lastMsg}</p>

                    <div className="msg-badge-row">
                      <span className="msg-tag-badge">{contact.badge}</span>
                      {contact.unread > 0 && <span className="msg-unread-counter">{contact.unread}</span>}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Quick Invite Box */}
            <div
              onClick={() => setActiveTab('invite')}
              style={{
                margin: '16px 12px',
                padding: '12px 14px',
                borderRadius: 14,
                border: '1px dashed #D4A843',
                background: 'rgba(212, 168, 67, 0.06)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#D4A843', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#18181B', fontWeight: 800, fontSize: 14 }}>
                +
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, margin: 0, color: '#18181B' }}>Invite Co-Travelers</p>
                <p style={{ fontSize: 11, color: '#8C867A', margin: 0 }}>Generate QR & Share Link</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ═════════════════════════════════════════════════════════════
            RIGHT MAIN VIEW: CHAT INTERFACE OR QR INVITE HUB
        ═════════════════════════════════════════════════════════════ */}
        {activeTab === 'chats' ? (
          <main className="msg-chat-window">
            <header className="msg-chat-header">
              <div className="msg-header-left">
                <div className="msg-header-avatar-wrap">
                  <img src={activeContact.avatar} alt={activeContact.name} className="msg-header-avatar" />
                  {activeContact.online && <span className="msg-online-badge" />}
                </div>
                <div>
                  <div className="msg-header-name-row">
                    <h3 className="msg-header-name">{activeContact.name}</h3>
                    <span className="msg-header-badge">{activeContact.badge}</span>
                  </div>
                  <p className="msg-header-sub">
                    {typingUser ? `💬 ${typingUser} is typing...` : socketConnected ? '🟢 Connected to Real-Time Travel Room' : '🔒 End-to-End Encrypted Travel Channel'}
                  </p>
                </div>
              </div>

              <div className="msg-header-actions">
                <button
                  className="msg-hdr-btn"
                  title="Invite Co-Travelers via QR"
                  onClick={() => setActiveTab('invite')}
                  style={{ color: '#D4A843', fontWeight: 700, fontSize: 12 }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <UsersIcon size={13} color="#D4A843" /> 👥 Invite QR
                  </span>
                </button>

                <button
                  className="msg-hdr-btn"
                  title="Travel Dossier"
                  onClick={() => setShowDossierModal(true)}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </button>
              </div>
            </header>

            {/* Messages Stream */}
            <div className="msg-stream">
              <div className="msg-date-divider">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <ShieldIcon size={12} color="#D4A843" /> ENCRYPTED CONCIERGE & CO-TRAVELER LINK
                </span>
              </div>

              {currentMessages.map((msg) => {
                const isMe = msg.from === 'me'
                return (
                  <div key={msg.id} className={`msg-bubble-row ${isMe ? 'me' : 'them'}`}>
                    {!isMe && (
                      <img src={activeContact.avatar} alt="Avatar" className="msg-bubble-avatar" />
                    )}
                    <div className={`msg-bubble ${isMe ? 'msg-bubble-me' : 'msg-bubble-them'}`}>
                      <p className="msg-bubble-text">{msg.text}</p>
                      <span className="msg-bubble-time">
                        {msg.time} {isMe && '· ✓✓'}
                      </span>
                    </div>
                  </div>
                )
              })}

              {isTyping && (
                <div className="msg-bubble-row them">
                  <img src={activeContact.avatar} alt="Avatar" className="msg-bubble-avatar" />
                  <div className="msg-bubble msg-bubble-them typing-indicator-box">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <form className="msg-input-form" onSubmit={handleSendMessage}>
              <div className="msg-input-bar">
                <input
                  type="text"
                  className="msg-text-input"
                  placeholder={`Message ${activeContact.name}...`}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <button type="submit" className="msg-send-btn" disabled={!messageInput.trim()}>
                  <span>Send</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </form>
          </main>
        ) : (
          /* ═════════════════════════════════════════════════════════════
             CO-TRAVELER QR & INVITE HUB (CONNECTED TO TRIPS & SUPABASE)
          ═════════════════════════════════════════════════════════════ */
          <main className="msg-people-directory" style={{ padding: '36px 44px' }}>
            <header className="people-dir-header" style={{ marginBottom: 28 }}>
              <div>
                <span className="people-dir-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <UsersIcon size={12} color="#D4A843" /> TRIP COMPANIONS & QR HUB
                </span>
                <h2 className="people-dir-title">Invite Co-Travelers to Your Journey</h2>
                <p className="people-dir-sub">
                  Generate secure QR codes, copy instant invite links, and coordinate seamlessly with your travel companions.
                </p>
              </div>

              {/* Trip Selector Dropdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 240 }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#8C867A', letterSpacing: '0.08em' }}>SELECT TRIP TO INVITE TO</label>
                <select
                  value={selectedTripId}
                  onChange={(e) => {
                    setSelectedTripId(e.target.value)
                    setInvite(null)
                  }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 12,
                    border: '1.5px solid #EFEAE2',
                    background: '#FFFFFF',
                    color: '#18181B',
                    fontSize: 13.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  {userTrips.map((trip) => (
                    <option key={trip.id} value={trip.id}>
                      {trip.dest || trip.title || 'Travel Journey'}
                    </option>
                  ))}
                </select>
              </div>
            </header>

            {/* Main Interactive Invite Suite */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: 32, alignItems: 'start' }}>
              {/* Left Column: Animated Luxury QR Card */}
              <div
                style={{
                  background: '#18191E',
                  borderRadius: 24,
                  border: '1px solid rgba(212, 168, 67, 0.3)',
                  padding: 28,
                  boxShadow: '0 20px 48px rgba(0,0,0,0.25)',
                  color: '#FAF8F5',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 18 }}>📱</span>
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: '#D4A843', textTransform: 'uppercase' }}>
                    SCAN & JOIN TRIP
                  </span>
                </div>

                {/* QR Code Container with Pulse and Laser Animation */}
                <div
                  id="invite-hub-qr"
                  className={`tim-qr-container ${qrPulse ? 'pulse' : ''}`}
                  style={{
                    background: '#FFFFFF',
                    padding: 16,
                    borderRadius: 18,
                    boxShadow: '0 8px 32px rgba(212, 168, 67, 0.25)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'inline-block',
                    marginBottom: 16,
                  }}
                >
                  <QRCodeSVG
                    value={inviteUrl}
                    size={210}
                    level="H"
                    includeMargin={false}
                    fgColor="#18181B"
                    bgColor="#FFFFFF"
                  />
                  <div className="tim-laser-sweep" />
                </div>

                <h4 style={{ fontSize: 17, fontWeight: 700, color: '#FFFFFF', margin: '4px 0 2px' }}>
                  {currentSelectedTrip?.dest || currentSelectedTrip?.title}
                </h4>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: '0 0 18px' }}>
                  Role: <strong style={{ color: '#D4A843' }}>{inviteRole.toUpperCase()}</strong> · Max Uses: <strong>{maxUses}</strong>
                </p>

                {/* Primary Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
                  <button
                    onClick={handleCopyLink}
                    style={{
                      padding: '12px 18px',
                      background: copiedInvite ? '#22C55E' : '#D4A843',
                      color: '#18181B',
                      border: 'none',
                      borderRadius: 12,
                      fontSize: 13.5,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span>{copiedInvite ? '✓ Link Copied!' : '🔗 Copy Invite Link'}</span>
                  </button>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <button
                      onClick={handleWhatsAppShare}
                      style={{
                        padding: '10px 14px',
                        background: '#25D366',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: 10,
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      💬 WhatsApp
                    </button>
                    <button
                      onClick={handleDownloadQR}
                      style={{
                        padding: '10px 14px',
                        background: 'rgba(255,255,255,0.08)',
                        color: '#FFFFFF',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: 10,
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      📥 Download QR
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Invite Settings & Joined Members */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Invite Controls Box */}
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 20,
                    border: '1px solid #EFEAE2',
                    padding: 24,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div>
                      <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: '#18181B' }}>Invite Permissions & Expiry</h4>
                      <p style={{ fontSize: 12.5, color: '#8C867A', margin: 0 }}>Configure role and access parameters for newly generated links.</p>
                    </div>
                    <button
                      disabled={loadingInvite}
                      onClick={handleGenerateInvite}
                      style={{
                        padding: '9px 16px',
                        background: '#18181B',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: 10,
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: loadingInvite ? 'wait' : 'pointer',
                      }}
                    >
                      {loadingInvite ? 'Generating...' : '⚡ Generate New Token'}
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12 }}>
                    <div>
                      <label style={{ fontSize: 11.5, fontWeight: 700, color: '#18181B', display: 'block', marginBottom: 6 }}>
                        MEMBER ROLE
                      </label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {ROLES.map((r) => (
                          <button
                            key={r.value}
                            type="button"
                            onClick={() => setInviteRole(r.value)}
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              borderRadius: 8,
                              border: inviteRole === r.value ? '1.5px solid #D4A843' : '1px solid #EFEAE2',
                              background: inviteRole === r.value ? 'rgba(212,168,67,0.1)' : '#FFFFFF',
                              color: inviteRole === r.value ? '#B8860B' : '#666',
                              fontSize: 12.5,
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: 11.5, fontWeight: 700, color: '#18181B', display: 'block', marginBottom: 6 }}>
                        MAX USES ALLOWED
                      </label>
                      <select
                        value={maxUses}
                        onChange={(e) => setMaxUses(Number(e.target.value))}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #EFEAE2', fontSize: 13 }}
                      >
                        <option value={1}>1 person (Single use)</option>
                        <option value={5}>5 persons</option>
                        <option value={10}>10 persons (Standard)</option>
                        <option value={50}>50 persons (Group expedition)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Joined Co-Travelers Section */}
                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 20,
                    border: '1px solid #EFEAE2',
                    padding: 24,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div>
                      <h4 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: '#18181B' }}>
                        Joined Co-Travelers ({tripMembers.length + 1})
                      </h4>
                      <p style={{ fontSize: 12.5, color: '#8C867A', margin: 0 }}>Companions currently synchronized on this trip.</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {/* Current User Card */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: 12,
                        background: '#FAF8F5',
                        border: '1px solid #EFEAE2',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#D4A843', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#18181B', fontWeight: 800, fontSize: 13 }}>
                          {userName[0]}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: '#18181B' }}>{userInfo?.name || 'You'} (Leader)</p>
                          <p style={{ fontSize: 11, color: '#D4A843', margin: 0, fontWeight: 600 }}>★ TRIP CREATOR</p>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, background: '#18181B', color: '#FFF', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>Host</span>
                    </div>

                    {/* Joined Members */}
                    {tripMembers.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '24px 16px', color: '#8C867A', fontSize: 13 }}>
                        <p style={{ margin: '0 0 6px' }}>No other travelers have scanned or joined this trip yet.</p>
                        <p style={{ fontSize: 11.5, color: '#D4A843', fontWeight: 600, margin: 0 }}>
                          Share the QR code or invite link above to bring your friends on board!
                        </p>
                      </div>
                    ) : (
                      tripMembers.map((m) => (
                        <div
                          key={m.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            borderRadius: 12,
                            background: '#FAF8F5',
                            border: '1px solid #EFEAE2',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#18181B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: 700, fontSize: 13 }}>
                              {(m.user?.name || m.user?.email || 'T')[0]}
                            </div>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: '#18181B' }}>{m.user?.name || m.user?.email}</p>
                              <p style={{ fontSize: 11, color: '#8C867A', margin: 0 }}>Role: {m.role}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleStartChatWithMember(m)}
                            style={{
                              padding: '6px 12px',
                              background: '#D4A843',
                              color: '#18181B',
                              border: 'none',
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            💬 Message
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Active Invites Manager */}
                {existingInvites.length > 0 && (
                  <div
                    style={{
                      background: '#FFFFFF',
                      borderRadius: 20,
                      border: '1px solid #EFEAE2',
                      padding: 24,
                    }}
                  >
                    <h4 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 12px', color: '#18181B' }}>
                      Active Invite Tokens ({existingInvites.length})
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {existingInvites.map((inv) => (
                        <div
                          key={inv.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 12px',
                            borderRadius: 8,
                            border: '1px solid #EFEAE2',
                            fontSize: 12,
                          }}
                        >
                          <div>
                            <strong style={{ color: '#18181B' }}>Token: ...{inv.token.slice(-6)}</strong> · Role: {inv.role} · Uses: {inv.uses_count}/{inv.max_uses}
                          </div>
                          <button
                            disabled={revokingId === inv.id}
                            onClick={() => handleRevokeInvite(inv)}
                            style={{
                              padding: '4px 8px',
                              background: 'transparent',
                              color: '#EF4444',
                              border: '1px solid #EF4444',
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            {revokingId === inv.id ? 'Revoking...' : 'Revoke'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        )}

        {/* ═════════════════════════════════════════════════════════════
            MODAL 1: CONTACT DOSSIER MODAL
        ═════════════════════════════════════════════════════════════ */}
        {showDossierModal && (
          <div className="custom-modal-backdrop" onClick={() => setShowDossierModal(false)}>
            <div className="custom-modal-window" onClick={(e) => e.stopPropagation()}>
              <div className="cm-header">
                <div>
                  <span className="cm-badge-ai" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <ShieldIcon size={12} color="#D4A843" /> VERIFIED PLANYATRI PROFILE
                  </span>
                  <h3 className="cm-title">{activeContact.name}</h3>
                </div>
                <button className="cm-close" onClick={() => setShowDossierModal(false)}>✕</button>
              </div>

              <div className="dossier-modal-body">
                <div className="dossier-hero-row">
                  <img src={activeContact.avatar} alt={activeContact.name} className="dossier-avatar" />
                  <div>
                    <span className="dossier-badge-pill">{activeContact.badge}</span>
                    <h4 className="dossier-name">{activeContact.name}</h4>
                    <p className="dossier-role">{activeContact.role}</p>
                    <span className="dossier-status-text">
                      {activeContact.online ? '● Active in IST Zone' : '○ Verified Guide Available on Request'}
                    </span>
                  </div>
                </div>

                <div className="dossier-info-grid">
                  <div className="dig-col">
                    <span className="dig-lbl">SERVICE PROTOCOL</span>
                    <span className="dig-val">24/7 Priority Concierge & Itinerary Assistance</span>
                  </div>
                  <div className="dig-col">
                    <span className="dig-lbl">SECURITY CLEARANCE</span>
                    <span className="dig-val">Government Verified & Solo-Safe Certified</span>
                  </div>
                </div>

                <button
                  className="dossier-action-btn"
                  onClick={() => setShowDossierModal(false)}
                >
                  Return to Active Chat →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
