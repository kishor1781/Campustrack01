'use client'

import { FormEvent, useMemo, useState } from 'react'
import { Bell, BookOpen, Calculator, Check, ChevronDown, CircleHelp, KeyRound, Laptop, MapPin, Plus, Search, Smartphone, Tag, X } from 'lucide-react'

type Status = 'LOST' | 'FOUND' | 'CLAIMED'
type Category = 'Electronics' | 'ID / Keys' | 'Books' | 'Other'

type Item = {
  id: number
  name: string
  category: Category
  location: string
  contact: string
  status: Status
  timestamp: string
}

const initialItems: Item[] = [
  { id: 1, name: 'Blue Lanyard', category: 'ID / Keys', location: 'Central Library, 2nd floor', contact: 'Aarav · 98••• 1402', status: 'FOUND', timestamp: '12 min ago' },
  { id: 2, name: 'Casio Calculator', category: 'Electronics', location: 'Block B, Room 204', contact: 'Nisha · nisha@campus.edu', status: 'LOST', timestamp: '38 min ago' },
  { id: 3, name: 'Discrete Mathematics', category: 'Books', location: 'Cafeteria, window table', contact: 'Rohan · 97••• 8831', status: 'CLAIMED', timestamp: '1 hr ago' },
  { id: 4, name: 'USB-C Adapter', category: 'Electronics', location: 'Innovation Lab', contact: 'Meera · 96••• 2108', status: 'LOST', timestamp: '2 hrs ago' },
  { id: 5, name: 'Green Water Bottle', category: 'Other', location: 'Sports complex reception', contact: 'Kabir · 99••• 7744', status: 'FOUND', timestamp: '3 hrs ago' },
  { id: 6, name: 'Student ID Card', category: 'ID / Keys', location: 'Main gate security desk', contact: 'Security desk · Ext. 104', status: 'FOUND', timestamp: 'Yesterday' },
]

const categoryIcon = (category: Category) => {
  if (category === 'Electronics') return <Calculator aria-hidden="true" />
  if (category === 'ID / Keys') return <KeyRound aria-hidden="true" />
  if (category === 'Books') return <BookOpen aria-hidden="true" />
  return <Tag aria-hidden="true" />
}

