import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'
import { ArrowLeftRight, TrendingUp, RefreshCw, Globe, Sparkles, Check } from 'lucide-react'

const TRAVEL_CURRENCIES = [
  { code: 'INR', flag: '🇮🇳', name: 'Indian Rupee', symbol: '₹' },
  { code: 'USD', flag: '🇺🇸', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', flag: '🇪🇺', name: 'Euro', symbol: '€' },
  { code: 'GBP', flag: '🇬🇧', name: 'British Pound', symbol: '£' },
  { code: 'JPY', flag: '🇯🇵', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AED', flag: '🇦🇪', name: 'UAE Dirham', symbol: 'د.إ' },
  { code: 'CHF', flag: '🇨🇭', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'SGD', flag: '🇸🇬', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'THB', flag: '🇹🇭', name: 'Thai Baht', symbol: '฿' },
  { code: 'IDR', flag: '🇮🇩', name: 'Indonesian Rupiah', symbol: 'Rp' },
]

// Fallback rates if external API rate limit reached
const FALLBACK_RATES = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
  JPY: 1.82,
  AED: 0.044,
  CHF: 0.0105,
  SGD: 0.016,
  THB: 0.42,
  IDR: 190.5,
}

export default function CurrencyConverter({ className = '' }) {
  const [from, setFrom] = useState('INR')
  const [to, setTo] = useState('USD')
  const [amount, setAmount] = useState(10000)
  const [rates, setRates] = useState(FALLBACK_RATES)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString())

  const fetchRates = () => {
    setLoading(true)
    api.get(`/currency/${from}`)
      .then(r => {
        if (r.data?.rates) {
          setRates(r.data.rates)
          setLastUpdated(r.data.time_last_update_utc || new Date().toISOString())
        }
      })
      .catch(() => {
        // use fallback gracefully
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchRates()
  }, [from])

  const toRate = rates[to] || (FALLBACK_RATES[to] / (FALLBACK_RATES[from] || 1))
  const converted = (amount * toRate).toFixed(2)

  const swap = () => {
    const prevFrom = from
    setFrom(to)
    setTo(prevFrom)
  }

  const fromCurr = TRAVEL_CURRENCIES.find(c => c.code === from) || TRAVEL_CURRENCIES[0]
  const toCurr = TRAVEL_CURRENCIES.find(c => c.code === to) || TRAVEL_CURRENCIES[1]

  return (
    <div className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-[#D4A843]">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 leading-tight">Live Travel FX Matrix</h4>
            <span className="text-[10px] text-slate-400">Zero-markup interbank estimate</span>
          </div>
        </div>
        <button
          type="button"
          onClick={fetchRates}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Refresh rates"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Conversion Row */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus-within:border-[#D4A843] focus-within:bg-white transition-all">
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(Math.max(0, Number(e.target.value)))}
            className="flex-1 bg-transparent text-base font-bold text-slate-900 outline-none"
            placeholder="0"
          />
          <select
            value={from}
            onChange={e => setFrom(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg py-1 px-2 text-xs font-bold text-slate-800 outline-none cursor-pointer"
          >
            {TRAVEL_CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-2 z-10">
          <motion.button
            type="button"
            onClick={swap}
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md border-2 border-white cursor-pointer"
            title="Swap currencies"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div className="flex flex-col">
            <span className="text-lg font-extrabold text-slate-900">
              {toCurr.symbol} {Number(converted).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-slate-400">1 {from} ≈ {(toRate).toFixed(4)} {to}</span>
          </div>
          <select
            value={to}
            onChange={e => setTo(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg py-1 px-2 text-xs font-bold text-slate-800 outline-none cursor-pointer"
          >
            {TRAVEL_CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Matrix Grid */}
      <div className="pt-2 border-t border-slate-100">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Global FX Pairs (1 {from})
        </span>
        <div className="grid grid-cols-2 gap-2">
          {TRAVEL_CURRENCIES.filter(c => c.code !== from).slice(0, 4).map(c => {
            const pairRate = rates[c.code] ? rates[c.code].toFixed(3) : '—'
            return (
              <div key={c.code} className="flex justify-between items-center p-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <span className="font-semibold text-slate-700">{c.flag} {c.code}</span>
                <span className="font-mono text-[11px] font-bold text-slate-900">{pairRate}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
