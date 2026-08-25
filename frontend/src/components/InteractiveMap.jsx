import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const KNOWN_DEST_COORDINATES = {
  ladakh: {
    lat: 34.1526, lng: 77.5771,
    checkpoints: [
      { name: 'Leh Main Bazaar & Palace', lat: 34.1642, lng: 77.5848, desc: 'Day 1: Acclimatization & Royal Palace' },
      { name: 'Thiksey Monastery Chants', lat: 34.0583, lng: 77.6667, desc: 'Day 2: Morning Monastery Puja' },
      { name: 'Khardung La High Pass', lat: 34.2787, lng: 77.6047, desc: 'Day 3: World High-Pass Transit' },
      { name: 'Diskit Monastery & Nubra Sand Dunes', lat: 34.5428, lng: 77.5619, desc: 'Day 4: Double-Humped Camel Safari' },
      { name: 'Pangong Tso Azure Lake', lat: 33.7595, lng: 78.6674, desc: 'Day 5: Lakeside Stargazing Camp' }
    ]
  },
  bali: {
    lat: -8.3405, lng: 115.0920,
    checkpoints: [
      { name: 'Ubud Sacred Monkey Forest & Rice Terraces', lat: -8.5188, lng: 115.2585, desc: 'Day 1: Jungle Oasis & Waterfall' },
      { name: 'Seminyak Coastal Sunset & Beach Club', lat: -8.6913, lng: 115.1682, desc: 'Day 2: Coastal Dining & Surfing' },
      { name: 'Uluwatu Clifftop Temple & Fire Dance', lat: -8.8291, lng: 115.0849, desc: 'Day 3: Kecak Dance & Ocean Cliff' },
      { name: 'Nusa Penida Kelingking T-Rex Beach', lat: -8.7504, lng: 115.4738, desc: 'Day 4: Island Speedboat Expedition' }
    ]
  },
  udaipur: {
    lat: 24.5854, lng: 73.7125,
    checkpoints: [
      { name: 'City Palace Complex & Durbar Hall', lat: 24.5764, lng: 73.6835, desc: 'Day 1: Royal Rajputana Architecture' },
      { name: 'Lake Pichola Sunset Yacht Sail', lat: 24.5778, lng: 73.6792, desc: 'Day 2: Golden Hour Island Palace' },
      { name: 'Saheliyon Ki Bari Royal Fountains', lat: 24.6038, lng: 73.6934, desc: 'Day 3: Marble Elephant Gardens' },
      { name: 'Bagore Ki Haveli Folk Spectacle', lat: 24.5796, lng: 73.6811, desc: 'Day 4: Rajasthani Dance & Puppetry' }
    ]
  },
  jaipur: {
    lat: 26.9124, lng: 75.7873,
    checkpoints: [
      { name: 'Amber Fort & Elephant Ramparts', lat: 26.9855, lng: 75.8513, desc: 'Day 1: Sheesh Mahal Mirror Palace' },
      { name: 'Hawa Mahal Honeycomb Facade', lat: 26.9239, lng: 75.8267, desc: 'Day 2: Heritage Pink City Walk' },
      { name: 'City Palace & Royal Armory Museum', lat: 26.9258, lng: 75.8237, desc: 'Day 3: Courtyards & Peacock Gate' },
      { name: 'Nahargarh Fort Golden Sunset Terrace', lat: 26.9372, lng: 75.8155, desc: 'Day 4: Panoramic City Skyline View' }
    ]
  },
  kerala: {
    lat: 9.9312, lng: 76.2673,
    checkpoints: [
      { name: 'Fort Kochi Chinese Fishing Nets', lat: 9.9656, lng: 76.2421, desc: 'Day 1: Colonial Spice Streets & Art' },
      { name: 'Munnar Misty Tea Plantations', lat: 10.0889, lng: 77.0595, desc: 'Day 2: High-Altitude Tea Estates' },
      { name: 'Alleppey Private Solar Houseboat', lat: 9.4981, lng: 76.3388, desc: 'Day 3: Lagoon Cruise & Ayurveda' },
      { name: 'Marari Quiet Coconut Beach', lat: 9.6006, lng: 76.2974, desc: 'Day 4: Coastal Rejuvenation' }
    ]
  },
  spiti: {
    lat: 32.2461, lng: 78.0349,
    checkpoints: [
      { name: 'Kaza Village & Spiti River Bed', lat: 32.2276, lng: 78.0710, desc: 'Day 1: High-Altitude Acclimatization' },
      { name: 'Key Gompa 1000-Year Monastic Citadel', lat: 32.2982, lng: 78.0125, desc: 'Day 2: Cliffside Chants & Library' },
      { name: 'Hikkim Highest Post Office in the World', lat: 32.2415, lng: 78.1065, desc: 'Day 3: Postcards from 4400m' },
      { name: 'Chandratal Moon Lake Stargazing Camp', lat: 32.4824, lng: 77.6171, desc: 'Day 4: Milky Way Star Trail' }
    ]
  },
  europe: {
    lat: 48.8566, lng: 2.3522,
    checkpoints: [
      { name: 'Paris Eiffel Tower & Seine Cruise', lat: 48.8584, lng: 2.2945, desc: 'Day 1-4: Art & Architecture' },
      { name: 'Rome Colosseum & Vatican Museums', lat: 41.8902, lng: 12.4922, desc: 'Day 5-9: Imperial Antiquity' },
      { name: 'Barcelona Sagrada Familia & Gothic Quarter', lat: 41.4036, lng: 2.1744, desc: 'Day 10-14: Mediterranean Culture' }
    ]
  }
}

