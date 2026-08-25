import { useState, useEffect, useRef } from 'react'

export default function GoogleAnimatedMap({
  locationName = 'Jaipur, Rajasthan',
  originName = 'New Delhi',
  destName = 'Jaipur',
  daysPlan = [],
  height = '360px',
}: any) {
  const [activeTab, setActiveTab] = useState('animated') // 'animated' | 'google_street' | 'google_sat'
  const [animProgress, setAnimProgress] = useState(0)
  const animRef = useRef<any>(null)

  // Smooth 60 FPS Bézier curve animation loop
  useEffect(() => {
    let startTime: any = null
    const duration = 5000 // 5 seconds smooth trip cycle

    const animate = (timestamp: any) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = (elapsed % duration) / duration
      setAnimProgress(progress)
      animRef.current = requestAnimationFrame(animate)
    }

    animRef.current = requestAnimationFrame(animate)
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  const queryLoc = locationName || destName || 'Jaipur, India'
  const googleMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(queryLoc)}&t=${activeTab === 'google_sat' ? 'k' : 'm'}&z=11&ie=UTF8&iwloc=&output=embed`
  const googleExternalUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryLoc)}`

  // Quadratic Bézier curve Math for SVG ViewBox (0,0 -> 1000,400)
  // P0 = (100, 280), P1 = (500, 40), P2 = (900, 280)
  const t = animProgress
  const p0 = { x: 100, y: 280 }
  const p1 = { x: 500, y: 40 }
  const p2 = { x: 900, y: 280 }

  const bx = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x
  const by = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y

  // Derivative for tangent direction angle
  const dx = 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x)
  const dy = 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y)
  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI

  // Milestones calculation
  const milestones = daysPlan.length > 0 ? daysPlan.slice(0, 4) : [
    { dayNumber: 1, city: originName, theme: 'Arrival & Check-in' },
    { dayNumber: 2, city: destName, theme: 'Heritage & Sightseeing' },
    { dayNumber: 3, city: destName, theme: 'Bazaars & Sunset Vistas' },
  ]

  const activeMilestoneIndex = Math.min(
    milestones.length - 1,
    Math.floor(animProgress * milestones.length)
  )

  return (
    <div
      style={{
        width: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(212,168,67,0.35)',
        background: '#07111E',
        boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
        color: '#FBF9F5',
        margin: '18px 0',
      }}
    >
      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          background: '#0C1B2A',
          borderBottom: '1px solid rgba(212,168,67,0.2)',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(212,168,67,0.15)',
              border: '1px solid #D4A843',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D4A843',
              fontSize: '14px',
            }}
          >
            ✈️
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#FFF' }}>
              {originName} ➔ {destName}
            </h4>
            <span style={{ fontSize: '10px', color: '#D4A843', fontWeight: 600 }}>
              GOOGLE MAPS PLATFORM • 100% FREE API
            </span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button
            onClick={() => setActiveTab('animated')}
            style={{
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '6px',
              border: activeTab === 'animated' ? '1px solid #D4A843' : '1px solid rgba(255,255,255,0.15)',
              background: activeTab === 'animated' ? '#D4A843' : 'rgba(255,255,255,0.05)',
              color: activeTab === 'animated' ? '#0C1B2A' : '#CBD5E1',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            ✨ Animated Route
          </button>
          <button
            onClick={() => setActiveTab('google_street')}
            style={{
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '6px',
              border: activeTab === 'google_street' ? '1px solid #D4A843' : '1px solid rgba(255,255,255,0.15)',
              background: activeTab === 'google_street' ? '#D4A843' : 'rgba(255,255,255,0.05)',
              color: activeTab === 'google_street' ? '#0C1B2A' : '#CBD5E1',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            🗺️ Google Maps Live
          </button>
          <button
            onClick={() => setActiveTab('google_sat')}
            style={{
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '6px',
              border: activeTab === 'google_sat' ? '1px solid #D4A843' : '1px solid rgba(255,255,255,0.15)',
              background: activeTab === 'google_sat' ? '#D4A843' : 'rgba(255,255,255,0.05)',
              color: activeTab === 'google_sat' ? '#0C1B2A' : '#CBD5E1',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            🛰️ Satellite
          </button>

          <a
            href={googleExternalUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '6px 10px',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.08)',
              color: '#38BDF8',
              textDecoration: 'none',
              border: '1px solid rgba(56,189,248,0.3)',
            }}
          >
            Open in Google Maps ↗
          </a>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ position: 'relative', width: '100%', height: height, background: '#07111E' }}>
        {activeTab === 'animated' ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              background: 'radial-gradient(ellipse at 50% 50%, #0F253B 0%, #050B12 100%)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '20px',
              boxSizing: 'border-box',
            }}
          >
            {/* Grid Pattern Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'radial-gradient(rgba(212, 168, 67, 0.12) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
                pointerEvents: 'none',
              }}
            />

            {/* Top Node & Live Status */}
            <div style={{ position: 'relative', zIndex: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(12, 27, 42, 0.9)', backdropFilter: 'blur(10px)', padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
                <span style={{ fontSize: '9px', color: '#38BDF8', fontWeight: 700, letterSpacing: '1px' }}>DEPARTURE</span>
                <h5 style={{ margin: 0, fontSize: '14px', color: '#FFF', fontWeight: 700 }}>{originName}</h5>
              </div>

              <div style={{ background: 'rgba(12, 27, 42, 0.9)', backdropFilter: 'blur(10px)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(212, 168, 67, 0.4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 10px #10B981' }} />
                <span style={{ fontSize: '11px', color: '#D4A843', fontWeight: 700 }}>GPS FLIGHT PATH ACTIVE</span>
              </div>

              <div style={{ background: 'rgba(12, 27, 42, 0.9)', backdropFilter: 'blur(10px)', padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                <span style={{ fontSize: '9px', color: '#10B981', fontWeight: 700, letterSpacing: '1px' }}>DESTINATION</span>
                <h5 style={{ margin: 0, fontSize: '14px', color: '#FFF', fontWeight: 700 }}>{destName}</h5>
              </div>
            </div>

            {/* SVG Responsive Scaling Canvas */}
            <svg
              viewBox="0 0 1000 400"
              preserveAspectRatio="xMidYMid meet"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
            >
              <defs>
                <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="50%" stopColor="#D4A843" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
                <filter id="neonGlow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background Arc Shadow */}
              <path
                d="M 100,280 Q 500,40 900,280"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="6"
              />

              {/* Glowing Arc Line */}
              <path
                d="M 100,280 Q 500,40 900,280"
                fill="none"
                stroke="url(#curveGradient)"
                strokeWidth="3.5"
                strokeDasharray="10 6"
                filter="url(#neonGlow)"
              />

              {/* Start & End City Anchors */}
              <circle cx="100" cy="280" r="8" fill="#38BDF8" filter="url(#neonGlow)" />
              <circle cx="900" cy="280" r="8" fill="#10B981" filter="url(#neonGlow)" />

              {/* Moving Airplane & Pulse Aura */}
              <g transform={`translate(${bx}, ${by}) rotate(${angleDeg})`}>
                <circle r="18" fill="rgba(212, 168, 67, 0.25)" />
                <circle r="8" fill="#D4A843" filter="url(#neonGlow)" />
                {/* Airplane SVG Shape */}
                <path
                  d="M 12 0 L -8 -7 L -4 0 L -8 7 Z"
                  fill="#FFFFFF"
                />
              </g>
            </svg>

            {/* Bottom Interactive Milestones Row */}
            <div style={{ position: 'relative', zIndex: 3, display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              {milestones.map((m: any, idx: any) => {
                const isActive = idx === activeMilestoneIndex
                return (
                  <div
                    key={idx}
                    style={{
                      background: isActive ? 'rgba(212, 168, 67, 0.2)' : 'rgba(12, 27, 42, 0.85)',
                      backdropFilter: 'blur(8px)',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      border: isActive ? '1px solid #D4A843' : '1px solid rgba(255,255,255,0.1)',
                      boxShadow: isActive ? '0 0 16px rgba(212,168,67,0.3)' : 'none',
                      textAlign: 'center',
                      minWidth: '120px',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <span style={{ fontSize: '9px', color: isActive ? '#D4A843' : '#94A3B8', fontWeight: 700 }}>
                      {isActive ? '▶ ACTIVE STEP' : `DAY ${m.dayNumber || idx + 1}`}
                    </span>
                    <p style={{ fontSize: '11px', color: '#FFF', fontWeight: 600, margin: '2px 0 0' }}>{m.theme || m.city}</p>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <iframe
            title={`Google Map - ${queryLoc}`}
            src={googleMapUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              filter: activeTab === 'google_sat' ? 'contrast(1.05)' : 'none',
            }}
            loading="lazy"
            allowFullScreen
          />
        )}
      </div>
    </div>
  )
}
