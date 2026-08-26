import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircleIcon, SparkleIcon } from './icons/LuxuryIcons'
import { Sparkles, Check, Plus, Trash2, Search, Filter, ShieldCheck, CheckCheck, Briefcase } from 'lucide-react'
import './PackingChecklistModal.css'

const PACKING_PRESETS = {
  Culture: [
    { id: 'c1', item: 'Modest clothing for temples & monuments', category: 'Clothing', checked: true },
    { id: 'c2', item: 'Slip-on comfortable walking shoes', category: 'Footwear', checked: false },
    { id: 'c3', item: 'Universal power adapter & 20,000mAh power bank', category: 'Electronics', checked: true },
    { id: 'c4', item: 'Passport & Visa physical photocopies + digital backup', category: 'Documents', checked: false },
    { id: 'c5', item: 'Hand sanitizer & biodegradable wet wipes', category: 'Hygiene', checked: false },
    { id: 'c6', item: 'Compact travel umbrella or light poncho', category: 'Gear', checked: false },
  ],
  Beach: [
    { id: 'b1', item: 'Reef-safe sunscreen (SPF 50+ mineral)', category: 'Skin & Health', checked: true },
    { id: 'b2', item: 'Quick-dry microfiber beach towels', category: 'Gear', checked: false },
    { id: 'b3', item: 'UV-blocking polarized sunglasses & sunhat', category: 'Accessories', checked: true },
    { id: 'b4', item: 'IPX8 Waterproof phone lanyard pouch', category: 'Electronics', checked: false },
    { id: 'b5', item: 'Swimwear & breathable linen shirts', category: 'Clothing', checked: false },
    { id: 'b6', item: 'Aloe vera cooling soothing gel', category: 'Skin & Health', checked: false },
  ],
  Mountain: [
    { id: 'm1', item: 'Merino wool thermal base layers & windbreaker', category: 'Clothing', checked: true },
    { id: 'm2', item: 'Gore-Tex waterproof trekking boots with ankle support', category: 'Footwear', checked: false },
    { id: 'm3', item: 'High-altitude acclimatization medication (Diamox)', category: 'Medical', checked: false },
    { id: 'm4', item: 'Rechargeable headlamp with backup batteries', category: 'Gear', checked: true },
    { id: 'm5', item: 'Electrolyte hydration powder packs', category: 'Health', checked: false },
    { id: 'm6', item: 'Polarized glacier sunglasses (Category 3/4)', category: 'Gear', checked: false },
  ],
  General: [
    { id: 'g1', item: 'Comprehensive travel insurance policy card', category: 'Documents', checked: true },
    { id: 'g2', item: 'Prescription medicines in original labelled bottles', category: 'Medical', checked: false },
    { id: 'g3', item: 'RFID-blocking passport wallet & backup cards', category: 'Security', checked: true },
    { id: 'g4', item: 'Active noise-canceling headphones for long flights', category: 'Electronics', checked: false },
    { id: 'g5', item: 'Compact travel first-aid & blister prevention kit', category: 'Medical', checked: false },
  ],
}

const CATEGORIES = ['All', 'Clothing', 'Footwear', 'Electronics', 'Documents', 'Medical', 'Gear', 'General']