export default function InteractiveMap({
  lat,
  lng,
  zoom = 11,
  locationName = 'Destination',
  height = '320px',
  checkpoints = null
}) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)

  const resolved = (() => {
    const locLower = (locationName || '').toLowerCase()
    for (const key of Object.keys(KNOWN_DEST_COORDINATES)) {
      if (locLower.includes(key)) return KNOWN_DEST_COORDINATES[key]
    }
    return {
      lat: lat || 26.9124,
      lng: lng || 75.7873,
      checkpoints: [
        { name: `${locationName} Central Highlight`, lat: lat || 26.9124, lng: lng || 75.7873, desc: 'Verified Expedition Stop' },
        { name: `${locationName} Scenic Vantage Point`, lat: (lat || 26.9124) + 0.04, lng: (lng || 75.7873) + 0.03, desc: 'Golden Hour Viewpoint' },
        { name: `${locationName} Local Culinary Trail`, lat: (lat || 26.9124) - 0.03, lng: (lng || 75.7873) + 0.05, desc: 'Signature Tasting Experience' },
      ]
    }
  })()

  const activePoints = checkpoints || resolved.checkpoints

  useEffect(() => {
    if (!mapRef.current) return

    if (mapInstance.current) {
      mapInstance.current.remove()
      mapInstance.current = null
    }

    const initialLat = resolved.lat
    const initialLng = resolved.lng

    const map = L.map(mapRef.current, {
      center: [initialLat, initialLng],
      zoom: zoom,
      zoomControl: false,
    })
    mapInstance.current = map

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    // Dark luxury Voyager tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    const latLngs = []

    activePoints.forEach((pt, index) => {
      latLngs.push([pt.lat, pt.lng])

      const pinIcon = L.divIcon({
        className: 'plan-yatri-route-pin',
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background: #18191E;
            border: 2px solid #D4A843;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 6px 18px rgba(0,0,0,0.6);
            color: #D4A843;
            font-size: 12px;
            font-weight: 800;
            cursor: pointer;
            transition: transform 0.2s;
          ">
            ${index + 1}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      L.marker([pt.lat, pt.lng], { icon: pinIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px; color: #18191E;">
            <span style="font-size: 10px; font-weight: 800; color: #D4A843; text-transform: uppercase;">STOP ${index + 1}</span>
            <h4 style="margin: 2px 0 4px; font-size: 13px; font-weight: 700;">${pt.name}</h4>
            <p style="margin: 0; font-size: 11px; color: #64748B;">${pt.desc || 'PlanYatri Curated Stop'}</p>
          </div>
        `)
    })

    // Draw luxury route polyline connecting waypoints
    if (latLngs.length > 1) {
      const polyline = L.polyline(latLngs, {
        color: '#D4A843',
        weight: 3.5,
        opacity: 0.85,
        dashArray: '6, 8',
        lineCap: 'round',
      }).addTo(map)

      map.fitBounds(polyline.getBounds(), { padding: [40, 40] })
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [locationName, activePoints, zoom, resolved.lat, resolved.lng])

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: height,
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(212,168,67,0.25)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      }}
    />
  )
}
