import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../App.css'

const getUser = () => JSON.parse(localStorage.getItem('loggedInUser') || '{}')
const getEvents = () => JSON.parse(localStorage.getItem('events') || '[]')
const getRegistrations = () => JSON.parse(localStorage.getItem('registrations') || '[]')
const getFeedbacks = () => JSON.parse(localStorage.getItem('feedbacks') || '[]')

const tabs = ['Overview', 'Browse Events', 'My Registrations', 'Submit Feedback', 'Profile']

const inp = { width: '100%', padding: '11px 14px', border: '1px solid #2a2a2a', backgroundColor: '#111', color: '#fff', fontSize: '13px', fontFamily: 'Inter', outline: 'none', boxSizing: 'border-box', borderRadius: '0' }
const lbl = { display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#666', marginBottom: '6px', fontFamily: 'Space Grotesk' }
const card = { border: '1px solid #1e1e1e', backgroundColor: '#0d0d0d', borderRadius: '0' }

export default function StudentDashboard() {
  const [active, setActive] = useState('Overview')
  const [feedback, setFeedback] = useState({ eventId: '', rating: 5, review: '', suggestion: '' })
  const [feedbackSent, setFeedbackSent] = useState(false)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const navigate = useNavigate()
  const u = getUser()

  const allEvents = getEvents()
  const registrations = getRegistrations().filter(r => r.studentEmail === u.email)
  const myEventIds = registrations.map(r => r.eventId)
  const myFeedbacks = getFeedbacks().filter(f => f.studentEmail === u.email)
  const upcomingEvents = allEvents.filter(e => new Date(e.date) >= new Date())
  const categories = ['All', ...new Set(allEvents.map(e => e.category).filter(Boolean))]
  const filteredEvents = allEvents.filter(ev => {
    const s = search.toLowerCase()
    return (ev.title?.toLowerCase().includes(s) || ev.description?.toLowerCase().includes(s)) &&
      (filterCategory === 'All' || ev.category === filterCategory)
  })

  const logout = () => { localStorage.removeItem('loggedInUser'); navigate('/login') }

  const register = (eventId) => {
    const existing = getRegistrations()
    if (existing.find(r => r.studentEmail === u.email && r.eventId === eventId)) return
    existing.push({ studentEmail: u.email, studentName: u.fullName, eventId, registeredAt: new Date().toISOString() })
    localStorage.setItem('registrations', JSON.stringify(existing))
    window.location.reload()
  }

  const cancelReg = (eventId) => {
    const updated = getRegistrations().filter(r => !(r.studentEmail === u.email && r.eventId === eventId))
    localStorage.setItem('registrations', JSON.stringify(updated))
    window.location.reload()
  }

  const submitFeedback = (e) => {
    e.preventDefault()
    const all = getFeedbacks()
    all.push({ ...feedback, studentName: u.fullName, studentEmail: u.email, submittedAt: new Date().toISOString() })
    localStorage.setItem('feedbacks', JSON.stringify(all))
    setFeedbackSent(true)
    setFeedback({ eventId: '', rating: 5, review: '', suggestion: '' })
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      localStorage.setItem('loggedInUser', JSON.stringify({ ...u, profilePhoto: ev.target.result }))
      window.location.reload()
    }
    reader.readAsDataURL(file)
  }

  const sBtn = (tab) => ({
    width: '100%', padding: '12px 1.5rem', background: active === tab ? '#fff' : 'transparent',
    border: 'none', borderLeft: active === tab ? '3px solid #fff' : '3px solid transparent',
    cursor: 'pointer', textAlign: 'left', fontSize: '13px',
    fontWeight: active === tab ? 700 : 400, color: active === tab ? '#000' : '#666',
    fontFamily: 'Space Grotesk', transition: 'all 0.15s', display: 'block'
  })

  const statCard = (label, val, sub, accent) => (
    <div key={label} style={{ ...card, padding: '1.5rem', borderTop: `3px solid ${accent}` }}>
      <p style={{ color: '#666', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'Space Grotesk', margin: '0 0 10px' }}>{label}</p>
      <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '2.2rem', margin: '0 0 4px', lineHeight: 1 }}>{val}</p>
      <p style={{ color: '#444', fontSize: '12px', fontFamily: 'Inter', margin: 0 }}>{sub}</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#080808', fontFamily: 'Inter, sans-serif', display: 'flex' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width: '260px', backgroundColor: '#050505', borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 50 }}>

        {/* Logo */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #1a1a1a' }}>
          <Link to='/' style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div className='navbar__logo-box'><span className='navbar__logo-letters'>EM</span></div>
            <div>
              <span style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '13px', display: 'block' }}>EventManage</span>
              <span style={{ color: '#444', fontFamily: 'Inter', fontSize: '10px' }}>University Portal</span>
            </div>
          </Link>
        </div>

        {/* User */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: '44px', height: '44px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {u.profilePhoto
                ? <img src={u.profilePhoto} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '16px', color: '#000' }}>{(u.fullName || 'S')[0].toUpperCase()}</span>
              }
            </div>
            <label style={{ position: 'absolute', bottom: '-4px', right: '-4px', backgroundColor: '#333', color: '#fff', fontSize: '7px', fontWeight: 700, padding: '2px 4px', cursor: 'pointer', letterSpacing: '0.5px' }}>
              +
              <input type='file' accept='image/*' style={{ display: 'none' }} onChange={handlePhotoChange} />
            </label>
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ color: '#fff', fontWeight: 700, fontFamily: 'Space Grotesk', fontSize: '14px', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.fullName || 'Student'}</p>
            <span style={{ backgroundColor: '#1a2a1a', color: '#4ade80', fontSize: '9px', fontWeight: 700, fontFamily: 'Space Grotesk', padding: '2px 8px', letterSpacing: '1px' }}>STUDENT</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.75rem 0' }}>
          <p style={{ color: '#333', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'Space Grotesk', padding: '8px 1.5rem', margin: 0 }}>NAVIGATION</p>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActive(tab)} style={sBtn(tab)}>
              {tab}
            </button>
          ))}
        </nav>

        {/* Stats mini */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {[['Events', allEvents.length], ['Registered', registrations.length], ['Feedback', myFeedbacks.length]].map(([l, v]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '18px', margin: '0 0 2px' }}>{v}</p>
                <p style={{ color: '#444', fontSize: '9px', fontFamily: 'Inter', margin: 0, letterSpacing: '0.5px' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '1rem' }}>
          <button onClick={logout}
            style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', border: '1px solid #222', color: '#555', cursor: 'pointer', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Space Grotesk' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#555' }}>
            SIGN OUT
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ marginLeft: '260px', flex: 1, minHeight: '100vh', backgroundColor: '#080808' }}>

        {/* Top bar */}
        <div style={{ padding: '1.25rem 2.5rem', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#050505' }}>
          <div>
            <p style={{ color: '#444', fontSize: '11px', fontFamily: 'Space Grotesk', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 2px' }}>UNIVERSITY EVENT MANAGEMENT SYSTEM</p>
            <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, color: '#fff', fontSize: '1.5rem', margin: 0, letterSpacing: '-0.02em' }}>{active}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', backgroundColor: '#4ade80', borderRadius: '50%' }} />
            <span style={{ color: '#444', fontSize: '11px', fontFamily: 'Inter' }}>Student Portal</span>
          </div>
        </div>

        <div style={{ padding: '2rem 2.5rem', maxWidth: '1100px' }}>

          {/* ── OVERVIEW ── */}
          {active === 'Overview' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '2rem' }}>
                {statCard('Total Events', allEvents.length, 'Available to register', '#3b82f6')}
                {statCard('Registered', registrations.length, 'My registrations', '#8b5cf6')}
                {statCard('Upcoming', upcomingEvents.length, 'Events this season', '#f59e0b')}
                {statCard('Feedback', myFeedbacks.length, 'Reviews submitted', '#10b981')}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px' }}>
                {/* Upcoming events list */}
                <div style={{ ...card, padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '13px', margin: 0, letterSpacing: '1px' }}>UPCOMING EVENTS</p>
                    <button onClick={() => setActive('Browse Events')} style={{ padding: '6px 14px', backgroundColor: 'transparent', border: '1px solid #333', color: '#fff', cursor: 'pointer', fontSize: '10px', fontWeight: 700, fontFamily: 'Space Grotesk', letterSpacing: '0.5px' }}>BROWSE ALL</button>
                  </div>
                  {allEvents.length === 0
                    ? <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <p style={{ color: '#333', fontFamily: 'Space Grotesk', fontSize: '13px', margin: '0 0 4px' }}>No events posted yet</p>
                        <p style={{ color: '#222', fontFamily: 'Inter', fontSize: '12px', margin: 0 }}>Organizers will add events soon</p>
                      </div>
                    : allEvents.slice(0, 5).map(ev => (
                      <div key={ev.id} style={{ padding: '12px 0', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1, minWidth: 0, marginRight: '12px' }}>
                          <p style={{ color: '#fff', fontSize: '13px', fontFamily: 'Space Grotesk', fontWeight: 600, margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</p>
                          <p style={{ color: '#555', fontSize: '11px', fontFamily: 'Inter', margin: 0 }}>{ev.date} &bull; {ev.venue}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                          <span style={{ color: '#666', fontSize: '9px', fontFamily: 'Space Grotesk', border: '1px solid #222', padding: '3px 8px' }}>{ev.category}</span>
                          {myEventIds.includes(ev.id)
                            ? <span style={{ color: '#4ade80', fontSize: '9px', fontFamily: 'Space Grotesk', fontWeight: 700 }}>REGISTERED</span>
                            : <button onClick={() => register(ev.id)} style={{ padding: '5px 12px', backgroundColor: '#fff', border: 'none', color: '#000', cursor: 'pointer', fontSize: '10px', fontWeight: 700, fontFamily: 'Space Grotesk' }}>REGISTER</button>
                          }
                        </div>
                      </div>
                    ))
                  }
                </div>

                {/* Right column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Quick actions */}
                  <div style={{ ...card, padding: '1.25rem' }}>
                    <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '12px', margin: '0 0 1rem', letterSpacing: '1px' }}>QUICK ACTIONS</p>
                    {[
                      ['Browse & Register', 'Browse Events'],
                      ['My Registrations', 'My Registrations'],
                      ['Submit Feedback', 'Submit Feedback'],
                      ['View Profile', 'Profile'],
                    ].map(([label, tab]) => (
                      <button key={tab} onClick={() => setActive(tab)}
                        style={{ width: '100%', padding: '10px 14px', backgroundColor: 'transparent', border: '1px solid #1e1e1e', color: '#aaa', cursor: 'pointer', fontSize: '12px', fontFamily: 'Space Grotesk', textAlign: 'left', marginBottom: '6px', display: 'block' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#aaa' }}>
                        {label} &rarr;
                      </button>
                    ))}
                  </div>

                  {/* My recent registrations */}
                  <div style={{ ...card, padding: '1.25rem' }}>
                    <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '12px', margin: '0 0 1rem', letterSpacing: '1px' }}>MY REGISTRATIONS</p>
                    {registrations.length === 0
                      ? <p style={{ color: '#333', fontSize: '12px', fontFamily: 'Inter', margin: 0 }}>None yet</p>
                      : registrations.slice(0, 3).map((r, i) => {
                          const ev = allEvents.find(e => e.id === r.eventId)
                          return ev ? (
                            <div key={i} style={{ borderBottom: '1px solid #111', padding: '8px 0' }}>
                              <p style={{ color: '#ddd', fontSize: '12px', fontFamily: 'Space Grotesk', fontWeight: 600, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</p>
                              <p style={{ color: '#444', fontSize: '11px', fontFamily: 'Inter', margin: 0 }}>{ev.date}</p>
                            </div>
                          ) : null
                        })
                    }
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── BROWSE EVENTS ── */}
          {active === 'Browse Events' && (
            <div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem' }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title or description..." style={{ ...inp, flex: 1 }} />
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ ...inp, width: '180px' }}>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <p style={{ color: '#444', fontSize: '12px', fontFamily: 'Inter', marginBottom: '1rem' }}>{filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found</p>
              {filteredEvents.length === 0
                ? <div style={{ ...card, padding: '4rem', textAlign: 'center' }}>
                    <p style={{ color: '#333', fontFamily: 'Space Grotesk', fontSize: '15px', margin: '0 0 8px' }}>{allEvents.length === 0 ? 'No events posted yet' : 'No events match your search'}</p>
                    <p style={{ color: '#222', fontFamily: 'Inter', fontSize: '12px', margin: 0 }}>{allEvents.length === 0 ? 'Organizers will add events soon. Check back later!' : 'Try different keywords or clear the filter'}</p>
                  </div>
                : filteredEvents.map(ev => (
                  <div key={ev.id} style={{ ...card, padding: '1.5rem', marginBottom: '12px', display: 'flex', gap: '1.5rem' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '15px', margin: 0 }}>{ev.title}</p>
                        {ev.category && <span style={{ color: '#888', fontSize: '10px', fontFamily: 'Space Grotesk', border: '1px solid #222', padding: '2px 8px' }}>{ev.category}</span>}
                        {ev.status === 'approved' && <span style={{ color: '#4ade80', fontSize: '10px', fontFamily: 'Space Grotesk', border: '1px solid #14532d', padding: '2px 8px', backgroundColor: '#071a0e' }}>APPROVED</span>}
                      </div>
                      <p style={{ color: '#666', fontSize: '13px', fontFamily: 'Inter', margin: '0 0 12px', lineHeight: 1.6 }}>{ev.description}</p>
                      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <span style={{ color: '#555', fontSize: '12px', fontFamily: 'Space Grotesk' }}>Date: <span style={{ color: '#aaa' }}>{ev.date}</span></span>
                        <span style={{ color: '#555', fontSize: '12px', fontFamily: 'Space Grotesk' }}>Venue: <span style={{ color: '#aaa' }}>{ev.venue}</span></span>
                        {ev.organizer && <span style={{ color: '#555', fontSize: '12px', fontFamily: 'Space Grotesk' }}>By: <span style={{ color: '#aaa' }}>{ev.organizer}</span></span>}
                        {ev.maxSeats && <span style={{ color: '#555', fontSize: '12px', fontFamily: 'Space Grotesk' }}>Seats: <span style={{ color: '#aaa' }}>{ev.maxSeats}</span></span>}
                      </div>
                    </div>
                    <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: '8px' }}>
                      {myEventIds.includes(ev.id)
                        ? <>
                            <span style={{ color: '#4ade80', fontSize: '10px', fontFamily: 'Space Grotesk', fontWeight: 700, border: '1px solid #14532d', padding: '4px 12px', backgroundColor: '#071a0e' }}>REGISTERED</span>
                            <button onClick={() => cancelReg(ev.id)} style={{ padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444', cursor: 'pointer', fontSize: '11px', fontWeight: 700, fontFamily: 'Space Grotesk' }}>CANCEL</button>
                          </>
                        : <button onClick={() => register(ev.id)} style={{ padding: '10px 20px', backgroundColor: '#fff', border: 'none', color: '#000', cursor: 'pointer', fontSize: '12px', fontWeight: 700, fontFamily: 'Space Grotesk', letterSpacing: '0.5px' }}>REGISTER</button>
                      }
                    </div>
                  </div>
                ))
              }
            </div>
          )}

          {/* ── MY REGISTRATIONS ── */}
          {active === 'My Registrations' && (
            <div>
              {registrations.length === 0
                ? <div style={{ ...card, padding: '4rem', textAlign: 'center' }}>
                    <p style={{ color: '#333', fontFamily: 'Space Grotesk', fontSize: '15px', margin: '0 0 8px' }}>No registrations yet</p>
                    <p style={{ color: '#222', fontFamily: 'Inter', fontSize: '12px', margin: '0 0 1.5rem' }}>Browse available events and register to participate</p>
                    <button onClick={() => setActive('Browse Events')} style={{ padding: '10px 24px', backgroundColor: '#fff', color: '#000', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700, fontFamily: 'Space Grotesk' }}>BROWSE EVENTS</button>
                  </div>
                : <>
                    <p style={{ color: '#444', fontSize: '12px', fontFamily: 'Inter', marginBottom: '1rem' }}>{registrations.length} registration{registrations.length !== 1 ? 's' : ''}</p>
                    {registrations.map((r, i) => {
                      const ev = allEvents.find(e => e.id === r.eventId)
                      return ev ? (
                        <div key={i} style={{ ...card, padding: '1.5rem', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '15px', margin: '0 0 4px' }}>{ev.title}</p>
                            <p style={{ color: '#666', fontSize: '12px', fontFamily: 'Inter', margin: '0 0 2px' }}>Date: {ev.date} &nbsp;|&nbsp; Venue: {ev.venue}</p>
                            <p style={{ color: '#333', fontSize: '11px', fontFamily: 'Inter', margin: 0 }}>Registered on {new Date(r.registeredAt).toLocaleDateString()}</p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ color: '#4ade80', fontSize: '10px', fontFamily: 'Space Grotesk', fontWeight: 700, border: '1px solid #14532d', padding: '4px 12px', backgroundColor: '#071a0e' }}>REGISTERED</span>
                            <button onClick={() => cancelReg(r.eventId)} style={{ padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid #2a2a2a', color: '#666', cursor: 'pointer', fontSize: '11px', fontWeight: 700, fontFamily: 'Space Grotesk' }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#666' }}>
                              CANCEL
                            </button>
                          </div>
                        </div>
                      ) : null
                    })}
                  </>
              }
            </div>
          )}

          {/* ── SUBMIT FEEDBACK ── */}
          {active === 'Submit Feedback' && (
            <div style={{ maxWidth: '600px' }}>
              {feedbackSent && <div style={{ backgroundColor: '#071a0e', border: '1px solid #14532d', color: '#4ade80', padding: '12px 16px', fontSize: '13px', marginBottom: '1.5rem', fontFamily: 'Inter' }}>Feedback submitted successfully!</div>}
              {myEventIds.length === 0
                ? <div style={{ ...card, padding: '4rem', textAlign: 'center' }}>
                    <p style={{ color: '#333', fontFamily: 'Space Grotesk', fontSize: '15px', margin: '0 0 8px' }}>No registered events</p>
                    <p style={{ color: '#222', fontFamily: 'Inter', fontSize: '12px', margin: '0 0 1.5rem' }}>Register for an event first to submit feedback</p>
                    <button onClick={() => setActive('Browse Events')} style={{ padding: '10px 24px', backgroundColor: '#fff', color: '#000', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700, fontFamily: 'Space Grotesk' }}>BROWSE EVENTS</button>
                  </div>
                : <div style={{ ...card, padding: '2rem' }}>
                    <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '13px', margin: '0 0 1.5rem', letterSpacing: '1px' }}>SHARE YOUR EXPERIENCE</p>
                    <form onSubmit={submitFeedback}>
                      <div style={{ marginBottom: '1.1rem' }}>
                        <label style={lbl}>Select Event</label>
                        <select value={feedback.eventId} onChange={e => setFeedback({ ...feedback, eventId: e.target.value })} required style={inp}>
                          <option value=''>Choose an event...</option>
                          {allEvents.filter(ev => myEventIds.includes(ev.id)).map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
                        </select>
                      </div>
                      <div style={{ marginBottom: '1.1rem' }}>
                        <label style={lbl}>Rating: {feedback.rating} / 5</label>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                          {[1,2,3,4,5].map(n => (
                            <button key={n} type='button' onClick={() => setFeedback({ ...feedback, rating: n })}
                              style={{ width: '40px', height: '40px', backgroundColor: n <= feedback.rating ? '#fff' : 'transparent', border: `1px solid ${n <= feedback.rating ? '#fff' : '#333'}`, color: n <= feedback.rating ? '#000' : '#555', cursor: 'pointer', fontSize: '16px', fontFamily: 'Space Grotesk', fontWeight: 700 }}>
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div style={{ marginBottom: '1.1rem' }}>
                        <label style={lbl}>Review</label>
                        <textarea value={feedback.review} onChange={e => setFeedback({ ...feedback, review: e.target.value })} placeholder='Share your experience...' rows={4} required style={{ ...inp, resize: 'vertical' }} />
                      </div>
                      <div style={{ marginBottom: '1.5rem' }}>
                        <label style={lbl}>Suggestions (Optional)</label>
                        <textarea value={feedback.suggestion} onChange={e => setFeedback({ ...feedback, suggestion: e.target.value })} placeholder='Any suggestions for improvement...' rows={2} style={{ ...inp, resize: 'vertical' }} />
                      </div>
                      <button type='submit' style={{ width: '100%', padding: '13px', backgroundColor: '#fff', color: '#000', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'Space Grotesk' }}>SUBMIT FEEDBACK</button>
                    </form>
                  </div>
              }
              {myFeedbacks.length > 0 && (
                <div style={{ ...card, padding: '1.5rem', marginTop: '1.5rem' }}>
                  <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '12px', margin: '0 0 1rem', letterSpacing: '1px' }}>MY PREVIOUS FEEDBACK</p>
                  {myFeedbacks.map((f, i) => {
                    const ev = allEvents.find(e => e.id === f.eventId)
                    return (
                      <div key={i} style={{ borderBottom: '1px solid #111', padding: '12px 0' }}>
                        <p style={{ color: '#fff', fontSize: '13px', fontFamily: 'Space Grotesk', fontWeight: 700, margin: '0 0 4px' }}>{ev?.title || 'Event'}</p>
                        <p style={{ color: '#888', fontSize: '12px', fontFamily: 'Inter', margin: '0 0 4px' }}>{'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)} &nbsp; {f.rating}/5</p>
                        <p style={{ color: '#666', fontSize: '12px', fontFamily: 'Inter', margin: 0, lineHeight: 1.5 }}>{f.review}</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── PROFILE ── */}
          {active === 'Profile' && (
            <div style={{ maxWidth: '560px' }}>
              <div style={{ ...card, padding: '2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: '80px', height: '80px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {u.profilePhoto
                      ? <img src={u.profilePhoto} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '32px', color: '#000' }}>{(u.fullName || 'S')[0].toUpperCase()}</span>
                    }
                  </div>
                  <label style={{ position: 'absolute', bottom: '-8px', right: '-8px', backgroundColor: '#fff', color: '#000', fontSize: '9px', fontWeight: 700, fontFamily: 'Space Grotesk', padding: '4px 8px', cursor: 'pointer', border: '1px solid #000' }}>
                    EDIT
                    <input type='file' accept='image/*' style={{ display: 'none' }} onChange={handlePhotoChange} />
                  </label>
                </div>
                <div>
                  <h2 style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.4rem', margin: '0 0 4px' }}>{u.fullName}</h2>
                  <p style={{ color: '#666', fontFamily: 'Inter', fontSize: '13px', margin: '0 0 8px' }}>{u.email}</p>
                  <span style={{ backgroundColor: '#1a2a1a', color: '#4ade80', fontSize: '10px', fontWeight: 700, fontFamily: 'Space Grotesk', padding: '3px 10px', letterSpacing: '1px' }}>STUDENT</span>
                </div>
              </div>
              <div style={{ ...card, padding: '1.5rem' }}>
                {[
                  ['Full Name', u.fullName],
                  ['Email Address', u.email],
                  ['Role', 'Student'],
                  ['Events Registered', registrations.length],
                  ['Feedback Submitted', myFeedbacks.length],
                  ['Member Since', u.joinedAt ? new Date(u.joinedAt).toLocaleDateString() : 'N/A'],
                ].map(([label, val]) => (
                  <div key={label} style={{ borderBottom: '1px solid #111', padding: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: '#444', fontSize: '11px', fontFamily: 'Space Grotesk', letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>{label}</p>
                    <p style={{ color: '#ddd', fontSize: '13px', fontFamily: 'Inter', margin: 0 }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}