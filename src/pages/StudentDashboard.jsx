import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../App.css'

const getUser = () => JSON.parse(localStorage.getItem('loggedInUser') || '{}')
const getEvents = () => JSON.parse(localStorage.getItem('events') || '[]')
const getRegistrations = () => JSON.parse(localStorage.getItem('registrations') || '[]')
const getFeedbacks = () => JSON.parse(localStorage.getItem('feedbacks') || '[]')

const tabs = ['Overview', 'Browse Events', 'My Registrations', 'Submit Feedback', 'Profile']

const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #222', backgroundColor: '#111', color: '#fff', fontSize: '13px', fontFamily: 'Inter', outline: 'none', boxSizing: 'border-box' }
const labelStyle = { display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#555', marginBottom: '6px', fontFamily: 'Space Grotesk' }

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
  const feedbacks = getFeedbacks()

  const categories = ['All', ...new Set(allEvents.map(e => e.category).filter(Boolean))]
  const filteredEvents = allEvents.filter(ev => {
    const matchSearch = ev.title?.toLowerCase().includes(search.toLowerCase()) || ev.description?.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCategory === 'All' || ev.category === filterCategory
    return matchSearch && matchCat
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
      const updated = { ...u, profilePhoto: ev.target.result }
      localStorage.setItem('loggedInUser', JSON.stringify(updated))
      window.location.reload()
    }
    reader.readAsDataURL(file)
  }

  const sidebarBtn = (tab) => ({
    width: '100%', padding: '10px 1.5rem', background: active === tab ? '#fff' : 'none',
    border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '13px',
    fontWeight: active === tab ? 700 : 500, color: active === tab ? '#000' : '#555',
    fontFamily: 'Space Grotesk', transition: 'all 0.2s'
  })

  const upcomingEvents = allEvents.filter(e => new Date(e.date) >= new Date())
  const myFeedbacks = feedbacks.filter(f => f.studentEmail === u.email)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', fontFamily: 'Inter, sans-serif', display: 'flex' }}>

      {/* SIDEBAR */}
      <aside style={{ width: '240px', backgroundColor: '#080808', borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 50 }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #1a1a1a' }}>
          <Link to='/' style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div className='navbar__logo-box'><span className='navbar__logo-letters'>EM</span></div>
            <span className='navbar__logo-name' style={{ fontSize: '14px' }}>EventManage</span>
          </Link>
        </div>

        <div style={{ padding: '1.5rem 1rem', borderBottom: '1px solid #1a1a1a' }}>
          <div style={{ position: 'relative', width: '48px', marginBottom: '10px' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {u.profilePhoto
                ? <img src={u.profilePhoto} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '18px', color: '#000' }}>{u.fullName?.[0] || 'S'}</span>
              }
            </div>
            <label style={{ position: 'absolute', bottom: '-6px', right: '-6px', backgroundColor: '#fff', color: '#000', fontSize: '8px', fontWeight: 700, fontFamily: 'Space Grotesk', padding: '2px 5px', cursor: 'pointer', lineHeight: 1, border: '1px solid #ccc' }}>
              EDIT
              <input type='file' accept='image/*' style={{ display: 'none' }} onChange={handlePhotoChange} />
            </label>
          </div>
          <p style={{ color: '#fff', fontWeight: 700, fontFamily: 'Space Grotesk', fontSize: '14px', margin: '0 0 2px' }}>{u.fullName}</p>
          <p style={{ color: '#555', fontSize: '11px', margin: 0, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Space Grotesk' }}>STUDENT</p>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {tabs.map(tab => <button key={tab} onClick={() => setActive(tab)} style={sidebarBtn(tab)}>{tab}</button>)}
        </nav>

        <div style={{ padding: '1rem' }}>
          <button onClick={logout} style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', border: '1px solid #222', color: '#555', cursor: 'pointer', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Space Grotesk' }}
            onMouseEnter={e => { e.target.style.borderColor = '#fff'; e.target.style.color = '#fff' }}
            onMouseLeave={e => { e.target.style.borderColor = '#222'; e.target.style.color = '#555' }}>
            SIGN OUT
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ marginLeft: '240px', flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <p className='section-eyebrow'>STUDENT PORTAL</p>
            <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, color: '#fff', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', margin: '4px 0 0', letterSpacing: '-0.02em' }}>{active}</h1>
          </div>

          {/* ── OVERVIEW ── */}
          {active === 'Overview' && (
            <div>
              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '2rem' }}>
                {[
                  ['Total Events', allEvents.length, 'Available'],
                  ['Registered', registrations.length, 'My events'],
                  ['Upcoming', upcomingEvents.length, 'Events'],
                  ['Feedback', myFeedbacks.length, 'Submitted']
                ].map(([label, val, sub]) => (
                  <div key={label} style={{ border: '1px solid #1a1a1a', padding: '1.5rem', backgroundColor: '#0a0a0a' }}>
                    <p style={{ color: '#555', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'Space Grotesk', margin: '0 0 8px' }}>{label}</p>
                    <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '2rem', margin: '0 0 4px' }}>{val}</p>
                    <p style={{ color: '#444', fontSize: '12px', fontFamily: 'Inter', margin: 0 }}>{sub}</p>
                  </div>
                ))}
              </div>

              {/* Upcoming Events */}
              <div style={{ border: '1px solid #1a1a1a', padding: '1.5rem', backgroundColor: '#0a0a0a', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '14px', margin: 0 }}>UPCOMING EVENTS</p>
                  <button onClick={() => setActive('Browse Events')} style={{ padding: '7px 16px', backgroundColor: '#fff', color: '#000', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 700, fontFamily: 'Space Grotesk' }}>+ BROWSE ALL</button>
                </div>
                {allEvents.length === 0
                  ? <p style={{ color: '#444', fontFamily: 'Inter', fontSize: '14px', margin: 0 }}>No events yet. Check back soon!</p>
                  : allEvents.slice(0, 3).map(ev => (
                    <div key={ev.id} style={{ borderBottom: '1px solid #111', padding: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ color: '#fff', fontSize: '14px', fontFamily: 'Space Grotesk', fontWeight: 700, margin: '0 0 2px' }}>{ev.title}</p>
                        <p style={{ color: '#555', fontSize: '12px', fontFamily: 'Inter', margin: 0 }}>{ev.date} &nbsp;|&nbsp; {ev.venue}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#888', fontSize: '10px', fontFamily: 'Space Grotesk', border: '1px solid #333', padding: '4px 10px' }}>{ev.category}</span>
                        {myEventIds.includes(ev.id)
                          ? <span style={{ color: '#22c55e', fontSize: '10px', fontFamily: 'Space Grotesk', fontWeight: 700 }}>REGISTERED</span>
                          : <button onClick={() => register(ev.id)} style={{ padding: '6px 14px', backgroundColor: '#fff', border: 'none', color: '#000', cursor: 'pointer', fontSize: '11px', fontWeight: 700, fontFamily: 'Space Grotesk' }}>REGISTER</button>
                        }
                      </div>
                    </div>
                  ))
                }
              </div>

              {/* My Recent Registrations */}
              {registrations.length > 0 && (
                <div style={{ border: '1px solid #1a1a1a', padding: '1.5rem', backgroundColor: '#0a0a0a' }}>
                  <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '14px', margin: '0 0 1rem' }}>MY RECENT REGISTRATIONS</p>
                  {registrations.slice(0, 3).map((r, i) => {
                    const ev = allEvents.find(e => e.id === r.eventId)
                    return ev ? (
                      <div key={i} style={{ borderBottom: '1px solid #111', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <p style={{ color: '#fff', fontSize: '13px', fontFamily: 'Space Grotesk', fontWeight: 700, margin: '0 0 2px' }}>{ev.title}</p>
                          <p style={{ color: '#555', fontSize: '12px', fontFamily: 'Inter', margin: 0 }}>{ev.date} | {ev.venue}</p>
                        </div>
                        <span style={{ color: '#22c55e', fontSize: '10px', fontFamily: 'Space Grotesk', fontWeight: 700, border: '1px solid #14532d', padding: '3px 10px', backgroundColor: '#071a0e' }}>REGISTERED</span>
                      </div>
                    ) : null
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── BROWSE EVENTS ── */}
          {active === 'Browse Events' && (
            <div>
              {/* Search + Filter */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem' }}>
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search events..."
                  style={{ ...inputStyle, flex: 1 }}
                />
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                  style={{ ...inputStyle, width: '160px' }}>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {filteredEvents.length === 0
                ? (
                  <div style={{ border: '1px solid #1a1a1a', padding: '3rem', backgroundColor: '#0a0a0a', textAlign: 'center' }}>
                    <p style={{ color: '#444', fontFamily: 'Space Grotesk', fontSize: '14px', margin: 0 }}>
                      {allEvents.length === 0 ? 'No events available yet. Organizers will post events soon!' : 'No events match your search.'}
                    </p>
                  </div>
                )
                : filteredEvents.map(ev => (
                  <div key={ev.id} style={{ border: '1px solid #1a1a1a', padding: '1.5rem', backgroundColor: '#0a0a0a', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '15px', margin: 0 }}>{ev.title}</p>
                        <span style={{ color: '#888', fontSize: '10px', fontFamily: 'Space Grotesk', border: '1px solid #222', padding: '2px 8px' }}>{ev.category}</span>
                        {ev.status === 'approved' && <span style={{ color: '#22c55e', fontSize: '10px', fontFamily: 'Space Grotesk', border: '1px solid #14532d', padding: '2px 8px' }}>APPROVED</span>}
                      </div>
                      <p style={{ color: '#666', fontSize: '13px', fontFamily: 'Inter', margin: '0 0 8px', lineHeight: 1.6 }}>{ev.description}</p>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <span style={{ color: '#444', fontSize: '12px', fontFamily: 'Space Grotesk' }}>Date: {ev.date}</span>
                        <span style={{ color: '#444', fontSize: '12px', fontFamily: 'Space Grotesk' }}>Venue: {ev.venue}</span>
                        <span style={{ color: '#444', fontSize: '12px', fontFamily: 'Space Grotesk' }}>By: {ev.organizer}</span>
                      </div>
                    </div>
                    <div style={{ marginLeft: '1.5rem', flexShrink: 0 }}>
                      {myEventIds.includes(ev.id)
                        ? <button onClick={() => cancelReg(ev.id)} style={{ padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444', cursor: 'pointer', fontSize: '11px', fontWeight: 700, fontFamily: 'Space Grotesk' }}>CANCEL</button>
                        : <button onClick={() => register(ev.id)} style={{ padding: '8px 16px', backgroundColor: '#fff', border: 'none', color: '#000', cursor: 'pointer', fontSize: '11px', fontWeight: 700, fontFamily: 'Space Grotesk' }}>REGISTER</button>
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
                ? (
                  <div style={{ border: '1px solid #1a1a1a', padding: '3rem', backgroundColor: '#0a0a0a', textAlign: 'center' }}>
                    <p style={{ color: '#444', fontFamily: 'Space Grotesk', fontSize: '14px', margin: '0 0 1.5rem' }}>You have not registered for any events yet.</p>
                    <button onClick={() => setActive('Browse Events')} style={{ padding: '10px 20px', backgroundColor: '#fff', color: '#000', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700, fontFamily: 'Space Grotesk' }}>BROWSE EVENTS</button>
                  </div>
                )
                : registrations.map((r, i) => {
                  const ev = allEvents.find(e => e.id === r.eventId)
                  return ev ? (
                    <div key={i} style={{ border: '1px solid #1a1a1a', padding: '1.5rem', backgroundColor: '#0a0a0a', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '15px', margin: '0 0 4px' }}>{ev.title}</p>
                        <p style={{ color: '#555', fontSize: '12px', fontFamily: 'Inter', margin: '0 0 2px' }}>Date: {ev.date} | Venue: {ev.venue}</p>
                        <p style={{ color: '#444', fontSize: '11px', fontFamily: 'Inter', margin: 0 }}>Registered: {new Date(r.registeredAt).toLocaleDateString()}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ color: '#22c55e', fontSize: '10px', fontFamily: 'Space Grotesk', fontWeight: 700, border: '1px solid #14532d', padding: '3px 10px', backgroundColor: '#071a0e' }}>REGISTERED</span>
                        <button onClick={() => cancelReg(r.eventId)} style={{ padding: '6px 14px', backgroundColor: 'transparent', border: '1px solid #333', color: '#666', cursor: 'pointer', fontSize: '11px', fontWeight: 700, fontFamily: 'Space Grotesk' }}>CANCEL</button>
                      </div>
                    </div>
                  ) : null
                })
              }
            </div>
          )}

          {/* ── SUBMIT FEEDBACK ── */}
          {active === 'Submit Feedback' && (
            <div style={{ maxWidth: '560px' }}>
              {feedbackSent && (
                <div style={{ backgroundColor: '#071a0e', border: '1px solid #14532d', color: '#22c55e', padding: '12px 16px', fontSize: '13px', marginBottom: '1.5rem', fontFamily: 'Inter' }}>
                  Feedback submitted successfully!
                </div>
              )}

              {myEventIds.length === 0 ? (
                <div style={{ border: '1px solid #1a1a1a', padding: '3rem', backgroundColor: '#0a0a0a', textAlign: 'center' }}>
                  <p style={{ color: '#444', fontFamily: 'Space Grotesk', fontSize: '14px', margin: '0 0 1.5rem' }}>You need to register for an event before submitting feedback.</p>
                  <button onClick={() => setActive('Browse Events')} style={{ padding: '10px 20px', backgroundColor: '#fff', color: '#000', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700, fontFamily: 'Space Grotesk' }}>BROWSE EVENTS</button>
                </div>
              ) : (
                <div style={{ border: '1px solid #1a1a1a', padding: '2rem', backgroundColor: '#0a0a0a' }}>
                  <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '14px', margin: '0 0 1.5rem' }}>SHARE YOUR EXPERIENCE</p>
                  <form onSubmit={submitFeedback}>
                    <div style={{ marginBottom: '1.1rem' }}>
                      <label style={labelStyle}>Select Event</label>
                      <select value={feedback.eventId} onChange={e => setFeedback({ ...feedback, eventId: e.target.value })} required style={inputStyle}>
                        <option value=''>Choose an event...</option>
                        {allEvents.filter(ev => myEventIds.includes(ev.id)).map(ev => (
                          <option key={ev.id} value={ev.id}>{ev.title}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ marginBottom: '1.1rem' }}>
                      <label style={labelStyle}>Rating: {feedback.rating}/5</label>
                      <input type='range' min='1' max='5' value={feedback.rating}
                        onChange={e => setFeedback({ ...feedback, rating: Number(e.target.value) })}
                        style={{ width: '100%', accentColor: '#fff' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                        {[1, 2, 3, 4, 5].map(n => (
                          <span key={n} style={{ color: n <= feedback.rating ? '#fff' : '#333', fontSize: '18px', cursor: 'pointer' }}
                            onClick={() => setFeedback({ ...feedback, rating: n })}>
                            &#9733;
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ marginBottom: '1.1rem' }}>
                      <label style={labelStyle}>Review</label>
                      <textarea value={feedback.review} onChange={e => setFeedback({ ...feedback, review: e.target.value })}
                        placeholder='Share your experience...' rows={3} required
                        style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={labelStyle}>Suggestions (Optional)</label>
                      <textarea value={feedback.suggestion} onChange={e => setFeedback({ ...feedback, suggestion: e.target.value })}
                        placeholder='Any suggestions for improvement...' rows={2}
                        style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>
                    <button type='submit' style={{ width: '100%', padding: '12px', backgroundColor: '#fff', color: '#000', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'Space Grotesk' }}>
                      SUBMIT FEEDBACK
                    </button>
                  </form>
                </div>
              )}

              {/* Previous Feedbacks */}
              {myFeedbacks.length > 0 && (
                <div style={{ border: '1px solid #1a1a1a', padding: '1.5rem', backgroundColor: '#0a0a0a', marginTop: '1.5rem' }}>
                  <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '13px', margin: '0 0 1rem' }}>MY PREVIOUS FEEDBACK</p>
                  {myFeedbacks.map((f, i) => {
                    const ev = allEvents.find(e => e.id === f.eventId)
                    return (
                      <div key={i} style={{ borderBottom: '1px solid #111', padding: '10px 0' }}>
                        <p style={{ color: '#fff', fontSize: '13px', fontFamily: 'Space Grotesk', fontWeight: 700, margin: '0 0 2px' }}>{ev?.title || 'Event'}</p>
                        <p style={{ color: '#888', fontSize: '12px', fontFamily: 'Inter', margin: '0 0 2px' }}>Rating: {'★'.repeat(f.rating)}{'☆'.repeat(5 - f.rating)}</p>
                        <p style={{ color: '#666', fontSize: '12px', fontFamily: 'Inter', margin: 0 }}>{f.review}</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── PROFILE ── */}
          {active === 'Profile' && (
            <div style={{ maxWidth: '500px' }}>
              <div style={{ border: '1px solid #1a1a1a', padding: '2.5rem', backgroundColor: '#0a0a0a' }}>
                {/* Photo */}
                <div style={{ position: 'relative', width: '80px', marginBottom: '2rem' }}>
                  <div style={{ width: '80px', height: '80px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {u.profilePhoto
                      ? <img src={u.profilePhoto} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '32px', color: '#000' }}>{u.fullName?.[0]}</span>
                    }
                  </div>
                  <label style={{ position: 'absolute', bottom: '-10px', right: '-10px', backgroundColor: '#fff', color: '#000', fontSize: '10px', fontWeight: 700, fontFamily: 'Space Grotesk', padding: '4px 8px', cursor: 'pointer', border: '1px solid #000' }}>
                    EDIT
                    <input type='file' accept='image/*' style={{ display: 'none' }} onChange={handlePhotoChange} />
                  </label>
                </div>

                {/* Info */}
                {[
                  ['Full Name', u.fullName],
                  ['Email', u.email],
                  ['Role', 'Student'],
                  ['Events Registered', registrations.length],
                  ['Feedback Submitted', myFeedbacks.length],
                  ['Member Since', u.joinedAt ? new Date(u.joinedAt).toLocaleDateString() : 'N/A'],
                ].map(([label, val]) => (
                  <div key={label} style={{ borderBottom: '1px solid #111', padding: '12px 0', display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ color: '#444', fontSize: '12px', fontFamily: 'Space Grotesk', letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>{label}</p>
                    <p style={{ color: '#fff', fontSize: '14px', fontFamily: 'Inter', margin: 0 }}>{val}</p>
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