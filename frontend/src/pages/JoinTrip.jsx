import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { inviteService } from '../services/supabaseService'
import { MapPinIcon, CalendarIcon, UsersIcon, CheckCircleIcon, SparkleIcon } from '../components/icons/LuxuryIcons'
import './JoinTrip.css'

export default function JoinTrip() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { userInfo } = useSelector(s => s.auth)
  const userId = userInfo?.id

  const [inviteData, setInviteData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState(null)
  const [joinedSuccess, setJoinedSuccess] = useState(false)

  useEffect(() => {
    async function fetchInvite() {
      setLoading(true)
      setError(null)
      try {
        if (token.startsWith('demo_')) {
          // Demo fallback
          setInviteData({
            role: 'viewer',
            trips: {
              id: 'trip_demo_1',
              title: 'Bali Expedition',
              destination: 'Bali, Indonesia',
              cover_image_url: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80',
              days: 10,
              status: 'Upcoming',
            },
            profiles: {
              full_name: 'Expedition Leader',
              avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&q=80',
            }
          })
        } else {
          const data = await inviteService.getByToken(token)
          setInviteData(data)
        }
      } catch (err) {
        setError(err.message || 'Invalid or expired invite token.')
      } finally {
        setLoading(false)
      }
    }
    if (token) fetchInvite()
  }, [token])

  const handleJoin = async () => {
    if (!userId) {
      // Prompt login or redirect with return url
      navigate(`/?redirect=/join/${token}`)
      return
    }

    setJoining(true)
    setError(null)

    try {
      if (token.startsWith('demo_')) {
        setTimeout(() => {
          setJoinedSuccess(true)
          setTimeout(() => navigate('/trips'), 1800)
        }, 800)
      } else {
        const res = await inviteService.accept(token)
        if (res && res.success === false) {
          throw new Error(res.error || 'Failed to join trip.')
        }
        setJoinedSuccess(true)
        setTimeout(() => {
          navigate('/trips')
        }, 1800)
      }
    } catch (err) {
      setError(err.message || 'Could not join trip. Please try again.')
      setJoining(false)
    }
  }

  const trip = inviteData?.trips
  const creator = inviteData?.profiles

  return (
    <div className="join-trip-page">
      <div className="jt-card-container">
        {loading ? (
          <div className="jt-loading-box">
            <div className="jt-spinner" />
            <p>Decoding Trip Invitation...</p>
          </div>
        ) : error ? (
          <div className="jt-error-box">
            <span className="jt-error-icon">⚠️</span>
            <h2>Invite Unavailable</h2>
            <p>{error}</p>
            <Link to="/dashboard" className="jt-btn-secondary">Go to Dashboard</Link>
          </div>
        ) : joinedSuccess ? (
          <div className="jt-success-box">
            <div className="jt-celebrate-badge">
              <CheckCircleIcon size={36} color="#22c55e" />
            </div>
            <h2>You're In! Welcome to the Journey 🎉</h2>
            <p>Redirecting to your shared itinerary...</p>
          </div>
        ) : (
          <div className="jt-content">
            {/* Header / Brand */}
            <div className="jt-brand">
              <span className="jt-brand-badge">PLANYATRI GROUP INVITE</span>
            </div>

            {/* Trip Visual Hero */}
            <div className="jt-hero-card" style={{ backgroundImage: `url(${trip?.cover_image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80'})` }}>
              <div className="jt-hero-overlay" />
              <div className="jt-hero-info">
                <span className="jt-hero-status">{trip?.status || 'Upcoming Expedition'}</span>
                <h1 className="jt-hero-title">{trip?.destination || trip?.title}</h1>
                <div className="jt-hero-meta">
                  <span><CalendarIcon size={14} /> {trip?.days || 5} Days Scheduled</span>
                  <span><UsersIcon size={14} /> Role: {inviteData?.role === 'editor' ? 'Co-Planner (Editor)' : 'Travel Companion (Viewer)'}</span>
                </div>
              </div>
            </div>

            {/* Inviter Info */}
            <div className="jt-inviter-row">
              <img
                src={creator?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&q=80'}
                alt="Creator"
                className="jt-avatar"
              />
              <div className="jt-inviter-text">
                <span className="jt-inviter-sub">Group Leader / Organizer</span>
                <span className="jt-inviter-name">{creator?.full_name || 'Travel Companion'}</span>
              </div>
            </div>

            <p className="jt-invitation-message">
              You've been invited to collaborate, share live expenses, and explore real-time day schedules together on PlanYatri.
            </p>

            {/* Action Buttons */}
            <div className="jt-actions">
              <button
                className="jt-join-btn"
                onClick={handleJoin}
                disabled={joining}
              >
                {joining ? (
                  <span>Syncing with Group...</span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <SparkleIcon size={16} color="#121316" />
                    {userId ? 'Accept Invitation & Join Trip' : 'Sign in & Join Trip'}
                  </span>
                )}
              </button>

              <button
                className="jt-decline-btn"
                onClick={() => navigate('/dashboard')}
              >
                Decline
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
