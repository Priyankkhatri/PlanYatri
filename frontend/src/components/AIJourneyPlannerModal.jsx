import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'
import { SparkleIcon, MapPinIcon, CalendarIcon, UsersIcon, CheckCircleIcon } from './icons/LuxuryIcons'
import { Sparkles, Compass, MapPin, Calendar, Users, Wallet, ArrowRight, Check, X, Shield, Globe, RefreshCw } from 'lucide-react'
import './AIJourneyPlannerModal.css'

const POPULAR_SUGGESTIONS = [
  { name: 'Ladakh High-Pass & Pangong Oasis', city: 'Leh-Ladakh', days: 7, budget: 45000, style: 'Adventure', img: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&q=80' },
  { name: 'Bali Tropical Villas & Ubud Temples', city: 'Bali', days: 8, budget: 65000, style: 'Boutique', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80' },
  { name: 'Udaipur Royal Palaces & Pichola Sails', city: 'Udaipur', days: 5, budget: 38000, style: 'Heritage', img: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800&q=80' },
  { name: 'Kerala Backwaters & Munnar Mist', city: 'Kerala', days: 6, budget: 42000, style: 'Wellness', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80' },
  { name: 'Swiss Alps & Glacier Express', city: 'Zermatt', days: 7, budget: 125000, style: 'Luxury', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80' },
  { name: 'Kyoto Zen Temples & Arashiyama', city: 'Kyoto', days: 9, budget: 95000, style: 'Cultural', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80' },
]

const INTEREST_OPTIONS = [
  'Culture & Heritage', 'Fine Dining', 'Scenic Hikes', 'Photography', 'Wellness & Spa', 'Wildlife Safari', 'Nightlife', 'Hidden Gems'
]

const AI_STEPS = [
  'Synthesizing geographic terrain and regional highlights...',
  'Curating verified boutique stays & culinary reservations...',
  'Balancing day-by-day transit cadence & budget allocations...',
  'Finalizing day-by-day schedule with local concierge tips...'
]

export default function AIJourneyPlannerModal({ onClose }) {
  const navigate = useNavigate()

  const [destination, setDestination] = useState('Ladakh, Himalayas')
  const [days, setDays] = useState(6)
  const [budget, setBudget] = useState(45000)
  const [people, setPeople] = useState(2)
  const [travelStyle, setTravelStyle] = useState('Boutique')
  const [selectedInterests, setSelectedInterests] = useState(['Culture & Heritage', 'Fine Dining', 'Photography'])

  const [generating, setGenerating] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [generatedPlan, setGeneratedPlan] = useState(null)
  const [activePreviewDay, setActivePreviewDay] = useState(1)

  const handleInterestToggle = (interest) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    )
  }

  const handleApplySuggestion = (sug) => {
    setDestination(sug.city)
    setDays(sug.days)
    setBudget(sug.budget)
    setTravelStyle(sug.style)
  }

  const handleGenerate = async (e) => {
    if (e) e.preventDefault()
    if (!destination.trim()) return

    setGenerating(true)
    setStepIndex(0)

    const stepInterval = setInterval(() => {
      setStepIndex((prev) => (prev < AI_STEPS.length - 1 ? prev + 1 : prev))
    }, 1200)

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
      // Fallback mock generated plan if backend offline
      setGeneratedPlan({
        tripName: destination,
        summary: `Custom ${days}-day ${travelStyle} exploration featuring personalized milestones, culinary journeys, and verified routes.`,
        estimatedCostINR: budget,
        days: Array.from({ length: Number(days) }, (_, i) => ({
          dayNumber: i + 1,
          date: `Day ${i + 1}`,
          city: destination.split(',')[0],
          theme: i === 0 ? 'Arrival & Welcome Dinner' : i === Number(days) - 1 ? 'Sunset Vista & Departure' : 'Signature Expedition',
          activities: [
            { name: `Morning Discovery at ${destination.split(',')[0]} Historic Quarter`, time: '09:30 AM', costINR: Math.round(budget / (days * 4)), category: 'Culture', duration: '2.5h' },
            { name: `Artisan Culinary Lunch & Local Tasting`, time: '01:00 PM', costINR: Math.round(budget / (days * 5)), category: 'Dining', duration: '1.5h' },
            { name: `Private Sunset Route & Scenic Photography`, time: '05:00 PM', costINR: Math.round(budget / (days * 6)), category: 'Sightseeing', duration: '3h' },
          ]
        }))
      })
    } finally {
      clearInterval(stepInterval)
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
      <motion.div
        className="custom-modal-window wide aip-modal-window"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {/* Header */}
        <div className="cm-header">
          <div className="flex items-center gap-3">
            <div className="aip-header-icon">
              <Sparkles className="w-5 h-5 text-[#D4A843]" />
            </div>
            <div>
              <span className="cm-badge-ai">
                <SparkleIcon size={12} color="#D4A843" /> GENERATIVE ITINERARY AI
              </span>
              <h3 className="cm-title">Design Your Custom Escape</h3>
            </div>
          </div>
          <button className="cm-close" onClick={onClose}>✕</button>
        </div>

        {/* Modal Body */}
        <div className="aip-modal-body">
          {!generatedPlan ? (
            <div className="aip-setup-view">
              {/* Popular inspirations */}
              <div className="aip-quick-row">
                <span className="aip-row-label">Trending Havens:</span>
                <div className="aip-pill-chips">
                  {POPULAR_SUGGESTIONS.map(s => (
                    <button
                      key={s.name}
                      type="button"
                      className={`aip-chip ${destination.toLowerCase().includes(s.city.toLowerCase()) ? 'active' : ''}`}
                      onClick={() => handleApplySuggestion(s)}
                    >
                      {s.city} ({s.days}d)
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Inputs Grid */}
              <form onSubmit={handleGenerate} className="aip-form-grid">
                <div className="aip-field-group full-width">
                  <label className="aip-label">
                    <MapPin className="w-3.5 h-3.5 text-[#D4A843]" /> Destination / Region
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    placeholder="e.g. Kyoto, Japan or Amalfi Coast, Italy"
                    className="aip-input"
                    required
                  />
                </div>

                <div className="aip-field-group">
                  <label className="aip-label">
                    <Calendar className="w-3.5 h-3.5 text-[#38BDF8]" /> Duration (Days)
                  </label>
                  <div className="aip-number-control">
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={days}
                      onChange={e => setDays(Number(e.target.value))}
                      className="aip-input text-center font-bold"
                    />
                    <div className="aip-quick-steppers">
                      {[3, 5, 7, 10, 14].map(d => (
                        <button
                          key={d}
                          type="button"
                          className={`aip-stepper-btn ${days === d ? 'active' : ''}`}
                          onClick={() => setDays(d)}
                        >
                          {d}d
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="aip-field-group">
                  <label className="aip-label">
                    <Wallet className="w-3.5 h-3.5 text-[#10B981]" /> Target Budget (INR)
                  </label>
                  <input
                    type="number"
                    step="5000"
                    min="5000"
                    value={budget}
                    onChange={e => setBudget(Number(e.target.value))}
                    className="aip-input font-bold"
                  />
                </div>

                <div className="aip-field-group">
                  <label className="aip-label">
                    <Users className="w-3.5 h-3.5 text-[#A855F7]" /> Travel Party Size
                  </label>
                  <select
                    value={people}
                    onChange={e => setPeople(Number(e.target.value))}
                    className="aip-select"
                  >
                    <option value={1}>1 Solo Explorer</option>
                    <option value={2}>2 Travelers (Duo / Couple)</option>
                    <option value={4}>4 Friends Expedition</option>
                    <option value={6}>6+ Family Gathering</option>
                  </select>
                </div>

                <div className="aip-field-group">
                  <label className="aip-label">
                    <Compass className="w-3.5 h-3.5 text-[#F59E0B]" /> Travel Pace & Style
                  </label>
                  <select
                    value={travelStyle}
                    onChange={e => setTravelStyle(e.target.value)}
                    className="aip-select"
                  >
                    <option value="Boutique">Boutique & Hidden Charms</option>
                    <option value="Luxury">Ultra Luxury & Private Charters</option>
                    <option value="Adventure">High Altitude & Adventure</option>
                    <option value="Wellness">Wellness & Mindful Retreat</option>
                    <option value="Cultural">Deep Cultural Immersion</option>
                  </select>
                </div>

                {/* Interests Chips */}
                <div className="aip-field-group full-width">
                  <label className="aip-label">Curated Passions & Interests</label>
                  <div className="aip-interests-grid">
                    {INTEREST_OPTIONS.map(interest => {
                      const isSelected = selectedInterests.includes(interest)
                      return (
                        <button
                          key={interest}
                          type="button"
                          className={`aip-interest-pill ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleInterestToggle(interest)}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#D4A843]" />}
                          <span>{interest}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* AI Generating Animation State */}
                {generating && (
                  <div className="aip-loading-box full-width">
                    <div className="aip-spinner-radar">
                      <Sparkles className="w-6 h-6 text-[#D4A843] animate-spin" />
                    </div>
                    <div className="aip-loading-text">
                      <p className="aip-step-title">Synthesizing AI Itinerary...</p>
                      <p className="aip-step-sub">{AI_STEPS[stepIndex]}</p>
                    </div>
                  </div>
                )}

                {/* Action CTA */}
                {!generating && (
                  <div className="aip-action-row full-width">
                    <button type="submit" className="aip-submit-btn">
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Bespoke Itinerary</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </form>
            </div>
          ) : (
            /* Generated Itinerary Preview */
            <div className="aip-preview-view">
              <div className="aip-preview-banner">
                <div>
                  <h4 className="aip-preview-title">{generatedPlan.tripName || destination}</h4>
                  <p className="aip-preview-sub">{generatedPlan.summary}</p>
                </div>
                <div className="aip-cost-pill">
                  <span className="aip-cost-label">ESTIMATED TOTAL</span>
                  <span className="aip-cost-val">₹{Number(budget).toLocaleString()}</span>
                </div>
              </div>

              {/* Day Selector Pills */}
              <div className="aip-day-tabs">
                {(generatedPlan.days || []).map((d, i) => (
                  <button
                    key={d.dayNumber || i}
                    type="button"
                    className={`aip-day-tab ${activePreviewDay === (d.dayNumber || i + 1) ? 'active' : ''}`}
                    onClick={() => setActivePreviewDay(d.dayNumber || i + 1)}
                  >
                    Day {d.dayNumber || i + 1}
                  </button>
                ))}
              </div>

              {/* Active Day Activities List */}
              <div className="aip-day-activities-card">
                {(() => {
                  const dayObj = (generatedPlan.days || []).find(d => (d.dayNumber || 1) === activePreviewDay) || generatedPlan.days?.[0]
                  if (!dayObj) return null
                  return (
                    <div>
                      <div className="aip-day-header">
                        <span className="aip-day-theme">{dayObj.theme || 'Exploration Day'}</span>
                        <span className="aip-day-city">{dayObj.city || destination}</span>
                      </div>
                      <div className="aip-activities-timeline">
                        {(dayObj.activities || []).map((act, idx) => (
                          <div key={idx} className="aip-timeline-item">
                            <div className="aip-timeline-dot" />
                            <div className="aip-act-body">
                              <div className="flex justify-between items-center">
                                <span className="aip-act-name">{act.name}</span>
                                <span className="aip-act-time">{act.time}</span>
                              </div>
                              <div className="flex justify-between items-center mt-1 text-xs text-slate-500">
                                <span className="aip-act-cat">{act.category} • {act.duration}</span>
                                <span className="aip-act-cost">₹{Number(act.costINR || 800).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Save & Launch Button */}
              <div className="aip-preview-footer">
                <button
                  type="button"
                  className="aip-regen-btn"
                  onClick={() => setGeneratedPlan(null)}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Modify Inputs</span>
                </button>
                <button
                  type="button"
                  className="aip-launch-btn"
                  onClick={handleStartJourney}
                >
                  <Check className="w-4 h-4" />
                  <span>Open in Trips Manager</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
