// WeatherWidget.jsx — uses Open-Meteo (free, no API key)
import { useState, useEffect } from 'react'
import api from '../services/api'

const WMO_CODES = {
  0: { label: 'Clear Sky', emoji: '☀️' },
  1: { label: 'Mainly Clear', emoji: '🌤️' },
  2: { label: 'Partly Cloudy', emoji: '⛅' },
  3: { label: 'Overcast', emoji: '☁️' },
  45: { label: 'Foggy', emoji: '🌫️' },
  51: { label: 'Light Drizzle', emoji: '🌦️' },
  61: { label: 'Light Rain', emoji: '🌧️' },
  71: { label: 'Light Snow', emoji: '🌨️' },
  80: { label: 'Rain Showers', emoji: '🌦️' },
  95: { label: 'Thunderstorm', emoji: '⛈️' },
}

const PRESET_CITIES = [
  { name: 'New Delhi', lat: 28.6139, lon: 77.209 },
  { name: 'Mumbai', lat: 19.076, lon: 72.8777 },
  { name: 'Bali', lat: -8.3405, lon: 115.092 },
  { name: 'Paris', lat: 48.8566, lon: 2.3522 },
  { name: 'Leh', lat: 34.1526, lon: 77.5771 },
  { name: 'Udaipur', lat: 24.5854, lon: 73.7125 },
]

export default function WeatherWidget({ defaultCity = 'New Delhi', className = '' }) {
  const [selected, setSelected] = useState(PRESET_CITIES.find(c => c.name === defaultCity) || PRESET_CITIES[0])
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    api.get(`/weather?lat=${selected.lat}&lon=${selected.lon}&city=${encodeURIComponent(selected.name)}`)
      .then(r => {
        if (!cancelled) { setWeather(r.data); setLoading(false) }
      })
      .catch(() => {
        if (!cancelled) { setError('Weather unavailable'); setLoading(false) }
      })

    return () => { cancelled = true }
  }, [selected])

  const current = weather?.current
  const wmo = WMO_CODES[current?.weathercode] || WMO_CODES[1]
  const days = weather?.daily

  return (
    <div className={`weather-widget ${className}`}>
      <div className="weather-header">
        <div className="weather-city-row">
          <select
            className="weather-city-select"
            value={selected.name}
            onChange={e => setSelected(PRESET_CITIES.find(c => c.name === e.target.value))}
          >
            {PRESET_CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
          <span className="weather-label">Live Weather</span>
        </div>
      </div>

      {loading && <div className="weather-loading">Fetching conditions…</div>}
      {error && <div className="weather-error">{error}</div>}

      {!loading && !error && current && (
        <>
          <div className="weather-current">
            <span className="weather-emoji">{wmo.emoji}</span>
            <div className="weather-temp-block">
              <span className="weather-temp">{Math.round(current.temperature_2m)}°C</span>
              <span className="weather-condition">{wmo.label}</span>
            </div>
            <div className="weather-meta">
              <span>💨 {Math.round(current.windspeed_10m)} km/h</span>
              <span>💧 {current.relative_humidity_2m}%</span>
            </div>
          </div>

          {days && (
            <div className="weather-forecast">
              {days.time.slice(0, 5).map((date, i) => {
                const d = new Date(date)
                const label = i === 0 ? 'Today' : d.toLocaleDateString('en-IN', { weekday: 'short' })
                return (
                  <div key={date} className="weather-day">
                    <span className="wd-label">{label}</span>
                    <span className="wd-max">{Math.round(days.temperature_2m_max[i])}°</span>
                    <span className="wd-min">{Math.round(days.temperature_2m_min[i])}°</span>
                    <span className="wd-rain" title="Precipitation">{days.precipitation_sum[i] > 0 ? `${days.precipitation_sum[i]}mm` : '—'}</span>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
