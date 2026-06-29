import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './App.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => u.email === email && u.password === password)
    if (!user) { setError('Invalid email or password.'); return }
    localStorage.setItem('loggedInUser', JSON.stringify(user))
    if (user.role === 'student') navigate('/student/dashboard')
    else if (user.role === 'organizer') navigate('/organizer/dashboard')
    else if (user.role === 'admin') navigate('/admin/dashboard')
    else if (user.role === 'teacher') navigate('/teacher/dashboard')
    else navigate('/')
  }

  return (
    <div style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', minHeight: '100vh', backgroundColor: '#000', display: 'flex', flexDirection: 'column' }}>
      <nav className='navbar navbar--scrolled' style={{ position: 'relative' }}>
        <div className='navbar__inner'>
          <Link to='/' style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div className='navbar__logo-box'><span className='navbar__logo-letters'>EM</span></div>
            <span className='navbar__logo-name'>EventManage</span>
          </Link>
          <div className='navbar__links'>
            <Link to='/signup' className='navbar__link'>Create Account</Link>
            <Link to='/login' className='navbar__cta'>SIGN IN</Link>
          </div>
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', minHeight: 'calc(100vh - 68px)' }}>
        <div style={{ flex: 1, backgroundColor: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem 5rem', position: 'relative', overflow: 'hidden' }}>
          <div className='hero__grid-bg' />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p className='section-eyebrow' style={{ marginBottom: '1rem' }}>WELCOME BACK</p>
            <h1 style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#fff', lineHeight: 1.1, marginBottom: '1.5rem' }}>Your University.<br />Your Events.</h1>
            <p style={{ color: '#555', fontSize: '15px', lineHeight: 1.8, maxWidth: '380px', fontFamily: 'Inter', marginBottom: '2.5rem' }}>Sign in to access your personalized dashboard based on your role in the university event ecosystem.</p>
            {[['🎓','Student','Browse & register for university events'],['📋','Organizer','Create, manage & update events'],['⚙️','Admin','Full system control & reporting']].map(([icon, role, desc]) => (
              <div key={role} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', border: '1px solid #1a1a1a', backgroundColor: '#0a0a0a', marginBottom: '10px' }}>
                <span style={{ color: '#fff', fontSize: '18px' }}>{icon}</span>
                <div>
                  <div style={{ color: '#fff', fontSize: '13px', fontWeight: 700, fontFamily: 'Space Grotesk' }}>{role}</div>
                  <div style={{ color: '#555', fontSize: '12px', marginTop: '2px', fontFamily: 'Inter' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ width: '500px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem 3.5rem', backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
          <div style={{ backgroundColor: '#fff', padding: '2.5rem', border: '1px solid #e5e5e5' }}>
            <p style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#999', marginBottom: '8px', fontWeight: 700, fontFamily: 'Space Grotesk' }}>SIGN IN</p>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#000', marginBottom: '0.4rem', fontFamily: 'Space Grotesk' }}>Welcome Back</h2>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '2rem', fontFamily: 'Inter' }}>No account? <Link to='/signup' style={{ color: '#000', fontWeight: 700, textDecoration: 'none' }}>Create one</Link></p>
            {error && <div style={{ backgroundColor: '#fff0f0', border: '1px solid #ffcccc', color: '#cc0000', padding: '10px 14px', fontSize: '12px', marginBottom: '1.2rem', fontFamily: 'Inter' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#333', marginBottom: '6px', fontFamily: 'Space Grotesk' }}>Email Address</label>
                <input type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='you@university.edu' required style={{ width: '100%', padding: '11px 14px', border: '1px solid #ddd', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter', backgroundColor: '#fafafa', color: '#000' }} onFocus={e => e.target.style.borderColor='#000'} onBlur={e => e.target.style.borderColor='#ddd'} />
              </div>
              <div style={{ marginBottom: '1.8rem' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#333', marginBottom: '6px', fontFamily: 'Space Grotesk' }}>Password</label>
                <div style={{ position: 'relative' }}>
<<<<<<< HEAD
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder='��������' required style={{ width: '100%', padding: '11px 50px 11px 14px', border: '1px solid #ddd', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter', backgroundColor: '#fafafa', color: '#000' }} onFocus={e => e.target.style.borderColor='#000'} onBlur={e => e.target.style.borderColor='#ddd'} />
=======
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder='••••••••' required style={{ width: '100%', padding: '11px 50px 11px 14px', border: '1px solid #ddd', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter', backgroundColor: '#fafafa', color: '#000' }} onFocus={e => e.target.style.borderColor='#000'} onBlur={e => e.target.style.borderColor='#ddd'} />
>>>>>>> main
                  <button type='button' onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '11px', fontFamily: 'Space Grotesk', fontWeight: 700 }}>{showPassword ? 'HIDE' : 'SHOW'}</button>
                </div>
              </div>
              <button type='submit' style={{ width: '100%', padding: '13px', backgroundColor: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'Space Grotesk' }}>SIGN IN</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}