export default function PackingChecklistModal({ trip, onClose }) {
  const storageKey = `planyatri_pack_${trip?.id || 'default'}`
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) return JSON.parse(saved)
    } catch {}
    const dest = (trip?.dest || trip?.destination || '').toLowerCase()
    let initial = [...PACKING_PRESETS.General]
    if (dest.includes('bali') || dest.includes('beach') || dest.includes('goa') || dest.includes('greece') || dest.includes('amalfi')) {
      initial = [...initial, ...PACKING_PRESETS.Beach]
    } else if (dest.includes('ladakh') || dest.includes('spiti') || dest.includes('mountain') || dest.includes('trek') || dest.includes('zermatt') || dest.includes('alps')) {
      initial = [...initial, ...PACKING_PRESETS.Mountain]
    } else {
      initial = [...initial, ...PACKING_PRESETS.Culture]
    }
    return initial
  })

  const [newItem, setNewItem] = useState('')
  const [newCat, setNewCat] = useState('General')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items))
    } catch {}
  }, [items, storageKey])

  const toggleItem = (id) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, checked: !it.checked } : it))
  }

  const addItem = (e) => {
    e.preventDefault()
    if (!newItem.trim()) return
    const created = {
      id: `custom_${Date.now()}`,
      item: newItem.trim(),
      category: newCat,
      checked: false,
    }
    setItems(prev => [created, ...prev])
    setNewItem('')
  }

  const deleteItem = (id) => {
    setItems(prev => prev.filter(it => it.id !== id))
  }

  const filteredItems = useMemo(() => {
    return items.filter(it => {
      const matchesCat = selectedCategory === 'All' || it.category.toLowerCase().includes(selectedCategory.toLowerCase())
      const matchesSearch = !searchQuery || it.item.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCat && matchesSearch
    })
  }, [items, selectedCategory, searchQuery])

  const packedCount = items.filter(i => i.checked).length
  const totalCount = items.length
  const pct = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0

  return (
    <div className="custom-modal-backdrop" onClick={onClose}>
      <motion.div
        className="custom-modal-window wide pack-modal-window"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {/* Header */}
        <div className="cm-header">
          <div className="flex items-center gap-3">
            <div className="pack-header-icon">
              <Briefcase className="w-5 h-5 text-[#D4A843]" />
            </div>
            <div>
              <span className="cm-badge-ai">
                <SparkleIcon size={12} color="#D4A843" /> AI PACKING CONCIERGE
              </span>
              <h3 className="cm-title">
                Smart Packing Matrix — {trip?.dest || trip?.destination || 'Expedition'}
              </h3>
            </div>
          </div>
          <button className="cm-close" onClick={onClose}>✕</button>
        </div>

        {/* Progress Bar & Metric Banner */}
        <div className="pack-progress-banner">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="pack-count-badge">{packedCount}/{totalCount} Items</span>
              <span className="text-xs text-slate-500 font-medium">Ready for Departure</span>
            </div>
            <span className={`pack-pct-badge ${pct === 100 ? 'complete' : ''}`}>
              {pct === 100 ? '🎉 100% Fully Packed!' : `${pct}% Prepared`}
            </span>
          </div>
          <div className="pack-bar-track">
            <motion.div
              className="pack-bar-fill"
              style={{ width: `${pct}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Filter Chips & Search Bar */}
        <div className="pack-controls-row">
          <div className="pack-search-wrap">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search gear, clothes, documents..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pack-search-input"
            />
          </div>

          <div className="pack-cat-chips">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                className={`pack-cat-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Add custom item form */}
        <form onSubmit={addItem} className="pack-add-row">
          <input
            type="text"
            placeholder="+ Add custom gear or essential..."
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            className="pack-input"
          />
          <select
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
            className="pack-select"
          >
            <option value="General">General</option>
            <option value="Clothing">Clothing</option>
            <option value="Footwear">Footwear</option>
            <option value="Electronics">Electronics</option>
            <option value="Documents">Documents</option>
            <option value="Medical">Medical</option>
            <option value="Gear">Gear</option>
          </select>
          <button type="submit" className="pack-add-btn">
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>

        {/* Items List */}
        <div className="pack-items-list">
          {filteredItems.map(it => (
            <motion.div
              key={it.id}
              className={`pack-item ${it.checked ? 'packed' : ''}`}
              onClick={() => toggleItem(it.id)}
              whileHover={{ x: 2 }}
            >
              <div className={`pack-checkbox ${it.checked ? 'checked' : ''}`}>
                {it.checked && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <div className="pack-item-content">
                <span className="pack-item-name">{it.item}</span>
                <span className="pack-item-cat">{it.category}</span>
              </div>
              <button
                type="button"
                className="pack-del-btn"
                onClick={(e) => { e.stopPropagation(); deleteItem(it.id) }}
                aria-label="Remove item"
              >
                <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-500" />
              </button>
            </motion.div>
          ))}
          {filteredItems.length === 0 && (
            <div className="pack-empty-state">
              <p className="text-sm text-slate-400">No items found matching your filter.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pack-footer">
          <button className="pack-done-btn" onClick={onClose}>
            <CheckCheck className="w-4 h-4" />
            <span>Save & Complete Packing List</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}
