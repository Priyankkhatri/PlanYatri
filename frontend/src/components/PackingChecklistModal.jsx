import { useState, useEffect } from 'react'
import { CheckCircleIcon, SparkleIcon } from './icons/LuxuryIcons'
import './PackingChecklistModal.css'

const PACKING_PRESETS = {
  Culture: [
    { id: 'c1', item: 'Modest clothing for temples/monuments', category: 'Clothing', checked: true },
    { id: 'c2', item: 'Slip-on comfortable walking shoes', category: 'Footwear', checked: false },
    { id: 'c3', item: 'Universal power adapter & power bank', category: 'Electronics', checked: true },
    { id: 'c4', item: 'Passport & Visa physical photocopies', category: 'Documents', checked: false },
    { id: 'c5', item: 'Hand sanitizer & wet wipes', category: 'Hygiene', checked: false },
  ],
  Beach: [
    { id: 'b1', item: 'Reef-safe sunscreen (SPF 50+)', category: 'Skin & Health', checked: true },
    { id: 'b2', item: 'Quick-dry microfiber beach towels', category: 'Gear', checked: false },
    { id: 'b3', item: 'UV-blocking sunglasses & sunhat', category: 'Accessories', checked: true },
    { id: 'b4', item: 'Waterproof phone pouch', category: 'Electronics', checked: false },
    { id: 'b5', item: 'Swimwear & light linen shirts', category: 'Clothing', checked: false },
  ],
  Mountain: [
    { id: 'm1', item: 'Thermal base layers & windproof jacket', category: 'Clothing', checked: true },
    { id: 'm2', item: 'Waterproof trekking boots with ankle support', category: 'Footwear', checked: false },
    { id: 'm3', item: 'High-altitude sickness medication (Diamox)', category: 'Medical', checked: false },
    { id: 'm4', item: 'Headlamp with extra batteries', category: 'Gear', checked: true },
    { id: 'm5', item: 'Electrolyte hydration sachets', category: 'Health', checked: false },
  ],
  General: [
    { id: 'g1', item: 'Travel insurance card & policy copy', category: 'Documents', checked: true },
    { id: 'g2', item: 'Prescription medicines in original bottles', category: 'Medical', checked: false },
    { id: 'g3', item: 'RFID-blocking passport wallet', category: 'Security', checked: true },
    { id: 'g4', item: 'Noise-canceling earphones for flights', category: 'Electronics', checked: false },
    { id: 'g5', item: 'Compact first-aid kit', category: 'Medical', checked: false },
  ],
}

export default function PackingChecklistModal({ trip, onClose }) {
  const storageKey = `planyatri_pack_${trip?.id || 'default'}`
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) return JSON.parse(saved)
    } catch {}
    const dest = (trip?.dest || trip?.destination || '').toLowerCase()
    let initial = [...PACKING_PRESETS.General]
    if (dest.includes('bali') || dest.includes('beach') || dest.includes('goa') || dest.includes('greece')) {
      initial = [...initial, ...PACKING_PRESETS.Beach]
    } else if (dest.includes('ladakh') || dest.includes('spiti') || dest.includes('mountain') || dest.includes('trek')) {
      initial = [...initial, ...PACKING_PRESETS.Mountain]
    } else {
      initial = [...initial, ...PACKING_PRESETS.Culture]
    }
    return initial
  })

  const [newItem, setNewItem] = useState('')
  const [newCat, setNewCat] = useState('General')

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
    setItems(prev => [...prev, created])
    setNewItem('')
  }

  const deleteItem = (id) => {
    setItems(prev => prev.filter(it => it.id !== id))
  }

  const packedCount = items.filter(i => i.checked).length
  const totalCount = items.length
  const pct = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0

  return (
    <div className="custom-modal-backdrop" onClick={onClose}>
      <div className="custom-modal-window wide pack-modal-window" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="cm-header">
          <div>
            <span className="cm-badge-ai" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <SparkleIcon size={12} color="#D4A843" /> AI PACKING ASSISTANT
            </span>
            <h3 className="cm-title">Smart Packing Checklist — {trip?.dest || trip?.destination}</h3>
          </div>
          <button className="cm-close" onClick={onClose}>✕</button>
        </div>

        {/* Progress Bar */}
        <div className="pack-progress-row">
          <div className="pack-progress-text">
            <span><strong>{packedCount}</strong> of <strong>{totalCount}</strong> items packed</span>
            <span className="pack-pct">{pct}% Ready</span>
          </div>
          <div className="pack-bar-bg">
            <div className="pack-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Add custom item form */}
        <form onSubmit={addItem} className="pack-add-row">
          <input
            type="text"
            placeholder="+ Add another essential item..."
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            className="pack-input"
          />
          <select value={newCat} onChange={e => setNewCat(e.target.value)} className="pack-select">
            <option value="General">General</option>
            <option value="Clothing">Clothing</option>
            <option value="Electronics">Electronics</option>
            <option value="Documents">Documents</option>
            <option value="Medical">Medical</option>
          </select>
          <button type="submit" className="pack-add-btn">Add</button>
        </form>

        {/* Items List grouped */}
        <div className="pack-items-list">
          {items.map(it => (
            <div key={it.id} className={`pack-item ${it.checked ? 'packed' : ''}`} onClick={() => toggleItem(it.id)}>
              <div className={`pack-checkbox ${it.checked ? 'checked' : ''}`}>
                {it.checked && <CheckCircleIcon size={16} color="#121316" />}
              </div>
              <div className="pack-item-content">
                <span className="pack-item-name">{it.item}</span>
                <span className="pack-item-cat">{it.category}</span>
              </div>
              <button
                type="button"
                className="pack-del-btn"
                onClick={(e) => { e.stopPropagation(); deleteItem(it.id) }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="pack-footer">
          <button className="pack-done-btn" onClick={onClose}>
            ✓ Save & Close Checklist
          </button>
        </div>
      </div>
    </div>
  )
}
