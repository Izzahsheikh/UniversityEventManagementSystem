import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../App.css'

const user = () => JSON.parse(localStorage.getItem('loggedInUser') || '{}')

const mockData = {
  courses: [
    { code: 'CS101', name: 'Introduction to Programming', teacher: 'Dr. Ahmed', credits: 3, grade: 'A' },
    { code: 'MATH201', name: 'Calculus II', teacher: 'Dr. Fatima', credits: 3, grade: 'B+' },
    { code: 'ENG101', name: 'English Composition', teacher: 'Ms. Sara', credits: 2, grade: 'A-' },
    { code: 'PHY101', name: 'Physics I', teacher: 'Dr. Usman', credits: 4, grade: 'B' },
  ],
  schedule: [
    { day: 'Monday', time: '9:00 AM', course: 'CS101', room: 'Lab 3' },
    { day: 'Monday', time: '11:00 AM', course: 'MATH201', room: 'Room 204' },
    { day: 'Tuesday', time: '10:00 AM', course: 'ENG101', room: 'Room 101' },
    { day: 'Wednesday', time: '9:00 AM', course: 'PHY101', room: 'Lab 1' },
    { day: 'Thursday', time: '11:00 AM', course: 'CS101', room: 'Lab 3' },
    { day: 'Friday', time: '2:00 PM', course: 'MATH201', room: 'Room 204' },
  ],
  attendance: [
    { course: 'CS101', attended: 22, total: 24, percent: 92 },
    { course: 'MATH201', attended: 18, total: 22, percent: 82 },
    { course: 'ENG101', attended: 15, total: 16, percent: 94 },
    { course: 'PHY101', attended: 20, total: 26, percent: 77 },
  ],
  assignments: [
    { course: 'CS101', title: 'Lab 5 - Arrays', due: 'Jun 30, 2025', status: 'Pending' },
    { course: 'MATH201', title: 'Problem Set 8', due: 'Jul 2, 2025', status: 'Submitted' },
    { course: 'PHY101', title: 'Lab Report 4', due: 'Jul 5, 2025', status: 'Pending' },
    { course: 'ENG101', title: 'Essay Draft', due: 'Jun 28, 2025', status: 'Submitted' },
  ],
  announcements: [
    { from: 'Dr. Ahmed', course: 'CS101', msg: 'Mid-term exam scheduled for July 10th. Topics: Chapters 1-6.', time: '2h ago' },
    { from: 'Dr. Fatima', course: 'MATH201', msg: 'Office hours moved to Thursday 3-5pm this week.', time: '1d ago' },
    { from: 'Admin', course: 'University', msg: 'Registration for Fall 2025 opens July 1st.', time: '2d ago' },
  ],
}

const tabs = ['Overview', 'Courses', 'Schedule', 'Attendance', 'Assignments', 'Announcements', 'Profile']

