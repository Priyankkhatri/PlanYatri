// CurrencyConverter.jsx — uses open.er-api.com via backend proxy (free)
import { useState, useEffect } from 'react'
import api from '../services/api'

const TRAVEL_CURRENCIES = [
  { code: 'INR', flag: '🇮🇳', name: 'Indian Rupee' },
  { code: 'USD', flag: '🇺🇸', name: 'US Dollar' },
  { code: 'EUR', flag: '🇪🇺', name: 'Euro' },
  { code: 'GBP', flag: '🇬🇧', name: 'British Pound' },
  { code: 'JPY', flag: '🇯🇵', name: 'Japanese Yen' },
  { code: 'AUD', flag: '🇦🇺', name: 'Australian Dollar' },
  { code: 'SGD', flag: '🇸🇬', name: 'Singapore Dollar' },
  { code: 'THB', flag: '🇹🇭', name: 'Thai Baht' },
  { code: 'IDR', flag: '🇮🇩', name: 'Indonesian Rupiah' },
  { code: 'AED', flag: '🇦🇪', name: 'UAE Dirham' },
]

export default function CurrencyConverter({ className = '' }) {
  const [from, setFrom] = useState('INR')
  const [to, setTo] = useState('USD')
  const [amount, setAmount] = useState(10000)
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    api.get(`/currency/${from}`)
      .then(r => {
        setRates(r.data.rates || {})
        setLastUpdated(r.data.time_last_update_utc || null)
        setLoading(false)
      })
      .catch(() => { setError('Rate fetch failed'); setLoading(false) })
  }, [from])

  const converted = rates && rates[to] ? (amount * rates[to]).toFixed(2) : null

  const swap = () => { setFrom(to); setTo(from) }

  return (
    <div className={`currency-widget ${className}`}>
      <div className="currency-header">
        <span className="currency-title">Currency Converter</span>
        {lastUpdated && <span className="currency-updated">Updated {new Date(lastUpdated).toLocaleDateString()}</span>}
      </div>

      <div className="currency-amount-row">
        <input
          type="number"
          className="currency-input"
          value={amount}
          min="0"
          onChange={e => setAmount(Number(e.target.value))}
        />
        <select className="currency-select" value={from} onChange={e => setFrom(e.target.value)}>
          {TRAVEL_CURRENCIES.map(c => (
            <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
          ))}
        </select>
      </div>

      <button className="currency-swap" onClick={swap} title="Swap currencies">⇅ Swap</button>

      <div className="currency-result-row">
        <div className={`currency-result ${loading ? 'loading' : ''}`}>
          {loading ? 'Fetching…' : error ? error : converted !== null ? (
            <span>
              <strong>{Number(converted).toLocaleString()}</strong>
              <span className="currency-to-code">{' '}{TRAVEL_CURRENCIES.find(c => c.code === to)?.flag} {to}</span>
            </span>
          ) : '—'}
        </div>
        <select className="currency-select" value={to} onChange={e => setTo(e.target.value)}>
          {TRAVEL_CURRENCIES.map(c => (
            <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
          ))}
        </select>
      </div>

      {rates && !loading && (
        <div className="currency-quick-rates">
          <span className="cqr-label">Quick Rates (1 {from})</span>
          <div className="cqr-list">
            {TRAVEL_CURRENCIES.filter(c => c.code !== from).slice(0, 4).map(c => (
              <div key={c.code} className="cqr-item">
                <span>{c.flag} {c.code}</span>
                <span>{rates[c.code] ? rates[c.code].toFixed(4) : '—'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
