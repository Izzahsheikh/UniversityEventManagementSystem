import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../App.css'

const user = () => JSON.parse(localStorage.getItem('loggedInUser') || '{}')

const mockData = {
  courses: [
    { code: 'CS101', name: 'Introduction to Programming', students: 45, section: 'A', room: 'Lab 3' },
    { code: 'CS301', name: 'Data Structures', students: 38, section: 'B', room: 'Lab 2' },
    { code: 'CS501', name: 'Algorithms', students: 30, section: 'A', room: 'Room 301' },
  ],
  students: [
    { name: 'Ali Hassan', id: 'CS-2021-001', course: 'CS101', attendance: 92, grade: 'A' },
    { name: 'Sara Khan', id: 'CS-2021-002', course: 'CS101', attendance: 78, grade: 'B+' },
    { name: 'Usman Tariq', id: 'CS-2021-003', course: 'CS301', attendance: 85, grade: 'A-' },
    { name: 'Fatima Malik', id: 'CS-2021-004', course: 'CS301', attendance: 60, grade: 'C+' },
    { name: 'Bilal Ahmed', id: 'CS-2021-005', course: 'CS501', attendance: 95, grade: 'A+' },
  ],
  assignments: [
    { course: 'CS101', title: 'Lab 5 - Arrays', due: 'Jun 30, 2025', submissions: 38, total: 45 },
    { course: 'CS301', title: 'Linked List Implementation', due: 'Jul 2, 2025', submissions: 30, total: 38 },
    { course: 'CS501', title: 'Algorithm Analysis Report', due: 'Jul 5, 2025', submissions: 28, total: 30 },
  ],
  announcements: [
    { course: 'CS101', msg: 'Mid-term exam scheduled for July 10th.', time: '2h ago' },
    { course: 'CS301', msg: 'Lab sessions moved to Thursday this week.', time: '1d ago' },
  ],
}

const tabs = ['Overview', 'My Courses', 'Students', 'Assignments', 'Announcements', 'Profile']

