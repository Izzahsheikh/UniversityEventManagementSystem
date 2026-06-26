import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../App.css'

const getUser = () => JSON.parse(localStorage.getItem('loggedInUser') || '{}')
const getEvents = () => JSON.parse(localStorage.getItem('events') || '[]')
const getRegistrations = () => JSON.parse(localStorage.getItem('registrations') || '[]')

const tabs = ['Overview', 'My Events', 'Create Event', 'Registrations', 'Profile']
const categories = ['Academic', 'Sports', 'Cultural', 'Workshop', 'Seminar', 'Social', 'Other']

const emptyForm = { title: '', description: '', date: '', venue: '', category: 'Academic', capacity: '' }

export default function OrganizerDashboard() {
  const [active, setActive] = useState('Overview')
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [saved, setSaved] = useState(false)
  const navigate = useNavigate()
  const u = getUser()

  const myEvents = getEvents().filter(e => e.organizerEmail === u.email)
  const allRegistrations = getRegistrations()

  const logout = () => { localStorage.removeItem('loggedInUser'); navigate('/login') }

  const saveEvent = (e) => {
    e.preventDefault()
    const all = getEvents()
    if (editId) {
      const updated = all.map(ev => ev.id === editId ? { ...ev, ...form } : ev)
      localStorage.setItem('events', JSON.stringify(updated))
    } else {
      const newEvent = { ...form, id: Date.now().toString(), organizer: u.fullName, organizerEmail: u.email, createdAt: new Date().toISOString() }
      all.push(newEvent)
      localStorage.setItem('events', JSON.stringify(all))
    }
    setForm(emptyForm); setEditId(null); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setActive('My Events')
  }

  const deleteEvent = (id) => {
    if (!window.confirm('Delete this event?')) return
    localStorage.setItem('events', JSON.stringify(getEvents().filter(e => e.id !== id)))
    const regs = getRegistrations().filter(r => r.eventId !== id)
    localStorage.setItem('registrations', JSON.stringify(regs))
    window.location.reload()
  }

  const startEdit = (ev) => {
    setForm({ title: ev.title, description: ev.description, date: ev.date, venue: ev.venue, category: ev.category, capacity: ev.capacity })
    setEditId(ev.id); setActive('Create Event')
  }

  const sidebarBtn = (tab) => ({ width: '100%', padding: '10px 1.5rem', background: active === tab ? '#fff' : 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '13px', fontWeight: active === tab ? 700 : 500, color: active === tab ? '#000' : '#555', fontFamily: 'Space Grotesk', transition: 'all 0.2s' })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', fontFamily: 'Inter, sans-serif', display: 'flex' }}>
      <aside style={{ width: '240px', backgroundColor: '#080808', borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 50 }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #1a1a1a' }}>
          <Link to='/' style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div className='navbar__logo-box'><span className='navbar__logo-letters'>EM</span></div>
            <span className='navbar__logo-name' style={{ fontSize: '14px' }}>EventManage</span>
          </Link>
        </div>
        <div style={{ padding: '1.5rem 1rem', borderBottom: '1px solid #1a1a1a' }}>
          <div style={{ width: '48px', height: '48px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '18px', color: '#000' }}>{u.fullName?.[0] || 'O'}</span>
          </div>
          <p style={{ color: '#fff', fontWeight: 700, fontFamily: 'Space Grotesk', fontSize: '14px', margin: '0 0 2px' }}>{u.fullName}</p>
          <p style={{ color: '#555', fontSize: '11px', margin: 0, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Space Grotesk' }}>? Organizer</p>
        </div>
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {tabs.map(tab => <button key={tab} onClick={() => { setActive(tab); if (tab === 'Create Event') { setForm(emptyForm); setEditId(null) } }} style={sidebarBtn(tab)}>{tab}</button>)}
        </nav>
        <div style={{ padding: '1rem' }}>
          <button onClick={logout} style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', border: '1px solid #222', color: '#555', cursor: 'pointer', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Space Grotesk' }} onMouseEnter={e => { e.target.style.borderColor='#fff'; e.target.style.color='#fff' }} onMouseLeave={e => { e.target.style.borderColor='#222'; e.target.style.color='#555' }}>SIGN OUT</button>
        </div>
      </aside>

      <main style={{ marginLeft: '240px', flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <p className='section-eyebrow'>ORGANIZER PORTAL</p>
            <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, color: '#fff', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', margin: '4px 0 0', letterSpacing: '-0.02em' }}>{editId ? 'Edit Event' : active}</h1>
          </div>

          {active === 'Overview' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '2rem' }}>
                {[['My Events', myEvents.length, 'Created'],['Registrations', allRegistrations.filter(r => myEvents.find(e => e.id === r.eventId)).length, 'Total'],['Upcoming', myEvents.filter(e => new Date(e.date) >= new Date()).length, 'Events'],['Categories', [...new Set(myEvents.map(e => e.category))].length, 'Used']].map(([label, val, sub]) => (
                  <div key={label} style={{ border: '1px solid #1a1a1a', padding: '1.5rem', backgroundColor: '#0a0a0a' }}>
                    <p style={{ color: '#555', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'Space Grotesk', margin: '0 0 8px' }}>{label}</p>
                    <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '2rem', margin: '0 0 4px' }}>{val}</p>
                    <p style={{ color: '#444', fontSize: '12px', fontFamily: 'Inter', margin: 0 }}>{sub}</p>
                  </div>
                ))}
              </div>
              <div style={{ border: '1px solid #1a1a1a', padding: '1.5rem', backgroundColor: '#0a0a0a', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '14px', margin: 0 }}>RECENT EVENTS</p>
                  <button onClick={() => setActive('Create Event')} style={{ padding: '8px 18px', backgroundColor: '#fff', border: 'none', color: '#000', cursor: 'pointer', fontSize: '11px', fontWeight: 700, fontFamily: 'Space Grotesk', letterSpacing: '0.5px' }}>+ CREATE EVENT</button>
                </div>
                {myEvents.length === 0 ? <p style={{ color: '#444', fontFamily: 'Inter', fontSize: '14px' }}>No events yet. Create your first event!</p> :
                  myEvents.slice(0, 4).map(ev => (
                    <div key={ev.id} style={{ borderBottom: '1px solid #111', padding: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ color: '#fff', fontSize: '14px', fontFamily: 'Space Grotesk', fontWeight: 700, margin: '0 0 2px' }}>{ev.title}</p>
                        <p style={{ color: '#555', fontSize: '12px', fontFamily: 'Inter', margin: 0 }}>{ev.date} · {ev.venue}</p>
                      </div>
                      <span style={{ color: '#fff', fontSize: '11px', fontFamily: 'Space Grotesk', border: '1px solid #333', padding: '3px 10px' }}>{ev.category}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {active === 'My Events' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myEvents.length === 0 ? (
                <div style={{ border: '1px solid #1a1a1a', padding: '3rem', backgroundColor: '#0a0a0a', textAlign: 'center' }}>
                  <p style={{ color: '#444', fontFamily: 'Space Grotesk', fontSize: '14px', margin: '0 0 1rem' }}>No events created yet.</p>
                  <button onClick={() => setActive('Create Event')} style={{ padding: '10px 24px', backgroundColor: '#fff', border: 'none', color: '#000', cursor: 'pointer', fontSize: '12px', fontWeight: 700, fontFamily: 'Space Grotesk' }}>CREATE YOUR FIRST EVENT</button>
                </div>
              ) : myEvents.map(ev => {
                const regs = allRegistrations.filter(r => r.eventId === ev.id)
                return (
                  <div key={ev.id} style={{ border: '1px solid #1a1a1a', padding: '1.5rem', backgroundColor: '#0a0a0a' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '15px', margin: 0 }}>{ev.title}</p>
                          <span style={{ color: '#888', fontSize: '10px', fontFamily: 'Space Grotesk', border: '1px solid #222', padding: '2px 8px' }}>{ev.category}</span>
                        </div>
                        <p style={{ color: '#555', fontSize: '12px', fontFamily: 'Inter', margin: 0 }}>?? {ev.date} · ?? {ev.venue} · ?? {regs.length} registered</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => startEdit(ev)} style={{ padding: '7px 14px', backgroundColor: 'transparent', border: '1px solid #333', color: '#fff', cursor: 'pointer', fontSize: '11px', fontWeight: 700, fontFamily: 'Space Grotesk' }}>EDIT</button>
                        <button onClick={() => deleteEvent(ev.id)} style={{ padding: '7px 14px', backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444', cursor: 'pointer', fontSize: '11px', fontWeight: 700, fontFamily: 'Space Grotesk' }}>DELETE</button>
                      </div>
                    </div>
                    <p style={{ color: '#666', fontSize: '13px', fontFamily: 'Inter', margin: 0, lineHeight: 1.6 }}>{ev.description}</p>
                  </div>
                )
              })}
            </div>
          )}

          {active === 'Create Event' && (
            <div style={{ maxWidth: '600px' }}>
              {saved && <div style={{ backgroundColor: '#071a0e', border: '1px solid #14532d', color: '#22c55e', padding: '12px 16px', fontSize: '13px', marginBottom: '1.5rem', fontFamily: 'Inter' }}>Event {editId ? 'updated' : 'created'} successfully!</div>}
              <div style={{ border: '1px solid #1a1a1a', padding: '2rem', backgroundColor: '#0a0a0a' }}>
                <form onSubmit={saveEvent}>
                  {[['Event Title', 'title', 'text', 'e.g. Annual Tech Fest 2025'],['Date', 'date', 'date', ''],['Venue', 'venue', 'text', 'e.g. Main Auditorium'],['Capacity', 'capacity', 'number', 'Max attendees']].map(([label, field, type, placeholder]) => (
                    <div key={field} style={{ marginBottom: '1.1rem' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#555', marginBottom: '6px', fontFamily: 'Space Grotesk' }}>{label}</label>
                      <input type={type} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} placeholder={placeholder} required style={{ width: '100%', padding: '11px 14px', border: '1px solid #222', backgroundColor: '#111', color: '#fff', fontSize: '13px', fontFamily: 'Inter', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  ))}
                  <div style={{ marginBottom: '1.1rem' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#555', marginBottom: '6px', fontFamily: 'Space Grotesk' }}>Category</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ width: '100%', padding: '11px 14px', border: '1px solid #222', backgroundColor: '#111', color: '#fff', fontSize: '13px', fontFamily: 'Inter', outline: 'none', boxSizing: 'border-box' }}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#555', marginBottom: '6px', fontFamily: 'Space Grotesk' }}>Description</label>
                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder='Describe the event...' rows={4} required style={{ width: '100%', padding: '11px 14px', border: '1px solid #222', backgroundColor: '#111', color: '#fff', fontSize: '13px', fontFamily: 'Inter', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type='submit' style={{ flex: 1, padding: '13px', backgroundColor: '#fff', color: '#000', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'Space Grotesk' }}>{editId ? 'UPDATE EVENT' : 'CREATE EVENT'} ?</button>
                    {editId && <button type='button' onClick={() => { setForm(emptyForm); setEditId(null) }} style={{ padding: '13px 20px', backgroundColor: 'transparent', border: '1px solid #333', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: 700, fontFamily: 'Space Grotesk' }}>CANCEL</button>}
                  </div>
                </form>
              </div>
            </div>
          )}

          {active === 'Registrations' && (
            <div>
              {myEvents.map(ev => {
                const regs = allRegistrations.filter(r => r.eventId === ev.id)
                return (
                  <div key={ev.id} style={{ border: '1px solid #1a1a1a', backgroundColor: '#0a0a0a', marginBottom: '16px' }}>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, margin: 0 }}>{ev.title}</p>
                      <span style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700 }}>{regs.length} registered</span>
                    </div>
                    {regs.length === 0 ? <p style={{ color: '#444', fontFamily: 'Inter', fontSize: '13px', padding: '1rem 1.5rem', margin: 0 }}>No registrations yet.</p> :
                      regs.map((r, i) => (
                        <div key={i} style={{ padding: '10px 1.5rem', borderBottom: '1px solid #0d0d0d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <p style={{ color: '#ccc', fontSize: '13px', fontFamily: 'Inter', margin: 0 }}>{r.studentName}</p>
                          <p style={{ color: '#444', fontSize: '11px', fontFamily: 'Space Grotesk', margin: 0 }}>{r.studentEmail}</p>
                        </div>
                      ))}
                  </div>
                )
              })}
              {myEvents.length === 0 && <div style={{ border: '1px solid #1a1a1a', padding: '3rem', backgroundColor: '#0a0a0a', textAlign: 'center' }}><p style={{ color: '#444', fontFamily: 'Space Grotesk', fontSize: '14px', margin: 0 }}>Create events first to see registrations.</p></div>}
            </div>
          )}

          {active === 'Profile' && (
            <div style={{ border: '1px solid #1a1a1a', padding: '2.5rem', backgroundColor: '#0a0a0a', maxWidth: '500px' }}>
              <div style={{ width: '72px', height: '72px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '28px', color: '#000' }}>{u.fullName?.[0]}</span>
              </div>
              {[['Full Name', u.fullName],['Email', u.email],['Role', 'Organizer'],['Joined', u.joinedAt ? new Date(u.joinedAt).toLocaleDateString() : 'N/A'],['Events Created', myEvents.length],['Total Registrations', allRegistrations.filter(r => myEvents.find(e => e.id === r.eventId)).length]].map(([label, val]) => (
                <div key={label} style={{ borderBottom: '1px solid #111', padding: '12px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ color: '#444', fontSize: '12px', fontFamily: 'Space Grotesk', letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>{label}</p>
                  <p style={{ color: '#fff', fontSize: '14px', fontFamily: 'Inter', margin: 0 }}>{val}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
