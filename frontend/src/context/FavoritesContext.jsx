import { createContext, useContext, useState, useEffect } from 'react'
import { WIKIMEDIA_REAL_IMAGES } from '../services/placeImageService'

const FavoritesContext = createContext()

export const INITIAL_FAVORITES = [
  {
    id: 'fav-ubud',
    name: 'Ubud, Bali',
    country: 'INDONESIA',
    category: 'Mountain',
    desc: 'Immerse yourself in the cultural heart of Bali, surrounded by emerald rice paddies and sacred temples.',
    img: WIKIMEDIA_REAL_IMAGES['bali'],
    isHero: true,
    targetDate: 'OCT 2026',
  },
  {
    id: 'fav-santorini',
    name: 'Santorini, Greece',
    country: 'GREECE',
    category: 'Beach',
    desc: 'Iconic whitewashed cliffside villages overlooking the Aegean caldera and world-famous sunsets.',
    img: WIKIMEDIA_REAL_IMAGES['santorini'],
    targetDate: 'JUN 2026',
  },
  {
    id: 'fav-cinqueterre',
    name: 'Amalfi & Cinque Terre, Italy',
    country: 'ITALY',
    category: 'Beach',
    desc: 'Vibrant pastel fishing villages nestled dramatically along the rugged Italian Riviera coastline.',
    img: WIKIMEDIA_REAL_IMAGES['amalfi'],
    targetDate: 'SEP 2026',
  },
  {
    id: 'fav-kyoto',
    name: 'Kyoto, Japan',
    country: 'JAPAN',
    category: 'City',
    desc: 'Centuries-old wooden shrines, tranquil Zen rock gardens, and magnificent spring cherry blossoms.',
    img: WIKIMEDIA_REAL_IMAGES['kyoto'],
    targetDate: 'NOV 2026',
  },
  {
    id: 'fav-ladakh',
    name: 'Pangong Tso & Ladakh',
    country: 'INDIA',
    category: 'Mountain',
    desc: 'Azure alpine lakes nestled at 14,000 ft beneath the towering snow peaks of the Indian Himalayas.',
    img: WIKIMEDIA_REAL_IMAGES['ladakh'],
    targetDate: 'AUG 2026',
  },
  {
    id: 'fav-kerala',
    name: 'Alleppey Backwaters',
    country: 'INDIA',
    category: 'Beach',
    desc: 'Glide on traditional handcrafted wooden houseboats through serene palm-fringed lagoons.',
    img: WIKIMEDIA_REAL_IMAGES['kerala'],
    targetDate: 'DEC 2026',
  },
]

export function FavoritesProvider({ children }) {
  const getUserKey = () => {
    try {
      const info = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
      if (!info || info.isDemo) return 'demo'
      return info.id || info._id || info.email || 'user'
    } catch {
      return 'demo'
    }
  }

  const [userKey, setUserKey] = useState(getUserKey)

  const [favorites, setFavorites] = useState(() => {
    const key = getUserKey()
    if (key === 'demo') {
      try {
        const saved = localStorage.getItem('planyatri_favorites_demo')
        return saved ? JSON.parse(saved) : INITIAL_FAVORITES
      } catch {
        return INITIAL_FAVORITES
      }
    } else {
      try {
        const saved = localStorage.getItem(`planyatri_favorites_${key}`)
        return saved ? JSON.parse(saved) : []
      } catch {
        return []
      }
    }
  })

  // Sync state if user switches login
  useEffect(() => {
    const currentKey = getUserKey()
    if (currentKey !== userKey) {
      setUserKey(currentKey)
      if (currentKey === 'demo') {
        const saved = localStorage.getItem('planyatri_favorites_demo')
        setFavorites(saved ? JSON.parse(saved) : INITIAL_FAVORITES)
      } else {
        const saved = localStorage.getItem(`planyatri_favorites_${currentKey}`)
        setFavorites(saved ? JSON.parse(saved) : [])
      }
    }
  }, [userKey])

  useEffect(() => {
    try {
      const storageKey = userKey === 'demo' ? 'planyatri_favorites_demo' : `planyatri_favorites_${userKey}`
      localStorage.setItem(storageKey, JSON.stringify(favorites))
    } catch (err) {
      console.warn('Failed to save favorites:', err)
    }
  }, [favorites, userKey])

  const toggleFavorite = (item) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === item.id || f.name === item.name)
      if (exists) {
        return prev.filter((f) => f.id !== item.id && f.name !== item.name)
      } else {
        return [
          {
            id: item.id || `fav-${Date.now()}`,
            name: item.name,
            country: item.country || 'INDIA',
            category: item.tag || item.category || 'Expedition',
            desc: item.description || item.desc || 'Curated luxury travel destination.',
            img: item.img || WIKIMEDIA_REAL_IMAGES['udaipur'],
            targetDate: '2026',
          },
          ...prev,
        ]
      }
    })
  }

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id))
  }

  const isFavorite = (id) => {
    return favorites.some((f) => f.id === id)
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
