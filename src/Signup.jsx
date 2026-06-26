import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './App.css'

export default function Signup() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', role: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!form.role) { setError('Please select your role.'); return }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    const existing = JSON.parse(localStorage.getItem('users') || '[]')
    if (existing.find(u => u.email === form.email)) { setError('Email already registered.'); return }
    const newUser = { fullName: form.fullName, email: form.email, password: form.password, role: form.role, joinedAt: new Date().toISOString() }
    existing.push(newUser)
    localStorage.setItem('users', JSON.stringify(existing))
    localStorage.setItem('loggedInUser', JSON.stringify(newUser))
    if (form.role === 'student') navigate('/student/dashboard')
    else if (form.role === 'organizer') navigate('/organizer/dashboard')
    else if (form.role === 'admin') navigate('/admin/dashboard')
    else navigate('/')
  }

  const roles = [
    { value: 'student', icon: '?', label: 'Student', desc: 'Browse & register for events' },
    { value: 'organizer', icon: '?', label: 'Organizer', desc: 'Create & manage events' },
    { value: 'admin', icon: '?', label: 'Admin', desc: 'Full system control' },
  ]

  return (
    <div style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', minHeight: '100vh', backgroundColor: '#000', display: 'flex', flexDirection: 'column' }}>
      <nav className='navbar navbar--scrolled' style={{ position: 'relative' }}>
        <div className='navbar__inner'>
          <Link to='/' style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div className='navbar__logo-box'><span className='navbar__logo-letters'>EM</span></div>
            <span className='navbar__logo-name'>EventManage</span>
          </Link>
          <div className='navbar__links'>
            <Link to='/login' className='navbar__link'>Sign In</Link>
            <Link to='/signup' className='navbar__cta'>GET STARTED</Link>
          </div>
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', minHeight: 'calc(100vh - 68px)' }}>
        <div style={{ flex: 1, backgroundColor: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem 5rem', position: 'relative', overflow: 'hidden' }}>
          <div className='hero__grid-bg' />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p className='section-eyebrow' style={{ marginBottom: '1rem' }}>JOIN TODAY</p>
            <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#fff', lineHeight: 1.1, marginBottom: '1.5rem' }}>Your University.<br />Your Events.</h1>
            <p style={{ color: '#555', fontSize: '15px', lineHeight: 1.8, maxWidth: '380px', fontFamily: 'Inter', marginBottom: '2.5rem' }}>Join thousands of students already using the platform to stay connected, participate in events, and shape university culture.</p>
            {roles.map(r => (
              <div key={r.value} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', border: '1px solid #1a1a1a', backgroundColor: '#0a0a0a', marginBottom: '10px' }}>
                <span style={{ color: '#fff', fontSize: '10px' }}>{r.icon}</span>
                <div>
                  <div style={{ color: '#fff', fontSize: '13px', fontWeight: 700, fontFamily: 'Space Grotesk' }}>{r.label}</div>
                  <div style={{ color: '#555', fontSize: '12px', marginTop: '2px', fontFamily: 'Inter' }}>{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ width: '520px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 3.5rem', backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px', overflowY: 'auto' }}>
          <div style={{ backgroundColor: '#fff', padding: '2.5rem', border: '1px solid #e5e5e5' }}>
            <p style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#999', marginBottom: '8px', fontWeight: 700, fontFamily: 'Space Grotesk' }}>GET STARTED</p>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#000', marginBottom: '0.4rem', fontFamily: 'Space Grotesk' }}>Create Account</h2>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '2rem', fontFamily: 'Inter' }}>Already have an account? <Link to='/login' style={{ color: '#000', fontWeight: 700, textDecoration: 'none' }}>Sign in ?</Link></p>
            {error && <div style={{ backgroundColor: '#fff0f0', border: '1px solid #ffcccc', color: '#cc0000', padding: '10px 14px', fontSize: '12px', marginBottom: '1.2rem', fontFamily: 'Inter' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#333', marginBottom: '6px', fontFamily: 'Space Grotesk' }}>Full Name</label>
                <input type='text' value={form.fullName} onChange={handleChange('fullName')} placeholder='Jane Smith' required style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter', backgroundColor: '#fafafa', color: '#000' }} onFocus={e => e.target.style.borderColor='#000'} onBlur={e => e.target.style.borderColor='#ddd'} />
              </div>
              <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#333', marginBottom: '6px', fontFamily: 'Space Grotesk' }}>Email Address</label>
                <input type='email' value={form.email} onChange={handleChange('email')} placeholder='you@university.edu' required style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter', backgroundColor: '#fafafa', color: '#000' }} onFocus={e => e.target.style.borderColor='#000'} onBlur={e => e.target.style.borderColor='#ddd'} />
              </div>
              <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#333', marginBottom: '8px', fontFamily: 'Space Grotesk' }}>I am a...</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {roles.map(r => (
                    <button key={r.value} type='button' onClick={() => setForm({ ...form, role: r.value })} style={{ flex: 1, padding: '12px 8px', border: form.role === r.value ? '1px solid #000' : '1px solid #ddd', backgroundColor: form.role === r.value ? '#000' : '#fafafa', color: form.role === r.value ? '#fff' : '#888', cursor: 'pointer', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'Space Grotesk', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '8px' }}>{r.icon}</span>{r.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#333', marginBottom: '6px', fontFamily: 'Space Grotesk' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange('password')} placeholder='Min. 6 characters' required style={{ width: '100%', padding: '11px 50px 11px 14px', border: '1px solid #ddd', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter', backgroundColor: '#fafafa', color: '#000' }} onFocus={e => e.target.style.borderColor='#000'} onBlur={e => e.target.style.borderColor='#ddd'} />
                  <button type='button' onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '11px', fontFamily: 'Space Grotesk', fontWeight: 700 }}>{showPassword ? 'HIDE' : 'SHOW'}</button>
                </div>
              </div>
              <div style={{ marginBottom: '1.8rem' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#333', marginBottom: '6px', fontFamily: 'Space Grotesk' }}>Confirm Password</label>
                <input type='password' value={form.confirmPassword} onChange={handleChange('confirmPassword')} placeholder='Re-enter password' required style={{ width: '100%', padding: '11px 14px', border: form.confirmPassword && form.password !== form.confirmPassword ? '1px solid #e00' : '1px solid #ddd', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter', backgroundColor: '#fafafa', color: '#000' }} />
                {form.confirmPassword && form.password !== form.confirmPassword && <p style={{ color: '#e00', fontSize: '11px', marginTop: '4px', fontFamily: 'Inter' }}>Passwords do not match</p>}
              </div>
              <button type='submit' style={{ width: '100%', padding: '13px', backgroundColor: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'Space Grotesk' }}>CREATE ACCOUNT ?</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