export default function StudentDashboard() {
  const [active, setActive] = useState('Overview')
  const navigate = useNavigate()
  const u = user()

  const logout = () => { localStorage.removeItem('loggedInUser'); navigate('/login') }

  const gpa = 3.6

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar + Main */}
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
              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '18px', color: '#000' }}>{u.fullName?.[0] || 'S'}</span>
            </div>
            <p style={{ color: '#fff', fontWeight: 700, fontFamily: 'Space Grotesk', fontSize: '14px', margin: '0 0 2px' }}>{u.fullName || 'Student'}</p>
            <p style={{ color: '#555', fontSize: '11px', margin: 0, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'Space Grotesk' }}>Student</p>
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

        {/* Main Content */}
        <main style={{ marginLeft: '240px', flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

            {/* Header */}
            <div style={{ marginBottom: '2.5rem' }}>
              <p className='section-eyebrow'>STUDENT PORTAL</p>
              <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, color: '#fff', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', margin: '4px 0 0', letterSpacing: '-0.02em' }}>{active}</h1>
            </div>

            {/* OVERVIEW */}
            {active === 'Overview' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '2rem' }}>
                  {[['GPA', gpa, 'Current semester'],['Courses', mockData.courses.length, 'Enrolled'],['Pending', mockData.assignments.filter(a=>a.status==='Pending').length, 'Assignments'],['Attendance', '86%', 'Average']].map(([label, val, sub]) => (
                    <div key={label} style={{ border: '1px solid #1a1a1a', padding: '1.5rem', backgroundColor: '#0a0a0a' }}>
                      <p style={{ color: '#555', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'Space Grotesk', margin: '0 0 8px' }}>{label}</p>
                      <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '2rem', margin: '0 0 4px' }}>{val}</p>
                      <p style={{ color: '#444', fontSize: '12px', fontFamily: 'Inter', margin: 0 }}>{sub}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ border: '1px solid #1a1a1a', padding: '1.5rem', backgroundColor: '#0a0a0a' }}>
                    <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '14px', margin: '0 0 1rem', letterSpacing: '0.5px' }}>RECENT ANNOUNCEMENTS</p>
                    {mockData.announcements.map((a, i) => (
                      <div key={i} style={{ borderBottom: '1px solid #111', paddingBottom: '12px', marginBottom: '12px' }}>
                        <p style={{ color: '#fff', fontSize: '13px', fontFamily: 'Inter', margin: '0 0 4px' }}>{a.msg}</p>
                        <p style={{ color: '#444', fontSize: '11px', fontFamily: 'Space Grotesk', margin: 0 }}>{a.from} � {a.course} � {a.time}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ border: '1px solid #1a1a1a', padding: '1.5rem', backgroundColor: '#0a0a0a' }}>
                    <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '14px', margin: '0 0 1rem', letterSpacing: '0.5px' }}>UPCOMING ASSIGNMENTS</p>
                    {mockData.assignments.map((a, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #111', padding: '10px 0' }}>
                        <div>
                          <p style={{ color: '#fff', fontSize: '13px', fontFamily: 'Inter', margin: '0 0 2px' }}>{a.title}</p>
                          <p style={{ color: '#444', fontSize: '11px', fontFamily: 'Space Grotesk', margin: 0 }}>{a.course} � Due {a.due}</p>
                        </div>
                        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', fontFamily: 'Space Grotesk', color: a.status === 'Pending' ? '#f59e0b' : '#22c55e', border: a.status === 'Pending' ? '1px solid #78350f' : '1px solid #14532d', padding: '3px 8px', backgroundColor: a.status === 'Pending' ? '#1c1008' : '#071a0e' }}>{a.status.toUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* COURSES */}
            {active === 'Courses' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {mockData.courses.map(c => (
                  <div key={c.code} className='step-card' style={{ backgroundColor: '#0a0a0a' }}>
                    <p style={{ color: '#555', fontSize: '11px', letterSpacing: '2px', fontFamily: 'Space Grotesk', margin: '0 0 8px' }}>{c.code}</p>
                    <h3 style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '1rem', margin: '0 0 8px' }}>{c.name}</h3>
                    <p style={{ color: '#555', fontSize: '13px', fontFamily: 'Inter', margin: '0 0 1rem' }}>{c.teacher}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#666', fontSize: '12px', fontFamily: 'Space Grotesk' }}>{c.credits} Credits</span>
                      <span style={{ color: '#fff', fontWeight: 700, fontFamily: 'Space Grotesk', fontSize: '14px' }}>{c.grade}</span>
                    </div>
                    <div className='step-card__hover-line' />
                  </div>
                ))}
              </div>
            )}

            {/* SCHEDULE */}
            {active === 'Schedule' && (
              <div style={{ border: '1px solid #1a1a1a', backgroundColor: '#0a0a0a' }}>
                <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #1a1a1a', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
                  {['DAY','TIME','COURSE','ROOM'].map(h => <p key={h} style={{ color: '#444', fontSize: '11px', letterSpacing: '1.5px', fontFamily: 'Space Grotesk', margin: 0 }}>{h}</p>)}
                </div>
                {mockData.schedule.map((s, i) => (
                  <div key={i} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #111', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
                    <p style={{ color: '#fff', fontSize: '13px', fontFamily: 'Inter', margin: 0 }}>{s.day}</p>
                    <p style={{ color: '#888', fontSize: '13px', fontFamily: 'Inter', margin: 0 }}>{s.time}</p>
                    <p style={{ color: '#fff', fontSize: '13px', fontFamily: 'Space Grotesk', fontWeight: 700, margin: 0 }}>{s.course}</p>
                    <p style={{ color: '#555', fontSize: '13px', fontFamily: 'Inter', margin: 0 }}>{s.room}</p>
                  </div>
                ))}
              </div>
            )}

            {/* ATTENDANCE */}
            {active === 'Attendance' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {mockData.attendance.map(a => (
                  <div key={a.course} style={{ border: '1px solid #1a1a1a', padding: '1.5rem', backgroundColor: '#0a0a0a' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, margin: 0 }}>{a.course}</p>
                      <p style={{ color: a.percent >= 90 ? '#22c55e' : a.percent >= 75 ? '#f59e0b' : '#ef4444', fontFamily: 'Space Grotesk', fontWeight: 800, margin: 0 }}>{a.percent}%</p>
                    </div>
                    <div style={{ backgroundColor: '#111', height: '4px', borderRadius: '2px' }}>
                      <div style={{ height: '100%', backgroundColor: a.percent >= 90 ? '#22c55e' : a.percent >= 75 ? '#f59e0b' : '#ef4444', width: a.percent + '%', transition: 'width 0.5s' }} />
                    </div>
                    <p style={{ color: '#444', fontSize: '12px', fontFamily: 'Inter', margin: '8px 0 0' }}>{a.attended} of {a.total} classes attended</p>
                  </div>
                ))}
              </div>
            )}

            {/* ASSIGNMENTS */}
            {active === 'Assignments' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {mockData.assignments.map((a, i) => (
                  <div key={i} style={{ border: '1px solid #1a1a1a', padding: '1.5rem', backgroundColor: '#0a0a0a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, margin: '0 0 4px' }}>{a.title}</p>
                      <p style={{ color: '#555', fontSize: '12px', fontFamily: 'Inter', margin: 0 }}>{a.course} � Due: {a.due}</p>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', fontFamily: 'Space Grotesk', color: a.status === 'Pending' ? '#f59e0b' : '#22c55e', border: a.status === 'Pending' ? '1px solid #78350f' : '1px solid #14532d', padding: '5px 12px', backgroundColor: a.status === 'Pending' ? '#1c1008' : '#071a0e' }}>{a.status.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            )}

            {/* ANNOUNCEMENTS */}
            {active === 'Announcements' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {mockData.announcements.map((a, i) => (
                  <div key={i} style={{ border: '1px solid #1a1a1a', padding: '1.5rem', backgroundColor: '#0a0a0a' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <p style={{ color: '#fff', fontFamily: 'Space Grotesk', fontWeight: 700, margin: 0 }}>{a.from} <span style={{ color: '#444', fontWeight: 400 }}>� {a.course}</span></p>
                      <p style={{ color: '#444', fontSize: '12px', fontFamily: 'Inter', margin: 0 }}>{a.time}</p>
                    </div>
                    <p style={{ color: '#888', fontSize: '14px', fontFamily: 'Inter', margin: 0, lineHeight: 1.7 }}>{a.msg}</p>
                  </div>
                ))}
              </div>
            )}

            {/* PROFILE */}
            {active === 'Profile' && (
              <div style={{ border: '1px solid #1a1a1a', padding: '2.5rem', backgroundColor: '#0a0a0a', maxWidth: '500px' }}>
                <div style={{ width: '72px', height: '72px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '28px', color: '#000' }}>{u.fullName?.[0] || 'S'}</span>
                </div>
                {[['Full Name', u.fullName],['Email', u.email],['Role', 'Student'],['Member Since', u.joinedAt ? new Date(u.joinedAt).toLocaleDateString() : 'N/A'],['GPA', gpa],['Enrolled Courses', mockData.courses.length]].map(([label, val]) => (
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