export default function Page() {
  const [items, setItems] = useState(initialItems)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'ALL' | Status>('ALL')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [form, setForm] = useState({ name: '', category: 'Electronics' as Category, location: '', contact: '', status: 'LOST' as Exclude<Status, 'CLAIMED'> })

  const filteredItems = useMemo(() => items.filter((item) => {
    const matchesFilter = filter === 'ALL' || item.status === filter
    const searchable = `${item.name} ${item.category} ${item.location}`.toLowerCase()
    return matchesFilter && searchable.includes(query.toLowerCase())
  }), [items, filter, query])

  function announce(message: string) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2800)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form.name.trim() || !form.location.trim() || !form.contact.trim()) return
    const newItem: Item = { id: Date.now(), ...form, timestamp: 'Just now' }
    setItems((current) => [newItem, ...current])
    setForm({ name: '', category: 'Electronics', location: '', contact: '', status: 'LOST' })
    setIsFormOpen(false)
    announce('Your notice is now live on the board.')
  }

  function claimItem(id: number) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, status: 'CLAIMED' } : item))
    announce('Item marked as claimed.')
  }

  return (
    <main className="site-shell">
      <div className="announcement"><Bell aria-hidden="true" /> Campus community noticeboard <span>•</span> Help return what matters.</div>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="CampusTrack home"><span className="brand-mark"><MapPin aria-hidden="true" /></span><span>Campus<span className="brand-accent">Track</span></span></a>
        <div className="search-wrap"><Search aria-hidden="true" /><input aria-label="Search notices" placeholder="Search by item, place or category..." value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>⌘ K</kbd></div>
        <button className="help-button" type="button" onClick={() => announce('Tip: include a precise location so items find their way home.') }><CircleHelp aria-hidden="true" /> <span>How it works</span></button>
        <button className="post-button" type="button" onClick={() => setIsFormOpen(true)}><Plus aria-hidden="true" /> Post notice</button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy"><p className="eyebrow">THE CAMPUS LOST & FOUND</p><h1>Small things.<br /><em>Big relief.</em></h1><p className="hero-text">A shared space for the things that go missing between lectures, libraries and late-night study sessions.</p><button className="hero-cta" type="button" onClick={() => setIsFormOpen(true)}>Post a notice <Plus aria-hidden="true" /></button></div>
        <div className="hero-art" aria-label="Illustration of a campus pinboard" role="img"><div className="pinboard"><span className="pin pin-one" /><span className="pin pin-two" /><div className="paper-note note-yellow"><small>FOUND</small><strong>Blue lanyard</strong><span>Library · 2F</span></div><div className="paper-note note-white"><small>LOST</small><strong>Casio calculator</strong><span>Block B · 204</span></div><div className="paper-note note-coral"><small>FOUND</small><strong>Student ID</strong><span>Main gate</span></div><div className="board-scribble">look<br />out for<br /><b>each other</b></div></div><div className="hero-sticker">PIN IT<br /><span>PASS IT<br />ON</span></div></div>
      </section>

      <section className="board-section" aria-labelledby="board-heading">
        <div className="section-heading"><div><p className="eyebrow">LIVE BOARD</p><h2 id="board-heading">What&apos;s looking for a home <span className="item-count">{items.length}</span></h2></div><div className="filters" role="group" aria-label="Filter notices">{(['ALL', 'LOST', 'FOUND', 'CLAIMED'] as const).map((option) => <button key={option} type="button" className={filter === option ? 'filter active' : 'filter'} onClick={() => setFilter(option)}>{option === 'ALL' ? 'All notices' : option[0] + option.slice(1).toLowerCase()}</button>)}</div></div>
        <div className="board-meta"><span><span className="live-dot" /> Updated just now</span><span>{filteredItems.length} notices showing</span></div>
        <div className="card-grid">
          {filteredItems.map((item) => <article className={`item-card ${item.status.toLowerCase()}`} key={item.id}><div className="card-top"><div className={`category-icon ${item.category.toLowerCase().replace(/[^a-z]/g, '')}`}>{categoryIcon(item.category)}</div><span className={`status-badge ${item.status.toLowerCase()}`}><span /> {item.status}</span></div><div className="card-content"><p className="card-category">{item.category}</p><h3>{item.name}</h3><p className="card-detail"><MapPin aria-hidden="true" /> {item.location}</p><p className="card-detail"><Smartphone aria-hidden="true" /> {item.contact}</p></div><div className="card-footer"><span>{item.timestamp}</span>{item.status !== 'CLAIMED' ? <button type="button" className="claim-button" onClick={() => claimItem(item.id)}>Mark claimed <Check aria-hidden="true" /></button> : <span className="claimed-label"><Check aria-hidden="true" /> Returned</span>}</div></article>)}
        </div>
        {filteredItems.length === 0 && <div className="empty-state"><Search aria-hidden="true" /><h3>No notices found</h3><p>Try a different search or post a new notice.</p></div>}
      </section>

      <footer><div className="footer-brand"><span className="brand-mark"><MapPin aria-hidden="true" /></span><strong>Campus<span className="brand-accent">Track</span></strong></div><span>Built for a more helpful campus.</span><span className="footer-note">SEC project · 2025</span></footer>

      {isFormOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setIsFormOpen(false)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title"><button className="close-button" type="button" aria-label="Close form" onClick={() => setIsFormOpen(false)}><X aria-hidden="true" /></button><p className="eyebrow">ADD TO THE BOARD</p><h2 id="form-title">Post a notice</h2><p className="modal-subtitle">Give your item a few details so the right person can find it.</p><form onSubmit={handleSubmit}><label>Item name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Blue water bottle" /></label><label>Category<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as Category })}><option>Electronics</option><option>ID / Keys</option><option>Books</option><option>Other</option></select></label><label>Where was it {form.status === 'LOST' ? 'last seen' : 'found'}?<input required value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="e.g. Student center, table 4" /></label><label>How can people reach you?<input required value={form.contact} onChange={(event) => setForm({ ...form, contact: event.target.value })} placeholder="Email, phone, or handle" /></label><fieldset><legend>This item was...</legend><div className="status-options"><label className={form.status === 'LOST' ? 'selected lost-option' : 'lost-option'}><input type="radio" name="status" checked={form.status === 'LOST'} onChange={() => setForm({ ...form, status: 'LOST' })} /> Lost</label><label className={form.status === 'FOUND' ? 'selected found-option' : 'found-option'}><input type="radio" name="status" checked={form.status === 'FOUND'} onChange={() => setForm({ ...form, status: 'FOUND' })} /> Found</label></div></fieldset><button className="submit-button" type="submit">Publish notice <Plus aria-hidden="true" /></button></form></section></div>}
      {notice && <div className="toast" role="status"><Check aria-hidden="true" /> {notice}</div>}
    </main>
  )
}
