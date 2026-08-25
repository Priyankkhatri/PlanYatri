// GroupExpenseSplitter.jsx — Splitwise-like expense splitter
// Persists to Supabase when tripId is a real UUID, else local-only
import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { expenseService } from '../services/supabaseService'

const DEMO_TRIP_PREFIXES = ['trip_demo_', 'journey-', 'local_']
const isRealTrip = (id) => id && !DEMO_TRIP_PREFIXES.some(p => id.startsWith(p))

function generateId() {
  return `exp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
}

function simplifyDebts(balances) {
  const debts = []
  const creditors = Object.entries(balances).filter(([, v]) => v > 0.01).sort((a, b) => b[1] - a[1])
  const debtors  = Object.entries(balances).filter(([, v]) => v < -0.01).sort((a, b) => a[1] - b[1])
  const bal = { ...balances }
  creditors.forEach(([creditor]) => {
    debtors.forEach(([debtor]) => {
      if (bal[creditor] > 0.01 && bal[debtor] < -0.01) {
        const amount = Math.min(bal[creditor], -bal[debtor])
        debts.push({ from: debtor, to: creditor, amount })
        bal[creditor] -= amount
        bal[debtor]   += amount
      }
    })
  })
  return debts
}

export default function GroupExpenseSplitter({ tripId, tripName = 'Trip', members: initialMembers = ['You', 'Friend'] }) {
  const { userInfo } = useSelector(s => s.auth)
  const userId = userInfo?.id
  const isPersisted = isRealTrip(tripId)

  const [members, setMembers] = useState(initialMembers)
  const [newMember, setNewMember] = useState('')
  const [expenses, setExpenses] = useState([])
  const [form, setForm] = useState({
    description: '', amount: '', paidBy: initialMembers[0] || 'You',
    splitType: 'equal', category: 'General',
  })
  const [activeTab, setActiveTab] = useState('add')
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)

  // ── Load from Supabase ──
  const loadExpenses = useCallback(async () => {
    if (!isPersisted || !tripId) return
    setLoading(true)
    try {
      const rows = await expenseService.getForTrip(tripId)
      const normalized = rows.map(row => ({
        id: row.id,
        description: row.description,
        amount: Number(row.amount_inr),
        paidBy: row.profiles?.full_name || 'You',
        category: row.category || 'General',
        date: new Date(row.created_at).toLocaleDateString('en-IN'),
        splits: (row.expense_splits || []).map(s => ({
          id: s.id,
          member: s.member_name,
          owes: Number(s.amount_owed),
          settled: s.settled,
        })),
        fromDb: true,
      }))
      setExpenses(normalized)

      // Collect all member names
      const allNames = new Set(initialMembers)
      normalized.forEach(e => {
        allNames.add(e.paidBy)
        e.splits.forEach(s => allNames.add(s.member))
      })
      setMembers([...allNames])
    } catch (e) {
      console.warn('Expense load failed:', e.message)
    } finally {
      setLoading(false)
    }
  }, [tripId, isPersisted, initialMembers])

  useEffect(() => { loadExpenses() }, [loadExpenses])

  // ── Realtime subscription ──
  useEffect(() => {
    if (!isPersisted || !tripId) return
    const channel = expenseService.subscribe(tripId, () => loadExpenses())
    return () => { if (channel) channel.unsubscribe?.() }
  }, [tripId, isPersisted, loadExpenses])

  // ── Add member ──
  const addMember = () => {
    const name = newMember.trim()
    if (name && !members.includes(name)) {
      setMembers(prev => [...prev, name])
      setNewMember('')
    }
  }

  // ── Add expense ──
  const addExpense = async () => {
    const amount = parseFloat(form.amount)
    if (!form.description || isNaN(amount) || amount <= 0 || !form.paidBy) return

    const perPerson = form.splitType === 'equal' ? amount / members.length : amount
    const splits = members.map(m => ({
      member: m,
      owes: m === form.paidBy ? 0 : perPerson,
      settled: false,
    }))

    if (isPersisted && userId) {
      setSyncing(true)
      try {
        await expenseService.add(tripId, userId, {
          description: form.description,
          amount_inr: amount,
          split_type: form.splitType,
          category: form.category,
          members: members.map(m => ({ name: m, userId: m === userInfo?.name ? userId : null })),
        })
        await loadExpenses()
      } catch (e) {
        console.warn('Expense save failed:', e.message)
        // Add locally as fallback
        setExpenses(prev => [...prev, {
          id: generateId(), description: form.description, amount,
          paidBy: form.paidBy, category: form.category,
          date: new Date().toLocaleDateString('en-IN'), splits,
        }])
      } finally {
        setSyncing(false)
      }
    } else {
      // Local only
      setExpenses(prev => [...prev, {
        id: generateId(), description: form.description, amount,
        paidBy: form.paidBy, category: form.category,
        date: new Date().toLocaleDateString('en-IN'), splits,
      }])
    }

    setForm(f => ({ ...f, description: '', amount: '' }))
  }

  // ── Settle a split ──
  const handleSettle = async (expense, splitIndex) => {
    const split = expense.splits[splitIndex]
    if (isPersisted && split.id) {
      try {
        await expenseService.settle(split.id)
        await loadExpenses()
      } catch (e) {
        console.warn('Settle failed:', e.message)
      }
    } else {
      setExpenses(prev => prev.map(exp => {
        if (exp.id !== expense.id) return exp
        const newSplits = [...exp.splits]
        newSplits[splitIndex] = { ...newSplits[splitIndex], settled: true }
        return { ...exp, splits: newSplits }
      }))
    }
  }

  // ── Balances ──
  const balances = members.reduce((acc, m) => { acc[m] = 0; return acc }, {})
  expenses.forEach(exp => {
    balances[exp.paidBy] = (balances[exp.paidBy] || 0) + exp.amount
    exp.splits.forEach(s => {
      if (!s.settled) balances[s.member] = (balances[s.member] || 0) - s.owes
    })
  })
  const simplifiedDebts = simplifyDebts(balances)
  const totalSpend = expenses.reduce((s, e) => s + e.amount, 0)

  const CATEGORIES = ['General', 'Hotel', 'Food', 'Transport', 'Activity', 'Shopping', 'Other']

  return (
    <div className="expense-splitter">
      <div className="es-header">
        <div>
          <h3 className="es-title">Group Expenses</h3>
          <span className="es-trip">
            {tripName}
            {isPersisted && <span className="es-synced-badge"> · Synced</span>}
            {!isPersisted && <span className="es-local-badge"> · Local Mode</span>}
          </span>
        </div>
        <div className="es-total">
          <span className="es-total-label">Total Spend</span>
          <span className="es-total-amount">₹{totalSpend.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Members Row */}
      <div className="es-members">
        {members.map(m => (
          <span key={m} className="es-member-badge" title={m}>
            {m.charAt(0).toUpperCase()}
          </span>
        ))}
        <div className="es-add-member">
          <input
            placeholder="Add member"
            value={newMember}
            onChange={e => setNewMember(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addMember()}
            className="es-member-input"
          />
          <button onClick={addMember} className="es-member-add-btn">+</button>
        </div>
        {loading && <span style={{ fontSize: 11, color: '#9CA3AF' }}>Loading…</span>}
      </div>

      {/* Tabs */}
      <div className="es-tabs">
        {['add', 'balances', 'history'].map(tab => (
          <button key={tab} className={`es-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'add' ? '➕ Add' : tab === 'balances' ? '⚖️ Balances' : '📋 History'}
          </button>
        ))}
      </div>

      {/* Add Tab */}
      {activeTab === 'add' && (
        <div className="es-add-form">
          <input
            placeholder="Description (e.g. Hotel, Dinner, Taxi)"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="es-input"
          />
          <div className="es-form-row">
            <input
              type="number"
              placeholder="Amount (₹)"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              className="es-input es-amount-input"
              min="0"
            />
            <select className="es-select" value={form.paidBy} onChange={e => setForm(f => ({ ...f, paidBy: e.target.value }))}>
              {members.map(m => <option key={m} value={m}>Paid by {m}</option>)}
            </select>
          </div>
          <div className="es-form-row">
            <select className="es-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="es-split-toggle">
            {['equal', 'individual'].map(t => (
              <button key={t} className={`es-split-btn ${form.splitType === t ? 'active' : ''}`} onClick={() => setForm(f => ({ ...f, splitType: t }))}>
                {t === 'equal' ? '÷ Equal Split' : '👤 Individual'}
              </button>
            ))}
          </div>
          <button onClick={addExpense} className="es-submit-btn" disabled={syncing}>
            {syncing ? 'Saving…' : isPersisted ? '💾 Add & Sync' : 'Add Expense'}
          </button>
        </div>
      )}

      {/* Balances Tab */}
      {activeTab === 'balances' && (
        <div className="es-balances">
          {simplifiedDebts.length === 0 ? (
            <div className="es-settled">🎉 All settled up!</div>
          ) : (
            <div className="es-debt-list">
              {simplifiedDebts.map((d, i) => (
                <div key={i} className="es-debt-item">
                  <span className="es-debt-from">{d.from}</span>
                  <span className="es-debt-arrow">owes</span>
                  <span className="es-debt-to">{d.to}</span>
                  <span className="es-debt-amount">₹{d.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
          <div className="es-per-person">
            {members.map(m => (
              <div key={m} className="es-person-balance">
                <span className="es-pb-name">{m}</span>
                <span className={`es-pb-amount ${(balances[m] || 0) >= 0 ? 'positive' : 'negative'}`}>
                  {(balances[m] || 0) >= 0
                    ? `+₹${(balances[m] || 0).toFixed(2)}`
                    : `-₹${Math.abs(balances[m] || 0).toFixed(2)}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="es-history">
          {loading && <div className="es-empty">Loading expenses…</div>}
          {!loading && expenses.length === 0 && <div className="es-empty">No expenses yet. Add your first one!</div>}
          {expenses.slice().reverse().map(exp => (
            <div key={exp.id} className="es-history-item">
              <div className="es-hi-main">
                <div>
                  <span className="es-hi-desc">{exp.description}</span>
                  <span className="es-hi-cat"> · {exp.category}</span>
                </div>
                <span className="es-hi-amount">₹{exp.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="es-hi-meta">
                <span>Paid by <strong>{exp.paidBy}</strong></span>
                <span>{exp.date}</span>
              </div>
              {exp.splits.filter(s => s.owes > 0).map((s, si) => (
                <div key={si} className="es-split-row">
                  <span>{s.member} owes ₹{s.owes.toFixed(2)}</span>
                  {s.settled
                    ? <span className="es-settled-tag">✓ Settled</span>
                    : <button className="es-settle-btn" onClick={() => handleSettle(exp, exp.splits.indexOf(s))}>Settle</button>
                  }
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
