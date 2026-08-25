// FlightTracker.jsx — real-time flight status lookup
import { useState } from 'react'
import api from '../services/api'

const STATUS_COLORS = {
  scheduled: '#3b82f6',
  active: '#22c55e',
  landed: '#a855f7',
  cancelled: '#ef4444',
  incident: '#f97316',
  diverted: '#eab308',
}

const STATUS_LABELS = {
  scheduled: '🕐 Scheduled',
  active: '🛫 In Air',
  landed: '🛬 Landed',
  cancelled: '❌ Cancelled',
  incident: '⚠️ Incident',
  diverted: '🔀 Diverted',
}

function formatTime(isoStr) {
  if (!isoStr) return '—'
  return new Date(isoStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

export default function FlightTracker({ className = '' }) {
  const [query, setQuery] = useState('')
  const [flight, setFlight] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [recent, setRecent] = useState(['6E-501', 'AI-302', 'SG-401'])

  const search = async (flightCode) => {
    const code = (flightCode || query).toUpperCase().trim()
    if (!code) return
    setLoading(true)
    setError(null)
    setFlight(null)
    try {
      const res = await api.get(`/flight-status?flight=${encodeURIComponent(code)}`)
      setFlight(res.data)
      setRecent(prev => [code, ...prev.filter(r => r !== code)].slice(0, 5))
    } catch (e) {
      setError('Could not find flight. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const status = flight?.flight_status
  const color = STATUS_COLORS[status] || '#6b7280'

  return (
    <div className={`flight-tracker ${className}`}>
      <div className="ft-header">
        <h3 className="ft-title">✈️ Flight Status</h3>
        <span className="ft-subtitle">Real-time tracking</span>
      </div>

      <div className="ft-search-row">
        <input
          className="ft-input"
          placeholder="Flight code e.g. 6E-501"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
        />
        <button className="ft-search-btn" onClick={() => search()} disabled={loading}>
          {loading ? '…' : '🔍'}
        </button>
      </div>

      <div className="ft-recents">
        {recent.map(r => (
          <button key={r} className="ft-recent-tag" onClick={() => { setQuery(r); search(r) }}>{r}</button>
        ))}
      </div>

      {error && <div className="ft-error">{error}</div>}

      {flight && (
        <div className="ft-result">
          <div className="ft-status-badge" style={{ background: color }}>
            {STATUS_LABELS[status] || status}
          </div>

          <div className="ft-flight-name">
            {flight.airline?.name} · {flight.flight?.iata}
          </div>

          <div className="ft-route">
            <div className="ft-airport">
              <span className="ft-iata">{flight.departure?.iata}</span>
              <span className="ft-airport-name">{flight.departure?.airport?.split(' ').slice(0, 2).join(' ')}</span>
              <span className="ft-time">{formatTime(flight.departure?.estimated || flight.departure?.scheduled)}</span>
              {flight.departure?.terminal && <span className="ft-gate">T{flight.departure.terminal} · Gate {flight.departure.gate}</span>}
            </div>

            <div className="ft-arrow">
              <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
                <path d="M0 10 H50" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="4 2" />
                <path d="M46 5 L55 10 L46 15" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="none" />
                <text x="20" y="7" fontSize="10" fill="rgba(255,255,255,0.5)">✈</text>
              </svg>
            </div>

            <div className="ft-airport ft-right">
              <span className="ft-iata">{flight.arrival?.iata}</span>
              <span className="ft-airport-name">{flight.arrival?.airport?.split(' ').slice(0, 2).join(' ')}</span>
              <span className="ft-time">{formatTime(flight.arrival?.estimated || flight.arrival?.scheduled)}</span>
              {flight.arrival?.terminal && <span className="ft-gate">T{flight.arrival.terminal} · Gate {flight.arrival.gate}</span>}
            </div>
          </div>

          <div className="ft-date">📅 {flight.flight_date}</div>
        </div>
      )}
    </div>
  )
}
