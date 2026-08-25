'use client';

import { useEffect, useRef } from 'react'

export default function InteractiveMap({ lat = 24.5854, lng = 73.7125, zoom = 11, locationName = 'Udaipur, Rajasthan' }: any) {
  const mapRef = useRef<any>(null)
  const mapInstance = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current) return
    const L = typeof window !== 'undefined' ? require('leaflet') : null
    if (!L) return

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: zoom,
        zoomControl: false,
      })

      // Dark luxury tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(mapInstance.current)

      // Add custom gold pin
      const goldIcon = L.divIcon({
        className: 'custom-gold-marker',
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background: #0C1B2A;
            border: 2px solid #D4A843;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 14px rgba(212,168,67,0.4);
            cursor: pointer;
          ">
            <span style="color: #D4A843; font-size: 14px;">📍</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      })

      L.marker([lat, lng], { icon: goldIcon })
        .addTo(mapInstance.current)
        .bindPopup(`
          <div style="font-family: sans-serif; padding: 4px;">
            <strong style="color: #0C1B2A; font-size: 13px;">${locationName}</strong>
            <p style="margin: 2px 0 0; color: #D4A843; font-size: 11px; font-weight: 600;">PlanYatri Verified Expedition</p>
          </div>
        `)
        .openPopup()
    } else {
      mapInstance.current.setView([lat, lng], zoom)
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [lat, lng, zoom, locationName])

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '240px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(212,168,67,0.25)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      }}
    />
  )
}
