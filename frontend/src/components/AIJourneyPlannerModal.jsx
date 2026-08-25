import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { SparkleIcon, MapPinIcon, CalendarIcon, UsersIcon, CheckCircleIcon } from './icons/LuxuryIcons'
import './AIJourneyPlannerModal.css'

const POPULAR_SUGGESTIONS = [
  { name: 'Ladakh High-Pass & Pangong Oasis', city: 'Leh-Ladakh', days: 7, budget: 45000, style: 'Adventure', img: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&q=80' },
  { name: 'Bali Tropical Villas & Ubud Temples', city: 'Bali', days: 8, budget: 65000, style: 'Boutique', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80' },
  { name: 'Udaipur Royal Palaces & Pichola Sails', city: 'Udaipur', days: 5, budget: 38000, style: 'Heritage', img: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800&q=80' },
  { name: 'Kerala Backwaters & Munnar Mist', city: 'Kerala', days: 6, budget: 42000, style: 'Wellness', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80' },
  { name: 'Spiti Valley Celestial Stargazing', city: 'Spiti', days: 8, budget: 36000, style: 'Adventure', img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80' },
]

export default function AIJourneyPlannerModal({ onClose }) {
  const navigate = useNavigate()

  const [destination, setDestination] = useState('Ladakh, Himalayas')
  const [days, setDays] = useState(6)
  const [budget, setBudget] = useState(45000)
  const [people, setPeople] = useState(2)
  const [travelStyle, setTravelStyle] = useState('Boutique')
  const [selectedInterests, setSelectedInterests] = useState(['Culture', 'Food', 'Photography'])

  const [generating, setGenerating] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState(null)
  const [activePreviewDay, setActivePreviewDay] = useState(1)

  const handleInterestToggle = (interest) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    )
  }

  const handleGenerate = async (e) => {
    if (e) e.preventDefault()
    if (!destination.trim()) return

    setGenerating(true)
    try {
      const res = await api.post('/gemini/optimize-itinerary', {
        tripName: destination,
        cities: destination.split(/[,→]/).map(c => c.trim()).filter(Boolean),
        days: Number(days),
        budgetINR: Number(budget),
        interests: selectedInterests,
        travelStyle,
      })

      if (res.data?.data) {
        setGeneratedPlan(res.data.data)
      }
    } catch (err) {
      console.warn('AI generator fallback:', err.message)
    } finally {
      setGenerating(false)
    }
  }

  const handleStartJourney = () => {
    if (!generatedPlan) return

    const daysPlan = (generatedPlan.days || []).map((d, i) => ({
      dayNumber: d.dayNumber || i + 1,
      date: d.date || `Day ${i + 1}`,
      city: d.city || destination.split(',')[0],
      theme: d.theme || 'Exploration & Culture',
      activities: (d.activities || []).map(a => ({
        name: a.name,
        time: a.time || '09:00 AM',
        costINR: a.costINR || 800,
        category: a.category || 'Sightseeing',
        desc: a.desc || '',
        duration: a.duration || '2h',
      })),
    }))

    const selectedSuggestion = POPULAR_SUGGESTIONS.find(s => destination.toLowerCase().includes(s.city.toLowerCase()))
    const coverImg = selectedSuggestion?.img || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80'

    onClose()
    navigate('/trips', {
      state: {
        initialDest: destination,
        initialImg: coverImg,
        initialBudget: Number(budget),
        initialDays: Number(days),
        initialPeople: Number(people),
        initialDesc: `Curated ${days}-day ${travelStyle} escape to ${destination}. Geo-clustered & budget-optimized.`,
        initialDaysPlan: daysPlan,
        autoOpenCustomizer: true,
      },
    })
  }

  return (
    <div className="custom-modal-backdrop" onClick={onClose}>
      <div className="custom-modal-window wide aip-modal-window" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="cm-header">
          <div>
            <span className="cm-badge-ai" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <SparkleIcon size={13} color="#D4A843" /> PLAN YATRI AI TRAVEL ARCHITECT
            </span>
            <h3 className="cm-title">Design Your Tailored Journey</h3>
          </div>
          <button className="cm-close" onClick={onClose}>✕</button>
        </div>

        {!generatedPlan ? (
          <div className="aip-builder-body">
            {/* Quick Inspiration Pills */}
            <div className="aip-suggestions-row">
              <span className="aip-sugg-label">Popular Destinations:</span>
              <div className="aip-sugg-pills">
                {POPULAR_SUGGESTIONS.map(s => (
                  <button
                    key={s.city}
                    type="button"
                    className={`aip-sugg-pill ${destination.includes(s.city) ? 'active' : ''}`}
                    onClick={() => {
                      setDestination(s.name)
                      setDays(s.days)
                      setBudget(s.budget)
                      setTravelStyle(s.style)
                    }}
                  >
                    {s.city}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleGenerate} className="aip-form-grid">
              <div className="cm-field aip-field-full">
                <label>Where do you want to explore?</label>
                <div className="aip-input-icon-wrap">
                  <MapPinIcon size={16} color="#D4A843" />
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    placeholder="e.g. Ladakh, Spiti Valley, Kerala Backwaters, Bali, Paris"
                    className="aip-main-input"
                  />
                </div>
              </div>

              <div className="cm-grid-3">
                <div className="cm-field">
                  <label>Duration (Days)</label>
                  <input
                    type="number"
                    min={2}
                    max={30}
                    value={days}
                    onChange={e => setDays(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="cm-field">
                  <label>Target Budget (₹ INR)</label>
                  <input
                    type="number"
                    step={2000}
                    min={10000}
                    value={budget}
                    onChange={e => setBudget(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="cm-field">
                  <label>Travelers</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={people}
                    onChange={e => setPeople(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="cm-grid-2">
                <div className="cm-field">
                  <label>Travel Style</label>
                  <select value={travelStyle} onChange={e => setTravelStyle(e.target.value)}>
                    <option value="Boutique">Boutique & Authentic (4-Star / Heritage)</option>
                    <option value="Luxury">Royal & 5-Star Luxury</option>
                    <option value="Adventure">Adventure & Expeditions</option>
                    <option value="Wellness">Holistic Wellness & Rejuvenation</option>
                    <option value="Smart Explorer">Budget & Smart Backpacking</option>
                  </select>
                </div>

                <div className="cm-field">
                  <label>Primary Focus</label>
                  <div className="aip-interest-chips">
                    {['Culture', 'Food', 'Photography', 'Adventure', 'Nature', 'Relaxation'].map(intr => (
                      <label key={intr} className={`aip-chip ${selectedInterests.includes(intr) ? 'active' : ''}`}>
                        <input
                          type="checkbox"
                          checked={selectedInterests.includes(intr)}
                          onChange={() => handleInterestToggle(intr)}
                        />
                        <span>{intr}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="aip-submit-row">
                <button type="submit" className="aip-generate-btn" disabled={generating}>
                  {generating ? (
                    <span className="aip-pulse-text">✨ AI Travel Architect is Thinking & Curating...</span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <SparkleIcon size={16} color="#121316" />
                      Generate Personalized Itinerary Package
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ── Generated Result Preview ── */
          <div className="aip-result-body">
            <div className="aip-result-header">
              <div>
                <h4 className="aip-result-title">{destination}</h4>
                <p className="aip-result-sub">{days} Days · ₹{Number(budget).toLocaleString('en-IN')} Target · {travelStyle} Style</p>
              </div>
              <button className="aip-recalc-btn" onClick={() => setGeneratedPlan(null)}>
                🔄 Adjust Criteria
              </button>
            </div>

            {/* AI Notes Banner */}
            {generatedPlan.aiOptimizationNotes && (
              <div className="aip-notes-box">
                {generatedPlan.aiOptimizationNotes.map((n, i) => (
                  <p key={i} className="aip-note-line">{n}</p>
                ))}
              </div>
            )}

            {/* Day Selector Pills */}
            <div className="aip-days-nav">
              {(generatedPlan.days || []).map(d => (
                <button
                  key={d.dayNumber}
                  className={`aip-day-pill ${activePreviewDay === d.dayNumber ? 'active' : ''}`}
                  onClick={() => setActivePreviewDay(d.dayNumber)}
                >
                  Day {d.dayNumber}
                </button>
              ))}
            </div>

            {/* Active Day Activities List */}
            {(() => {
              const currentDay = (generatedPlan.days || []).find(d => d.dayNumber === activePreviewDay) || generatedPlan.days?.[0]
              if (!currentDay) return null
              return (
                <div className="aip-day-card">
                  <div className="aip-day-card-hdr">
                    <span className="aip-day-theme">✦ {currentDay.theme}</span>
                    <span className="aip-day-city">{currentDay.city}</span>
                  </div>
                  <div className="aip-activities-grid">
                    {(currentDay.activities || []).map((act, i) => (
                      <div key={i} className="aip-act-item">
                        <div className="aip-act-time">{act.time}</div>
                        <div className="aip-act-info">
                          <div className="aip-act-name-row">
                            <span className="aip-act-name">{act.name}</span>
                            <span className="aip-act-cost">₹{Number(act.costINR || 0).toLocaleString('en-IN')}</span>
                          </div>
                          {act.desc && <p className="aip-act-desc">{act.desc}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}

            {/* Estimated Budget Summary Bar */}
            <div className="aip-budget-summary">
              <div className="aip-bs-item">
                <span>Transport</span>
                <strong>₹{(generatedPlan.budgetBreakdown?.transportINR || 0).toLocaleString('en-IN')}</strong>
              </div>
              <div className="aip-bs-item">
                <span>Stays & Hotels</span>
                <strong>₹{(generatedPlan.budgetBreakdown?.hotelINR || 0).toLocaleString('en-IN')}</strong>
              </div>
              <div className="aip-bs-item">
                <span>Activities & Entry</span>
                <strong>₹{(generatedPlan.budgetBreakdown?.activitiesINR || 0).toLocaleString('en-IN')}</strong>
              </div>
              <div className="aip-bs-item total">
                <span>Est. Total</span>
                <strong>₹{(generatedPlan.budgetBreakdown?.totalINR || budget).toLocaleString('en-IN')}</strong>
              </div>
            </div>

            {/* Final Action Button: START JOURNEY & GO TO TRIPS */}
            <button className="aip-confirm-start-btn" onClick={handleStartJourney}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <CheckCircleIcon size={18} color="#121316" />
                Start This Journey & Open in Trips Workspace →
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
