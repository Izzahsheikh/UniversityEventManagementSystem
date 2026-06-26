import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) { setError('Invalid email or password.'); return; }
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    alert('Welcome back, ' + user.fullName + '!');
    navigate('/');
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ backgroundColor: '#000', padding: '0 2rem', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: '#fff' }}>EM</div>
          <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>Event Management</span>
        </div>
        <a href='/signup' style={{ backgroundColor: '#fff', color: '#000', padding: '6px 16px', fontSize: '12px', fontWeight: '700', textDecoration: 'none', textTransform: 'uppercase' }}>GET STARTED</a>
      </nav>
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 56px)' }}>
        <div style={{ flex: '1', backgroundColor: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem 5rem', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <h1 style={{ color: '#fff', fontSize: '3rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem', position: 'relative' }}>Your University.<br />Your Events.</h1>
          <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.7', maxWidth: '360px', position: 'relative' }}>Sign in to browse events, manage registrations, and stay connected with everything happening on campus.</p>
        </div>
        <div style={{ width: '480px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem 3.5rem', backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
          <div style={{ backgroundColor: '#fff', padding: '2.5rem', border: '1px solid #e5e5e5' }}>
            <p style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#999', marginBottom: '8px', fontWeight: '600' }}>WELCOME BACK</p>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#000', marginBottom: '0.4rem' }}>Sign In</h2>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '2rem' }}>No account? <a href='/signup' style={{ color: '#000', fontWeight: '700', textDecoration: 'none' }}>Create one</a></p>
            {error && <div style={{ backgroundColor: '#fff0f0', border: '1px solid #ffcccc', color: '#cc0000', padding: '10px 14px', fontSize: '12px', marginBottom: '1.2rem' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: '#333', marginBottom: '6px' }}>Email</label>
                <input type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='you@university.edu' required style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              </div>
              <div style={{ marginBottom: '1.8rem' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: '#333', marginBottom: '6px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder='••••••••' required style={{ width: '100%', padding: '10px 48px 10px 14px', border: '1px solid #ddd', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                  <button type='button' onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '11px', fontFamily: 'inherit' }}>{showPassword ? 'HIDE' : 'SHOW'}</button>
                </div>
              </div>
              <button type='submit' style={{ width: '100%', padding: '12px', backgroundColor: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'inherit' }}>SIGN IN ?</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
