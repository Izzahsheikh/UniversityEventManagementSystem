import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../App.css'

const getUser = () => JSON.parse(localStorage.getItem('loggedInUser') || '{}')
const getUsers = () => JSON.parse(localStorage.getItem('users') || '[]')
const getEvents = () => JSON.parse(localStorage.getItem('events') || '[]')
const getRegistrations = () => JSON.parse(localStorage.getItem('registrations') || '[]')
const getFeedbacks = () => JSON.parse(localStorage.getItem('feedbacks') || '[]')

const tabs = ['Overview', 'Manage Users', 'Manage Events', 'Reports', 'Profile']

export default function AdminDashboard() {
  const [active, setActive] = useState('Overview')
  const [userFilter, setUserFilter] = useState('all')
  const navigate = useNavigate()
  const u = getUser()

  const users = getUsers()
  const events = getEvents()
  const registrations = getRegistrations()
  const feedbacks = getFeedbacks()

  const logout = () => { localStorage.removeItem('loggedInUser'); navigate('/login') }

  const deleteUser = (email) => {
    if (!window.confirm('Delete this user?')) return
    localStorage.setItem('users', JSON.stringify(getUsers().filter(u => u.email !== email)))
    window.location.reload()
  }

  const deleteEvent = (id) => {
    if (!window.confirm('Delete this event?')) return
    localStorage.setItem('events', JSON.stringify(getEvents().filter(e => e.id !== id)))
    localStorage.setItem('registrations', JSON.stringify(getRegistrations().filter(r => r.eventId !== id)))
    window.location.reload()
  }

  const filteredUsers = userFilter === 'all' ? users : users.filter(u => u.role === userFilter)

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
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '18px', color: '#000' }}>{u.fullName?.[0] || 'A'}</span>
          </div>
          <p style={{ color: '#fff', fontWeight: 700, fontFamily: 'Space Grotesk', fontSize: '14px', margin: '0 0 2px' }}>{u.fullName}</p>
          <p style={{ color: '#555', fontSize: '11px', margin: 0, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Space Grotesk' }}>? Administrator</p>
        </div>
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {tabs.map(tab => <button key={tab} onClick={() => setActive(tab)} style={sidebarBtn(tab)}>{tab}</button>)}
        </nav>
        <div style={{ padding: '1rem' }}>
          <button onClick={logout} style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', border: '1px solid #222', color: '#555', cursor: 'pointer', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Space Grotesk' }} onMouseEnter={e => { e.target.style.borderColor='#fff'; e.target.style.color='#fff' }} onMouseLeave={e => { e.target.style.borderColor='#222'; e.target.style.color='#555' }}>SIGN OUT</button>
        </div>
      </aside>

      <main style={{ marginLeft: '240px', flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <p className='section-eyebrow'>ADMIN PORTAL</p>
            <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, color: '#fff', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', margin: '4px 0 0', letterSpacing: '-0.02em' }}>{active}</h1>
          </div>

          {active === 'Overview' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '2rem' }}>
                {[['Total Users', users.length, 'Registered'],['Total Events', events.length, 'On platform'],['Registrations', registrations.length, 'All time'],['Feedback', feedbacks.length, 'Submitted'],['Students', users.filter(u=>u.role==='student').length, 'Accounts'],['Organizers', users.filter(u=>u.role==='organizer').length, 'Accounts']].map(([label, val, sub]) => (
                  <div key={label} style={{ border: '1px solid #1a1a1a', padding: '1.5rem', backgroundColor: '#0a0a0a' }}>
                    <p style={{ color: '#555', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'Space Grotesk', margin: '0 0 8px' }}>{label}</p>
                    <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '2rem', margin: '0 0 4px' }}>{val}</p>
                    <p style={{ color: '#444', fontSize: '12px', fontFamily: 'Inter', margin: 0 }}>{sub}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ border: '1px solid #1a1a1a', padding: '1.5rem', backgroundColor: '#0a0a0a' }}>
                  <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '14px', margin: '0 0 1rem' }}>RECENT USERS</p>
                  {users.slice(-4).reverse().map((usr, i) => (
                    <div key={i} style={{ borderBottom: '1px solid #111', padding: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
                      <p style={{ color: '#fff', fontSize: '13px', fontFamily: 'Inter', margin: 0 }}>{usr.fullName}</p>
                      <span style={{ color: '#888', fontSize: '10px', fontFamily: 'Space Grotesk', textTransform: 'uppercase', border: '1px solid #222', padding: '2px 8px' }}>{usr.role}</span>
                    </div>
                  ))}
                </div>
                <div style={{ border: '1px solid #1a1a1a', padding: '1.5rem', backgroundColor: '#0a0a0a' }}>
                  <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '14px', margin: '0 0 1rem' }}>RECENT EVENTS</p>
                  {events.slice(-4).reverse().map((ev, i) => (
                    <div key={i} style={{ borderBottom: '1px solid #111', padding: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
                      <p style={{ color: '#fff', fontSize: '13px', fontFamily: 'Inter', margin: 0 }}>{ev.title}</p>
                      <span style={{ color: '#888', fontSize: '10px', fontFamily: 'Space Grotesk', border: '1px solid #222', padding: '2px 8px' }}>{ev.category}</span>
                    </div>
                  ))}
                  {events.length === 0 && <p style={{ color: '#444', fontFamily: 'Inter', fontSize: '13px', margin: 0 }}>No events yet.</p>}
                </div>
              </div>
            </div>
          )}

          {active === 'Manage Users' && (
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
                {['all','student','organizer','admin'].map(f => (
                  <button key={f} onClick={() => setUserFilter(f)} style={{ padding: '7px 16px', border: userFilter === f ? '1px solid #fff' : '1px solid #333', backgroundColor: userFilter === f ? '#fff' : 'transparent', color: userFilter === f ? '#000' : '#555', cursor: 'pointer', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Space Grotesk' }}>{f}</button>
                ))}
              </div>
              <div style={{ border: '1px solid #1a1a1a', backgroundColor: '#0a0a0a' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #1a1a1a', display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr', gap: '1rem' }}>
                  {['NAME','EMAIL','ROLE','ACTION'].map(h => <p key={h} style={{ color: '#444', fontSize: '11px', letterSpacing: '1.5px', fontFamily: 'Space Grotesk', margin: 0 }}>{h}</p>)}
                </div>
                {filteredUsers.length === 0 ? <p style={{ color: '#444', fontFamily: 'Inter', fontSize: '13px', padding: '1.5rem', margin: 0 }}>No users found.</p> :
                  filteredUsers.map((usr, i) => (
                    <div key={i} style={{ padding: '12px 1.5rem', borderBottom: '1px solid #111', display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                      <p style={{ color: '#fff', fontSize: '13px', fontFamily: 'Inter', margin: 0 }}>{usr.fullName}</p>
                      <p style={{ color: '#555', fontSize: '12px', fontFamily: 'Inter', margin: 0 }}>{usr.email}</p>
                      <span style={{ color: '#888', fontSize: '10px', fontFamily: 'Space Grotesk', textTransform: 'uppercase', border: '1px solid #222', padding: '2px 8px', display: 'inline-block' }}>{usr.role}</span>
                      {usr.email !== u.email ? <button onClick={() => deleteUser(usr.email)} style={{ padding: '5px 10px', backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444', cursor: 'pointer', fontSize: '10px', fontWeight: 700, fontFamily: 'Space Grotesk' }}>DELETE</button> : <span style={{ color: '#333', fontSize: '11px', fontFamily: 'Space Grotesk' }}>YOU</span>}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {active === 'Manage Events' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {events.length === 0 ? (
                <div style={{ border: '1px solid #1a1a1a', padding: '3rem', backgroundColor: '#0a0a0a', textAlign: 'center' }}>
                  <p style={{ color: '#444', fontFamily: 'Space Grotesk', fontSize: '14px', margin: 0 }}>No events on the platform yet.</p>
                </div>
              ) : events.map(ev => {
                const regs = registrations.filter(r => r.eventId === ev.id)
                return (
                  <div key={ev.id} style={{ border: '1px solid #1a1a1a', padding: '1.5rem', backgroundColor: '#0a0a0a' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '15px', margin: 0 }}>{ev.title}</p>
                          <span style={{ color: '#888', fontSize: '10px', fontFamily: 'Space Grotesk', border: '1px solid #222', padding: '2px 8px' }}>{ev.category}</span>
                        </div>
                        <p style={{ color: '#555', fontSize: '12px', fontFamily: 'Inter', margin: '0 0 4px' }}>?? {ev.date} · ?? {ev.venue} · ?? {ev.organizer}</p>
                        <p style={{ color: '#444', fontSize: '12px', fontFamily: 'Space Grotesk', margin: 0 }}>?? {regs.length} registrations</p>
                      </div>
                      <button onClick={() => deleteEvent(ev.id)} style={{ padding: '7px 14px', backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444', cursor: 'pointer', fontSize: '11px', fontWeight: 700, fontFamily: 'Space Grotesk', whiteSpace: 'nowrap' }}>DELETE</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {active === 'Reports' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '1.5rem' }}>
                <div style={{ border: '1px solid #1a1a1a', padding: '1.5rem', backgroundColor: '#0a0a0a' }}>
                  <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '14px', margin: '0 0 1rem' }}>USER BREAKDOWN</p>
                  {[['Students', users.filter(u=>u.role==='student').length],['Organizers', users.filter(u=>u.role==='organizer').length],['Admins', users.filter(u=>u.role==='admin').length]].map(([role, count]) => (
                    <div key={role} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <p style={{ color: '#ccc', fontSize: '13px', fontFamily: 'Inter', margin: 0 }}>{role}</p>
                        <p style={{ color: '#fff', fontSize: '13px', fontFamily: 'Space Grotesk', fontWeight: 700, margin: 0 }}>{count}</p>
                      </div>
                      <div style={{ backgroundColor: '#111', height: '3px' }}>
                        <div style={{ height: '100%', backgroundColor: '#fff', width: users.length ? (count/users.length*100)+'%' : '0%', transition: 'width 0.5s' }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ border: '1px solid #1a1a1a', padding: '1.5rem', backgroundColor: '#0a0a0a' }}>
                  <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '14px', margin: '0 0 1rem' }}>EVENTS BY CATEGORY</p>
                  {['Academic','Sports','Cultural','Workshop','Seminar','Social','Other'].map(cat => {
                    const count = events.filter(e => e.category === cat).length
                    return count > 0 ? (
                      <div key={cat} style={{ marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <p style={{ color: '#ccc', fontSize: '13px', fontFamily: 'Inter', margin: 0 }}>{cat}</p>
                          <p style={{ color: '#fff', fontSize: '13px', fontFamily: 'Space Grotesk', fontWeight: 700, margin: 0 }}>{count}</p>
                        </div>
                        <div style={{ backgroundColor: '#111', height: '3px' }}>
                          <div style={{ height: '100%', backgroundColor: '#fff', width: events.length ? (count/events.length*100)+'%' : '0%' }} />
                        </div>
                      </div>
                    ) : null
                  })}
                  {events.length === 0 && <p style={{ color: '#444', fontFamily: 'Inter', fontSize: '13px', margin: 0 }}>No events yet.</p>}
                </div>
              </div>
              <div style={{ border: '1px solid #1a1a1a', padding: '1.5rem', backgroundColor: '#0a0a0a' }}>
                <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '14px', margin: '0 0 1rem' }}>RECENT FEEDBACK</p>
                {feedbacks.length === 0 ? <p style={{ color: '#444', fontFamily: 'Inter', fontSize: '13px', margin: 0 }}>No feedback submitted yet.</p> :
                  feedbacks.slice(-5).reverse().map((f, i) => {
                    const ev = events.find(e => e.id === f.eventId)
                    return (
                      <div key={i} style={{ borderBottom: '1px solid #111', padding: '12px 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <p style={{ color: '#fff', fontSize: '13px', fontFamily: 'Space Grotesk', fontWeight: 700, margin: 0 }}>{f.studentName} <span style={{ color: '#444', fontWeight: 400 }}>on {ev?.title || 'Unknown Event'}</span></p>
                          <span style={{ color: '#f59e0b', fontSize: '12px' }}>{'?'.repeat(f.rating)}{'?'.repeat(5-f.rating)}</span>
                        </div>
                        <p style={{ color: '#666', fontSize: '13px', fontFamily: 'Inter', margin: 0 }}>{f.review}</p>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

          {active === 'Profile' && (
            <div style={{ border: '1px solid #1a1a1a', padding: '2.5rem', backgroundColor: '#0a0a0a', maxWidth: '500px' }}>
              <div style={{ width: '72px', height: '72px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '28px', color: '#000' }}>{u.fullName?.[0]}</span>
              </div>
              {[['Full Name', u.fullName],['Email', u.email],['Role', 'Administrator'],['Joined', u.joinedAt ? new Date(u.joinedAt).toLocaleDateString() : 'N/A'],['Total Users', users.length],['Total Events', events.length]].map(([label, val]) => (
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
