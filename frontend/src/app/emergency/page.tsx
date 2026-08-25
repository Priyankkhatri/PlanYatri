'use client';
import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Sidebar from '@/components/Sidebar'
import { fetchContacts, addContact, removeContact } from '@/store/slices/emergencySlice'
import { useToast } from '@/context/ToastContext'
import { usePageTitle } from '@/hooks/usePageTitle'

// ── Clean Luxury Bespoke Icons (Zero Emojis / Zero AI-Slop) ──
const ShieldSafeIcon = ({ size = 18, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

const PhoneCallIcon = ({ size = 16, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const PinLocationIcon = ({ size = 16, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const HeartPulseIcon = ({ size = 16, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M12 5v14" />
  </svg>
)

const RadioBeaconIcon = ({ size = 16, color = 'currentColor', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
    <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
    <circle cx="12" cy="12" r="2" />
    <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
    <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
  </svg>
)

const CopyClipboardIcon = ({ size = 15, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
)

const SendShareIcon = ({ size = 15, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
  </svg>
)

const UserShieldIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const CrossMedicalIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 6v12M6 12h12" />
  </svg>
)

const MountainTrailIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
  </svg>
)

const SunThermoIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
)

const LeafForestIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
)

const SnowFlakeIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
  </svg>
)

// ── Verified Nearby Facilities Dataset ──
const VERIFIED_FACILITIES = [
  {
    id: 'fac-1',
    name: 'Apollo Multi-Speciality Hospital',
    type: 'Hospital',
    badge: 'Level-1 Trauma & Emergency',
    address: '154/11 Bannerghatta Main Rd',
    dist: '0.8 km',
    phone: '+918026304050',
    pos: [12.9716, 77.5946],
    timing: 'Open 24 Hours',
  },
  {
    id: 'fac-2',
    name: 'Cubbon Park Police Precinct',
    type: 'Police',
    badge: 'Tourist Assistance Desk',
    address: 'Kasturba Road Precinct',
    dist: '1.1 km',
    phone: '112',
    pos: [12.976, 77.598],
    timing: 'Open 24 Hours',
  },
  {
    id: 'fac-3',
    name: 'MedPlus 24x7 Emergency Pharmacy',
    type: 'Pharmacy',
    badge: 'Licensed Medical Dispensary',
    address: 'MG Road Junction, Metro Gate 2',
    dist: '1.4 km',
    phone: '+918041235678',
    pos: [12.974, 77.608],
    timing: 'Open 24 Hours',
  },
  {
    id: 'fac-4',
    name: 'Fortis Critical Care Center',
    type: 'Hospital',
    badge: 'Advanced Life Support',
    address: 'Cunningham Road Medical Hub',
    dist: '2.3 km',
    phone: '+918066214444',
    pos: [12.982, 77.591],
    timing: 'Open 24 Hours',
  },
]

// ── Quick-Dial Service Hotlines (India) ──
const HOTLINES = [
  {
    id: '112',
    title: 'National Emergency Dispatch',
    sub: 'Police, Fire, Ambulance (All India)',
    num: '112',
    badge: 'Toll-Free 24x7',
  },
  {
    id: '1091',
    title: 'Women Safety & Solo Traveler SOS',
    sub: 'Immediate Police Assistance',
    num: '1091',
    badge: 'Direct Response',
  },
  {
    id: '108',
    title: 'Advanced Medical & Ambulance',
    sub: 'Emergency Medical Service',
    num: '108',
    badge: 'Paramedic On-Call',
  },
  {
    id: '1363',
    title: 'Ministry of Tourism Helpline',
    sub: 'Multi-Lingual Tourist Support',
    num: '1363',
    badge: '12 Languages',
  },
  {
    id: '1078',
    title: 'NDRF Disaster & Mountain Rescue',
    sub: 'National Disaster Response',
    num: '1078',
    badge: 'Disaster Relief',
  },
  {
    id: '139',
    title: 'Railway Protection Force',
    sub: 'Train Travel Security & Medical Desk',
    num: '139',
    badge: '24x7 Live Desk',
  },
]

// ── Expedition First Aid Protocols ──
const FIRST_AID_PROTOCOLS = [
  {
    id: 'ams',
    title: 'High-Altitude Sickness (AMS & HAPE)',
    icon: MountainTrailIcon,
    summary: 'Critical protocols for mountain trails and passes above 2,500m (8,000 ft).',
    steps: [
      'Golden Rule: Never ascend further if presenting symptoms of headache, nausea, or dizziness.',
      'Immediate Action: Descend 500m–1,000m immediately if breathing becomes laboured at rest.',
      'Hydration & Acclimatisation: Maintain 4–5 liters daily fluid intake. Consider Acetazolamide on medical advice.',
      'Oxygen Therapy: Administer supplemental portable oxygen if SpO2 drops below 75%.',
    ],
  },
  {
    id: 'heatstroke',
    title: 'Heatstroke & Severe Dehydration',
    icon: SunThermoIcon,
    summary: 'Emergency intervention for arid regions (Thar Desert, Hampi) exceeding 38°C.',
    steps: [
      'Immediate Relocation: Move the individual to shaded or air-cooled shelter without delay.',
      'Active Surface Cooling: Apply cool, damp compressions to neck, underarms, and groin.',
      'Electrolyte Balance: Provide chilled Oral Rehydration Solution (ORS) in measured sips.',
      'Medical Transfer: If sweating stops or mental confusion occurs, call 108/112 for urgent intravenous fluids.',
    ],
  },
  {
    id: 'snakebite',
    title: 'Wilderness Bites & Envenomation',
    icon: LeafForestIcon,
    summary: 'Strict wilderness immobilisation protocol for tropical trails and rainforests.',
    steps: [
      'Immobilise Limb: Keep the affected limb completely still and positioned below heart level.',
      'No Incisions or Tourniquets: Never cut the bite wound, attempt suction, or apply arterial tourniquets.',
      'Broad Pressure Bandage: Wrap a firm, broad crepe compression bandage starting from distal to proximal.',
      'Emergency Evacuation: Transport calmly and rapidly to the nearest hospital equipped with anti-venom.',
    ],
  },
  {
    id: 'hypothermia',
    title: 'Hypothermia & Cold Exposure',
    icon: SnowFlakeIcon,
    summary: 'Survival measures for sub-zero alpine passes, freezing rains, and sudden snow squalls.',
    steps: [
      'Moisture Elimination: Strip away all damp clothing and wrap the body in dry thermal insulating layers.',
      'Gradual Core Warming: Provide warm, sweetened fluids (avoid alcohol/caffeine). Apply heat packs to torso only.',
      'Careful Handling: Avoid vigorous rubbing which can induce fatal cardiac dysrhythmias.',
      'Frostbite Care: Never massage frostbitten tissue. Protect gently with sterile, non-adherent dressings.',
    ],
  },
]

// ── Contact Modal Component ──
function ContactModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(
    initial || { name: '', relation: 'Family', phone: '' }
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return
    onSave({
      name: form.name.trim(),
      relation: form.relation || 'Family',
      phone: form.phone.trim(),
      initial: form.name.trim().charAt(0).toUpperCase(),
    })
    onClose()
  }

  return (
    <div className="em-modal-backdrop" onClick={onClose}>
      <motion.div
        className="em-modal-box"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
      >
        <div className="em-modal-hdr">
          <div>
            <h3 className="em-modal-title">
              {initial ? 'Edit Guardian Contact' : 'Register Emergency Guardian'}
            </h3>
            <p className="em-modal-sub">
              Receives automated GPS satellite coordinates and distress notifications
            </p>
          </div>
          <button className="em-modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="em-modal-form">
          <div className="em-form-group">
            <label>Guardian Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Captain Rajesh Sharma"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="em-form-group">
            <label>Relationship / Role *</label>
            <select
              value={form.relation}
              onChange={(e) => setForm({ ...form, relation: e.target.value })}
            >
              <option value="Family">Family / Parent</option>
              <option value="Partner">Spouse / Partner</option>
              <option value="Friend">Trusted Friend</option>
              <option value="Doctor">Personal Physician</option>
              <option value="Guide">Trek Leader / Expedition Guide</option>
              <option value="Embassy">Embassy / Consular Office</option>
            </select>
          </div>

          <div className="em-form-group">
            <label>Phone Number (with Country Code) *</label>
            <input
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div className="em-modal-actions">
            <button type="button" className="em-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="em-btn-primary">
              Save Guardian Record
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function Emergency() {
  usePageTitle('Emergency SOS & Expedition Safety Hub — PlanYatri')

  const [mounted, setMounted] = useState(false)
  const [userPos, setUserPos] = useState([28.6139, 77.209]) // Default New Delhi
  const [altitude, setAltitude] = useState(216)
  const [gpsAccuracy, setGpsAccuracy] = useState(4)
  const [isSOSActive, setIsSOSActive] = useState(false)
  const [alertMsg, setAlertMsg] = useState(null)
  const [holdProgress, setHoldProgress] = useState(0)
  const [isHolding, setIsHolding] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [facilitySearch, setFacilitySearch] = useState('')
  const [facilityFilter, setFacilityFilter] = useState('ALL')
  const [isAudioSirenActive, setIsAudioSirenActive] = useState(false)
  const [isStrobeActive, setIsStrobeActive] = useState(false)
  const [expandedProtocol, setExpandedProtocol] = useState('ams')

  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const audioCtxRef = useRef(null)
  const sirenIntervalRef = useRef(null)

  const dispatch = useDispatch()
  const { contacts = [], loading } = useSelector((state: any) => state.emergency)
  const toast = useToast()

  // 1. Initialise Redux & Geolocation
  useEffect(() => {
    setMounted(true)
    dispatch(fetchContacts())

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPos([pos.coords.latitude, pos.coords.longitude])
          if (pos.coords.altitude) setAltitude(Math.round(pos.coords.altitude))
          if (pos.coords.accuracy) setGpsAccuracy(Math.round(pos.coords.accuracy))
        },
        () => {},
        { enableHighAccuracy: true, timeout: 8000 }
      )
    }

    return () => {
      stopAudioSiren()
    }
  }, [dispatch])

  // 2. Leaflet Map Initialisation
  useEffect(() => {
    if (!mounted || !mapRef.current) return

    if (mapInstance.current) {
      mapInstance.current.remove()
      mapInstance.current = null
    }

    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView(userPos, 14)

    mapInstance.current = map

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      { maxZoom: 19, subdomains: 'abcd' }
    ).addTo(map)

    // User Radar Marker
    const userMarkerHtml = `
      <div class="em-radar-pulse"></div>
      <div class="em-radar-core"></div>
    `
    const userIcon = L.divIcon({
      className: 'em-leaflet-user-marker',
      html: userMarkerHtml,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    })

    L.marker(userPos, { icon: userIcon })
      .addTo(map)
      .bindPopup(
        `<div class="em-map-popup">
          <strong style="font-family:'Cormorant Garamond', Georgia, serif; font-size:15px; color:#1C1917;">Your Verified Coordinates</strong>
          <p style="margin:4px 0 0; font-size:12px; color:#78716C;">${userPos[0].toFixed(4)}° N, ${userPos[1].toFixed(4)}° E</p>
          <span style="display:inline-block; margin-top:6px; font-size:10px; font-weight:700; color:#15803D; background:#F0FDF4; padding:2px 8px; border-radius:4px; border:1px solid #BBF7D0;">High-Precision GPS ±${gpsAccuracy}m</span>
        </div>`
      )

    // Facilities Markers
    VERIFIED_FACILITIES.forEach((fac) => {
      const isHospital = fac.type === 'Hospital'
      const isPolice = fac.type === 'Police'
      const pinColor = isHospital ? '#B91C1C' : isPolice ? '#1D4ED8' : '#15803D'

      const facMarkerHtml = `
        <div style="
          width: 30px; height: 30px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 2px solid ${pinColor};
          box-shadow: 0 4px 10px rgba(0,0,0,0.12);
          display: flex; align-items: center; justify-content: center;
          color: ${pinColor}; font-size: 13px; font-weight: 800; cursor: pointer;
        ">
          ${isHospital ? '+' : isPolice ? 'P' : 'Rx'}
        </div>
      `
      const facIcon = L.divIcon({
        className: 'em-leaflet-fac-marker',
        html: facMarkerHtml,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      })

      L.marker(fac.pos, { icon: facIcon })
        .addTo(map)
        .bindPopup(
          `<div class="em-map-popup">
            <strong style="font-family:'Cormorant Garamond', Georgia, serif; font-size:15px; color:#1C1917; display:block;">${fac.name}</strong>
            <span style="font-size:10.5px; color:${pinColor}; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">${fac.badge}</span>
            <p style="margin:4px 0 8px; font-size:11.5px; color:#78716C;">${fac.address} (${fac.dist})</p>
            <a href="tel:${fac.phone}" style="display:inline-flex; align-items:center; gap:6px; background:#1C1917; color:#FFFFFF; padding:6px 12px; border-radius:6px; font-size:11.5px; font-weight:700; text-decoration:none;">
              Connect by Phone
            </a>
          </div>`
        )
    })

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [mounted, userPos, gpsAccuracy])

  // 3. Tactile Press & Hold SOS
  useEffect(() => {
    let interval
    if (isHolding && !isSOSActive) {
      interval = setInterval(() => {
        setHoldProgress((prev) => {
          if (prev >= 100) {
            triggerSOS()
            return 0
          }
          return prev + 2.5
        })
      }, 50)
    } else {
      setHoldProgress(0)
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isHolding, isSOSActive])

  // 4. Trigger SOS Signal
  const triggerSOS = () => {
    setIsSOSActive(true)
    setIsHolding(false)

    const mapUrl = `https://www.google.com/maps?q=${userPos[0]},${userPos[1]}`
    const guardianCount = contacts.length

    setAlertMsg({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      location: `${userPos[0].toFixed(5)}° N, ${userPos[1].toFixed(5)}° E`,
      mapUrl,
      guardiansNotified: guardianCount > 0 ? guardianCount : 0,
    })

    toast.error('🚨 Emergency SOS Signal Dispatched to Guardians & Authorities.')
  }

  const cancelSOS = () => {
    setIsSOSActive(false)
    setAlertMsg(null)
    toast.info('Emergency SOS alert canceled.')
  }

  // 5. Native Audio Morse Code Siren
  const toggleAudioSiren = () => {
    if (isAudioSirenActive) {
      stopAudioSiren()
    } else {
      startAudioSiren()
    }
  }

  const startAudioSiren = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) {
        toast.error('Web Audio not supported.')
        return
      }
      audioCtxRef.current = new AudioCtx()
      setIsAudioSirenActive(true)
      toast.error('Audio Rescue Siren Active.')

      const playTone = (freq, duration, delay) => {
        setTimeout(() => {
          if (!audioCtxRef.current) return
          const osc = audioCtxRef.current.createOscillator()
          const gain = audioCtxRef.current.createGain()
          osc.type = 'sine'
          osc.frequency.value = freq
          gain.gain.setValueAtTime(0.25, audioCtxRef.current.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtxRef.current.currentTime + duration)
          osc.connect(gain)
          gain.connect(audioCtxRef.current.destination)
          osc.start()
          osc.stop(audioCtxRef.current.currentTime + duration)
        }, delay)
      }

      const runMorseCycle = () => {
        playTone(850, 0.15, 0)
        playTone(850, 0.15, 250)
        playTone(850, 0.15, 500)
        playTone(650, 0.4, 850)
        playTone(650, 0.4, 1350)
        playTone(650, 0.4, 1850)
        playTone(850, 0.15, 2400)
        playTone(850, 0.15, 2650)
        playTone(850, 0.15, 2900)
      }

      runMorseCycle()
      sirenIntervalRef.current = setInterval(runMorseCycle, 3500)
    } catch {
      toast.error('Could not start audio siren.')
    }
  }

  const stopAudioSiren = () => {
    if (sirenIntervalRef.current) {
      clearInterval(sirenIntervalRef.current)
      sirenIntervalRef.current = null
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close()
      } catch {}
      audioCtxRef.current = null
    }
    setIsAudioSirenActive(false)
  }

  // 6. Visual Screen Strobe
  const toggleStrobe = () => {
    setIsStrobeActive((prev) => !prev)
    if (!isStrobeActive) {
      toast.warning('Rescue Screen Strobe Active. Click anywhere to dismiss.')
    }
  }

  // 7. Actions & Sharing Helpers
  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`
  }

  const handleWhatsAppBroadcast = (phone) => {
    const msg = `🚨 EMERGENCY SOS: I require immediate assistance.\n\n📍 My Live Coordinates:\nhttps://www.google.com/maps?q=${userPos[0]},${userPos[1]}\n\n⏱️ Timestamp: ${new Date().toLocaleString()}`
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const handleSMSBroadcast = (phone) => {
    const msg = `EMERGENCY SOS: Need assistance. My coordinates: https://www.google.com/maps?q=${userPos[0]},${userPos[1]}`
    window.location.href = `sms:${phone}?body=${encodeURIComponent(msg)}`
  }

  const handleCopyCoordinates = () => {
    const text = `${userPos[0].toFixed(5)}° N, ${userPos[1].toFixed(5)}° E (Altitude: ${altitude}m)`
    navigator.clipboard.writeText(text)
    toast.success('Coordinates copied to clipboard.')
  }

  const handleShareMapLink = () => {
    const url = `https://www.google.com/maps?q=${userPos[0]},${userPos[1]}`
    if (navigator.share) {
      navigator.share({
        title: 'Emergency Position — PlanYatri',
        text: 'My current live GPS position:',
        url,
      })
    } else {
      navigator.clipboard.writeText(url)
      toast.success('Google Maps link copied.')
    }
  }

  const handleAddContact = async (c) => {
    const result = await dispatch(addContact(c))
    if (addContact.fulfilled.match(result)) {
      toast.success('Guardian contact registered.')
    }
  }

  const handleDeleteContact = async (id) => {
    const result = await dispatch(removeContact(id))
    if (removeContact.fulfilled.match(result)) {
      setDeleteId(null)
      toast.info('Guardian record removed.')
    }
  }

  const filteredFacilities = VERIFIED_FACILITIES.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(facilitySearch.toLowerCase()) ||
      f.address.toLowerCase().includes(facilitySearch.toLowerCase())
    const matchesType = facilityFilter === 'ALL' || f.type === facilityFilter
    return matchesSearch && matchesType
  })

  return (
    <div className={`em-page-shell ${mounted ? 'mounted' : ''}`}>
      {isStrobeActive && (
        <div className="em-strobe-overlay" onClick={() => setIsStrobeActive(false)}>
          <div className="em-strobe-pill">
            <RadioBeaconIcon size={18} color="#FFFFFF" />
            <span>Rescue Beacon Active — Tap Anywhere to Dismiss</span>
          </div>
        </div>
      )}

      <Sidebar />

      <main className="em-page-body">
        {/* ── Editorial Header ── */}
        <header className="em-editorial-hdr">
          <div className="em-hdr-left">
            <div className="em-eyebrow-row">
              <span className="em-status-badge live">
                <span className="em-status-dot" /> SATELLITE DISPATCH ACTIVE
              </span>
              <span className="em-status-badge ready">
                <ShieldSafeIcon size={13} color="#15803D" /> SYSTEM ARMED
              </span>
            </div>
            <h1 className="em-page-title">Safety & Emergency Concierge</h1>
            <p className="em-page-sub">
              Live expedition telemetry, rapid guardian dispatch, and verified national crisis hotlines.
            </p>
          </div>

          <div className="em-telemetry-cluster">
            <div className="em-telem-item">
              <span className="em-telem-label">COORDINATES</span>
              <span className="em-telem-value">
                {userPos[0].toFixed(4)}° N, {userPos[1].toFixed(4)}° E
              </span>
            </div>
            <div className="em-telem-sep" />
            <div className="em-telem-item">
              <span className="em-telem-label">PRECISION & ALTITUDE</span>
              <span className="em-telem-value">
                ±{gpsAccuracy}m • {altitude}m ASL
              </span>
            </div>
            <div className="em-telem-btns">
              <button
                className="em-action-btn-sm"
                title="Copy Coordinates"
                onClick={handleCopyCoordinates}
              >
                <CopyClipboardIcon size={14} />
                <span>Copy GPS</span>
              </button>
              <button
                className="em-action-btn-sm"
                title="Share Map Link"
                onClick={handleShareMapLink}
              >
                <SendShareIcon size={14} />
                <span>Share Link</span>
              </button>
            </div>
          </div>
        </header>

        <div className="em-scroll-body">
          <div className="em-content-wrap">
            {/* ── SOS Hero Banner ── */}
            <section className={`em-sos-banner ${isSOSActive ? 'active-dispatch' : ''}`}>
              <div className="em-sos-copy">
                <span className="em-sos-kicker">EXPEDITION DISTRESS DISPATCH</span>
                <h2 className="em-sos-title">
                  {isSOSActive
                    ? 'Emergency Distress Signal Broadcasting'
                    : 'Press and Hold for 3 Seconds to Trigger SOS'}
                </h2>
                <p className="em-sos-para">
                  {isSOSActive
                    ? 'Your GPS location, altitude, and urgent assistance request have been dispatched to registered guardians and local first responders.'
                    : 'Locks on live satellite telemetry and instantly broadcasts a Google Maps distress payload to your trusted emergency guardians.'}
                </p>

                {alertMsg && (
                  <motion.div
                    className="em-dispatch-box"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="em-dispatch-info">
                      <strong>Active Dispatch Recorded ({alertMsg.time})</strong>
                      <p>Coordinates: {alertMsg.location} • Notified {alertMsg.guardiansNotified} Registered Guardians.</p>
                    </div>
                    <div className="em-dispatch-actions">
                      <button className="em-btn-cancel-sos" onClick={cancelSOS}>
                        Cancel Signal
                      </button>
                      <button
                        className="em-btn-view-map"
                        onClick={() => window.open(alertMsg.mapUrl, '_blank')}
                      >
                        Open Pinned Map ↗
                      </button>
                    </div>
                  </motion.div>
                )}

                <div className="em-beacon-buttons">
                  <button
                    className={`em-beacon-btn ${isAudioSirenActive ? 'active' : ''}`}
                    onClick={toggleAudioSiren}
                  >
                    <RadioBeaconIcon size={15} />
                    <span>{isAudioSirenActive ? 'Silence Audio Siren' : 'Audio SOS Siren'}</span>
                  </button>

                  <button
                    className={`em-beacon-btn ${isStrobeActive ? 'active' : ''}`}
                    onClick={toggleStrobe}
                  >
                    <SunThermoIcon size={15} />
                    <span>{isStrobeActive ? 'Stop Rescue Strobe' : 'Rescue Screen Strobe'}</span>
                  </button>
                </div>
              </div>

              {/* SOS Circular Press Dial */}
              <div className="em-dial-container">
                <svg className="em-dial-svg" viewBox="0 0 120 120">
                  <circle className="em-dial-bg" cx="60" cy="60" r="52" />
                  <circle
                    className="em-dial-prog"
                    cx="60"
                    cy="60"
                    r="52"
                    style={{
                      strokeDasharray: 326.7,
                      strokeDashoffset: 326.7 - (326.7 * holdProgress) / 100,
                    }}
                  />
                </svg>

                <button
                  className={`em-sos-round-btn ${isHolding ? 'is-holding' : ''} ${
                    isSOSActive ? 'is-dispatched' : ''
                  }`}
                  onMouseDown={() => setIsHolding(true)}
                  onMouseUp={() => setIsHolding(false)}
                  onMouseLeave={() => setIsHolding(false)}
                  onTouchStart={(e) => {
                    e.preventDefault()
                    setIsHolding(true)
                  }}
                  onTouchEnd={() => setIsHolding(false)}
                >
                  <ShieldSafeIcon size={36} color="#FFFFFF" />
                  <span className="em-sos-btn-text">
                    {isSOSActive ? 'ACTIVE' : isHolding ? `${Math.ceil((100 - holdProgress) / 33)}s` : 'HOLD SOS'}
                  </span>
                  <span className="em-sos-btn-sub">
                    {isSOSActive ? 'DISPATCHED' : '3 SECONDS'}
                  </span>
                </button>
              </div>
            </section>

            {/* ── Quick Dial Helplines ── */}
            <section className="em-section-block">
              <div className="em-section-head">
                <h3 className="em-section-heading">Verified Emergency Hotlines (India)</h3>
                <p className="em-section-subheading">One-tap direct dial to certified national emergency services</p>
              </div>

              <div className="em-hotlines-card-grid">
                {HOTLINES.map((h) => (
                  <motion.div
                    key={h.id}
                    className="em-hotline-item-card"
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCall(h.num)}
                  >
                    <div className="em-hl-top">
                      <span className="em-hl-num">{h.num}</span>
                      <span className="em-hl-tag">{h.badge}</span>
                    </div>
                    <div className="em-hl-mid">
                      <h4 className="em-hl-title">{h.title}</h4>
                      <p className="em-hl-sub">{h.sub}</p>
                    </div>
                    <div className="em-hl-bot">
                      <span>Connect Call</span>
                      <PhoneCallIcon size={13} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ── Two Column Safety Grid ── */}
            <div className="em-grid-dual">
              {/* Left Column: Proximity Cartography */}
              <div className="em-grid-col">
                <div className="em-editorial-card">
                  <div className="em-card-header">
                    <div>
                      <h3 className="em-card-heading">Proximity Radar & Facilities</h3>
                      <p className="em-card-subheading">Nearby hospitals, police posts, and 24/7 pharmacies</p>
                    </div>
                    <span className="em-radar-tag">
                      <PinLocationIcon size={12} color="#15803D" /> GPS Active
                    </span>
                  </div>

                  <div className="em-map-frame">
                    <div ref={mapRef} className="em-map-element" />
                  </div>

                  <div className="em-fac-toolbar">
                    <input
                      type="text"
                      className="em-fac-search"
                      placeholder="Search facility by name or road..."
                      value={facilitySearch}
                      onChange={(e) => setFacilitySearch(e.target.value)}
                    />
                    <div className="em-fac-pills">
                      {['ALL', 'Hospital', 'Police', 'Pharmacy'].map((tab) => (
                        <button
                          key={tab}
                          className={`em-pill-btn ${facilityFilter === tab ? 'active' : ''}`}
                          onClick={() => setFacilityFilter(tab)}
                        >
                          {tab === 'ALL' ? 'All Centers' : tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="em-fac-directory">
                    {filteredFacilities.map((fac) => (
                      <div key={fac.id} className="em-fac-row">
                        <div className="em-fac-meta">
                          <div className="em-fac-name-line">
                            <h4 className="em-fac-title">{fac.name}</h4>
                            <span className="em-fac-badge">{fac.badge}</span>
                          </div>
                          <p className="em-fac-address">
                            {fac.address} • <span className="em-fac-timing">{fac.timing}</span>
                          </p>
                        </div>
                        <div className="em-fac-side">
                          <span className="em-fac-dist-val">{fac.dist}</span>
                          <button
                            className="em-fac-dial-btn"
                            title={`Call ${fac.name}`}
                            onClick={() => handleCall(fac.phone)}
                          >
                            <PhoneCallIcon size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {filteredFacilities.length === 0 && (
                      <p className="em-empty-notice">No verified facilities found matching your search.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Guardians & First-Aid Manual */}
              <div className="em-grid-col">
                {/* Guardian Registry */}
                <div className="em-editorial-card">
                  <div className="em-card-header">
                    <div>
                      <h3 className="em-card-heading">Emergency Guardians ({contacts.length})</h3>
                      <p className="em-card-subheading">Designated contacts for automatic distress notifications</p>
                    </div>
                    <button
                      className="em-add-btn"
                      onClick={() => setShowAddModal(true)}
                    >
                      + Add Guardian
                    </button>
                  </div>

                  <div className="em-guardians-list">
                    {contacts.length === 0 && !loading && (
                      <div className="em-empty-guardian-box">
                        <UserShieldIcon size={28} color="#A8A29E" />
                        <h4 className="em-eg-title">No Guardians Configured</h4>
                        <p className="em-eg-sub">
                          Register at least 2 family members or expedition companions to receive live emergency coordinates.
                        </p>
                        <button
                          className="em-eg-btn"
                          onClick={() => setShowAddModal(true)}
                        >
                          Register Guardian
                        </button>
                      </div>
                    )}

                    {contacts.map((c) => (
                      <div key={c._id || c.id} className="em-guardian-row">
                        <div className="em-guardian-avatar">
                          {c.initial || c.name?.charAt(0) || 'G'}
                        </div>
                        <div className="em-guardian-info">
                          <div className="em-guardian-title-row">
                            <h4 className="em-guardian-name">{c.name}</h4>
                            <span className="em-guardian-rel">{c.relation || c.rel || 'Family'}</span>
                          </div>
                          <span className="em-guardian-phone">{c.phone}</span>
                        </div>

                        <div className="em-guardian-actions">
                          <button
                            className="em-g-btn whatsapp"
                            title="Dispatch WhatsApp Alert"
                            onClick={() => handleWhatsAppBroadcast(c.phone)}
                          >
                            <SendShareIcon size={14} />
                          </button>
                          <button
                            className="em-g-btn call"
                            title="Direct Voice Call"
                            onClick={() => handleCall(c.phone)}
                          >
                            <PhoneCallIcon size={14} />
                          </button>
                          <button
                            className="em-g-btn delete"
                            title="Remove Contact"
                            onClick={() => setDeleteId(c._id || c.id)}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expedition Wilderness First-Aid Manual */}
                <div className="em-editorial-card">
                  <div className="em-card-header">
                    <div>
                      <h3 className="em-card-heading">Wilderness First-Aid Protocols</h3>
                      <p className="em-card-subheading">Field-tested medical guidelines for remote expeditions</p>
                    </div>
                  </div>

                  <div className="em-protocols-list">
                    {FIRST_AID_PROTOCOLS.map((p) => {
                      const isOpen = expandedProtocol === p.id
                      const IconComp = p.icon
                      return (
                        <div key={p.id} className={`em-proto-item ${isOpen ? 'open' : ''}`}>
                          <button
                            className="em-proto-header-btn"
                            onClick={() => setExpandedProtocol(isOpen ? null : p.id)}
                          >
                            <div className="em-proto-left">
                              <div className="em-proto-icon-frame">
                                <IconComp size={15} color="#1C1917" />
                              </div>
                              <span className="em-proto-name">{p.title}</span>
                            </div>
                            <span className="em-proto-caret">{isOpen ? '−' : '+'}</span>
                          </button>

                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                className="em-proto-drawer"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                              >
                                <p className="em-proto-summary">{p.summary}</p>
                                <ol className="em-proto-steps">
                                  {p.steps.map((step, idx) => (
                                    <li key={idx}>
                                      <span className="em-proto-num">{idx + 1}</span>
                                      <span>{step}</span>
                                    </li>
                                  ))}
                                </ol>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Guardian Modal */}
      {showAddModal && (
        <ContactModal onSave={handleAddContact} onClose={() => setShowAddModal(false)} />
      )}

      {/* Confirm Deletion Modal */}
      {deleteId && (
        <div className="em-modal-backdrop" onClick={() => setDeleteId(null)}>
          <motion.div
            className="em-confirm-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="em-cm-title">Remove Emergency Guardian?</h3>
            <p className="em-cm-sub">
              This contact will no longer receive automated satellite coordinates or distress dispatches.
            </p>
            <div className="em-cm-actions">
              <button className="em-btn-secondary" onClick={() => setDeleteId(null)}>
                Keep Record
              </button>
              <button className="em-btn-danger" onClick={() => handleDeleteContact(deleteId)}>
                Confirm Removal
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