export default function TeacherDashboard() {
  const [active, setActive] = useState('Overview')
  const [newAnnouncement, setNewAnnouncement] = useState({ course: '', msg: '' })
  const [announcements, setAnnouncements] = useState(mockData.announcements)
  const navigate = useNavigate()
  const u = user()

  const logout = () => { localStorage.removeItem('loggedInUser'); navigate('/login') }

  const postAnnouncement = (e) => {
    e.preventDefault()
    if (!newAnnouncement.course || !newAnnouncement.msg) return
    setAnnouncements([{ ...newAnnouncement, time: 'Just now' }, ...announcements])
    setNewAnnouncement({ course: '', msg: '' })
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', minHeight: '100vh' }}>

        {/* Sidebar */}
        <aside style={{ width: '240px', backgroundColor: '#080808', borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 50 }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #1a1a1a' }}>
            <Link to='/' style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <div className='navbar__logo-box'><span className='navbar__logo-letters'>EM</span></div>
              <span className='navbar__logo-name' style={{ fontSize: '14px' }}>EventManage</span>
            </Link>
          </div>
          <div style={{ padding: '1.5rem 1rem', borderBottom: '1px solid #1a1a1a' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '18px', color: '#000' }}>{u.fullName?.[0] || 'T'}</span>
            </div>
            <p style={{ color: '#fff', fontWeight: 700, fontFamily: 'Space Grotesk', fontSize: '14px', margin: '0 0 2px' }}>{u.fullName || 'Teacher'}</p>
            <p style={{ color: '#555', fontSize: '11px', margin: 0, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Space Grotesk' }}>Teacher</p>
          </div>
          <nav style={{ flex: 1, padding: '1rem 0' }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActive(tab)} style={{ width: '100%', padding: '10px 1.5rem', background: active === tab ? '#fff' : 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '13px', fontWeight: active === tab ? 700 : 500, color: active === tab ? '#000' : '#555', fontFamily: 'Space Grotesk', letterSpacing: '0.3px', transition: 'all 0.2s' }}>
                {tab}
              </button>
            ))}
          </nav>
          <div style={{ padding: '1rem' }}>
            <button onClick={logout} style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', border: '1px solid #222', color: '#555', cursor: 'pointer', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Space Grotesk', transition: 'all 0.2s' }} onMouseEnter={e => { e.target.style.borderColor='#fff'; e.target.style.color='#fff' }} onMouseLeave={e => { e.target.style.borderColor='#222'; e.target.style.color='#555' }}>SIGN OUT</button>
          </div>
        </aside>

        {/* Main */}
        <main style={{ marginLeft: '240px', flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <p className='section-eyebrow'>TEACHER PORTAL</p>
              <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, color: '#fff', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', margin: '4px 0 0', letterSpacing: '-0.02em' }}>{active}</h1>
            </div>

            {/* OVERVIEW */}
            {active === 'Overview' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '2rem' }}>
                  {[['Courses', mockData.courses.length, 'Teaching'],['Students', mockData.students.length, 'Total enrolled'],['Assignments', mockData.assignments.length, 'Active'],['Announcements', announcements.length, 'Posted']].map(([label, val, sub]) => (
                    <div key={label} style={{ border: '1px solid #1a1a1a', padding: '1.5rem', backgroundColor: '#0a0a0a' }}>
                      <p style={{ color: '#555', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'Space Grotesk', margin: '0 0 8px' }}>{label}</p>
                      <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '2rem', margin: '0 0 4px' }}>{val}</p>
                      <p style={{ color: '#444', fontSize: '12px', fontFamily: 'Inter', margin: 0 }}>{sub}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ border: '1px solid #1a1a1a', padding: '1.5rem', backgroundColor: '#0a0a0a' }}>
                    <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '14px', margin: '0 0 1rem', letterSpacing: '0.5px' }}>MY COURSES</p>
                    {mockData.courses.map(c => (
                      <div key={c.code} style={{ borderBottom: '1px solid #111', padding: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <p style={{ color: '#fff', fontSize: '13px', fontFamily: 'Space Grotesk', fontWeight: 700, margin: '0 0 2px' }}>{c.code}</p>
                          <p style={{ color: '#555', fontSize: '12px', fontFamily: 'Inter', margin: 0 }}>{c.name}</p>
                        </div>
                        <span style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '14px' }}>{c.students}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ border: '1px solid #1a1a1a', padding: '1.5rem', backgroundColor: '#0a0a0a' }}>
                    <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '14px', margin: '0 0 1rem', letterSpacing: '0.5px' }}>ASSIGNMENT SUBMISSIONS</p>
                    {mockData.assignments.map((a, i) => (
                      <div key={i} style={{ borderBottom: '1px solid #111', padding: '10px 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <p style={{ color: '#fff', fontSize: '13px', fontFamily: 'Inter', margin: 0 }}>{a.title}</p>
                          <p style={{ color: '#888', fontSize: '12px', fontFamily: 'Space Grotesk', margin: 0 }}>{a.submissions}/{a.total}</p>
                        </div>
                        <div style={{ backgroundColor: '#111', height: '3px' }}>
                          <div style={{ height: '100%', backgroundColor: '#fff', width: (a.submissions/a.total*100) + '%' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* MY COURSES */}
            {active === 'My Courses' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {mockData.courses.map(c => (
                  <div key={c.code} className='step-card' style={{ backgroundColor: '#0a0a0a' }}>
                    <p style={{ color: '#555', fontSize: '11px', letterSpacing: '2px', fontFamily: 'Space Grotesk', margin: '0 0 8px' }}>{c.code} · SECTION {c.section}</p>
                    <h3 style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1rem', margin: '0 0 8px' }}>{c.name}</h3>
                    <p style={{ color: '#555', fontSize: '13px', fontFamily: 'Inter', margin: '0 0 1rem' }}>{c.room}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#666', fontSize: '12px', fontFamily: 'Space Grotesk' }}>Students</span>
                      <span style={{ color: '#fff', fontWeight: 700, fontFamily: 'Space Grotesk', fontSize: '14px' }}>{c.students}</span>
                    </div>
                    <div className='step-card__hover-line' />
                  </div>
                ))}
              </div>
            )}

            {/* STUDENTS */}
            {active === 'Students' && (
              <div style={{ border: '1px solid #1a1a1a', backgroundColor: '#0a0a0a' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #1a1a1a', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '1rem' }}>
                  {['NAME','ID','COURSE','ATTENDANCE','GRADE'].map(h => <p key={h} style={{ color: '#444', fontSize: '11px', letterSpacing: '1.5px', fontFamily: 'Space Grotesk', margin: 0 }}>{h}</p>)}
                </div>
                {mockData.students.map((s, i) => (
                  <div key={i} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #111', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                    <p style={{ color: '#fff', fontSize: '13px', fontFamily: 'Inter', margin: 0, fontWeight: 600 }}>{s.name}</p>
                    <p style={{ color: '#555', fontSize: '12px', fontFamily: 'Space Grotesk', margin: 0 }}>{s.id}</p>
                    <p style={{ color: '#888', fontSize: '13px', fontFamily: 'Space Grotesk', margin: 0 }}>{s.course}</p>
                    <p style={{ color: s.attendance >= 90 ? '#22c55e' : s.attendance >= 75 ? '#f59e0b' : '#ef4444', fontSize: '13px', fontFamily: 'Space Grotesk', fontWeight: 700, margin: 0 }}>{s.attendance}%</p>
                    <p style={{ color: '#fff', fontSize: '13px', fontFamily: 'Space Grotesk', fontWeight: 700, margin: 0 }}>{s.grade}</p>
                  </div>
                ))}
              </div>
            )}

            {/* ASSIGNMENTS */}
            {active === 'Assignments' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {mockData.assignments.map((a, i) => (
                  <div key={i} style={{ border: '1px solid #1a1a1a', padding: '1.5rem', backgroundColor: '#0a0a0a' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div>
                        <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, margin: '0 0 4px' }}>{a.title}</p>
                        <p style={{ color: '#555', fontSize: '12px', fontFamily: 'Inter', margin: 0 }}>{a.course} · Due: {a.due}</p>
                      </div>
                      <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.2rem', margin: 0 }}>{a.submissions}<span style={{ color: '#444', fontSize: '13px', fontWeight: 400 }}>/{a.total}</span></p>
                    </div>
                    <div style={{ backgroundColor: '#111', height: '4px' }}>
                      <div style={{ height: '100%', backgroundColor: '#fff', width: (a.submissions/a.total*100) + '%', transition: 'width 0.5s' }} />
                    </div>
                    <p style={{ color: '#444', fontSize: '12px', fontFamily: 'Inter', margin: '8px 0 0' }}>{Math.round(a.submissions/a.total*100)}% submitted</p>
                  </div>
                ))}
              </div>
            )}

            {/* ANNOUNCEMENTS */}
            {active === 'Announcements' && (
              <div>
                <form onSubmit={postAnnouncement} style={{ border: '1px solid #1a1a1a', padding: '1.5rem', backgroundColor: '#0a0a0a', marginBottom: '1.5rem' }}>
                  <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '14px', margin: '0 0 1rem', letterSpacing: '0.5px' }}>POST NEW ANNOUNCEMENT</p>
                  <select value={newAnnouncement.course} onChange={e => setNewAnnouncement({ ...newAnnouncement, course: e.target.value })} required style={{ width: '100%', padding: '10px 14px', border: '1px solid #222', backgroundColor: '#111', color: '#fff', fontSize: '13px', fontFamily: 'Inter', marginBottom: '10px', outline: 'none' }}>
                    <option value=''>Select Course</option>
                    {mockData.courses.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                  </select>
                  <textarea value={newAnnouncement.msg} onChange={e => setNewAnnouncement({ ...newAnnouncement, msg: e.target.value })} placeholder='Write your announcement...' rows={3} required style={{ width: '100%', padding: '10px 14px', border: '1px solid #222', backgroundColor: '#111', color: '#fff', fontSize: '13px', fontFamily: 'Inter', marginBottom: '10px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                  <button type='submit' style={{ padding: '10px 24px', backgroundColor: '#fff', color: '#000', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Space Grotesk' }}>POST ANNOUNCEMENT</button>
                </form>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {announcements.map((a, i) => (
                    <div key={i} style={{ border: '1px solid #1a1a1a', padding: '1.5rem', backgroundColor: '#0a0a0a' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, margin: 0 }}>{a.course}</p>
                        <p style={{ color: '#444', fontSize: '12px', fontFamily: 'Inter', margin: 0 }}>{a.time}</p>
                      </div>
                      <p style={{ color: '#888', fontSize: '14px', fontFamily: 'Inter', margin: 0, lineHeight: 1.7 }}>{a.msg}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PROFILE */}
            {active === 'Profile' && (
              <div style={{ border: '1px solid #1a1a1a', padding: '2.5rem', backgroundColor: '#0a0a0a', maxWidth: '500px' }}>
                <div style={{ width: '72px', height: '72px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '28px', color: '#000' }}>{u.fullName?.[0] || 'T'}</span>
                </div>
                {[['Full Name', u.fullName],['Email', u.email],['Role', 'Teacher'],['Member Since', u.joinedAt ? new Date(u.joinedAt).toLocaleDateString() : 'N/A'],['Courses Teaching', mockData.courses.length],['Total Students', mockData.students.length]].map(([label, val]) => (
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
    </div>
  )
}
