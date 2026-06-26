import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', role: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.role) { setError('Please select a role.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (existingUsers.find(u => u.email === form.email)) { setError('Email already registered.'); return; }
    const newUser = { fullName: form.fullName, email: form.email, password: form.password, role: form.role };
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    localStorage.setItem('loggedInUser', JSON.stringify(newUser));
    alert('Account created! Welcome, ' + form.fullName);
    navigate('/');
  };

  const roles = [
    { value: 'student', label: 'Student', icon: 'S' },
    { value: 'organizer', label: 'Organizer', icon: 'O' },
    { value: 'admin', label: 'Admin', icon: 'A' },
  ];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ backgroundColor: '#000', padding: '0 2rem', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', color: '#fff' }}>EM</div>
          <span style={{ color: '#fff', fontWeight: '600', fontSize: '14px' }}>Event Management</span>
        </div>
        <a href='/login' style={{ backgroundColor: '#fff', color: '#000', padding: '6px 16px', fontSize: '12px', fontWeight: '700', textDecoration: 'none', textTransform: 'uppercase' }}>SIGN IN</a>
      </nav>
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 56px)' }}>
        <div style={{ flex: '1', backgroundColor: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem 5rem', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <p style={{ fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#555', marginBottom: '1rem', position: 'relative', fontWeight: '600' }}>JOIN TODAY</p>
          <h1 style={{ color: '#fff', fontSize: '3rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem', position: 'relative' }}>Your University.<br />Your Events.</h1>
          <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.8', maxWidth: '360px', position: 'relative' }}>Join thousands of students already using the platform to stay connected and shape university culture.</p>
        </div>
        <div style={{ width: '520px', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 3.5rem', backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px', overflowY: 'auto' }}>
          <div style={{ backgroundColor: '#fff', padding: '2.5rem', border: '1px solid #e5e5e5' }}>
            <p style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#999', marginBottom: '8px', fontWeight: '600' }}>GET STARTED</p>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#000', marginBottom: '0.4rem' }}>Create Account</h2>
            <p style={{ fontSize: '13px', color: '#888', marginBottom: '2rem' }}>Already have an account? <a href='/login' style={{ color: '#000', fontWeight: '700', textDecoration: 'none' }}>Sign in</a></p>
            {error && <div style={{ backgroundColor: '#fff0f0', border: '1px solid #ffcccc', color: '#cc0000', padding: '10px 14px', fontSize: '12px', marginBottom: '1.2rem' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: '#333', marginBottom: '6px' }}>Full Name</label>
                <input type='text' value={form.fullName} onChange={handleChange('fullName')} placeholder='Jane Smith' required style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              </div>
              <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: '#333', marginBottom: '6px' }}>Email Address</label>
                <input type='email' value={form.email} onChange={handleChange('email')} placeholder='you@university.edu' required style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              </div>
              <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: '#333', marginBottom: '8px' }}>Select Your Role</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {roles.map(role => (
                    <button key={role.value} type='button' onClick={() => setForm({ ...form, role: role.value })} style={{ flex: 1, padding: '10px 6px', border: form.role === role.value ? '1px solid #000' : '1px solid #ddd', backgroundColor: form.role === role.value ? '#000' : '#fafafa', color: form.role === role.value ? '#fff' : '#888', cursor: 'pointer', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', fontFamily: 'inherit' }}>{role.label}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: '#333', marginBottom: '6px' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange('password')} placeholder='Min. 6 characters' required style={{ width: '100%', padding: '10px 48px 10px 14px', border: '1px solid #ddd', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                  <button type='button' onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '11px', fontFamily: 'inherit' }}>{showPassword ? 'HIDE' : 'SHOW'}</button>
                </div>
              </div>
              <div style={{ marginBottom: '1.8rem' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', color: '#333', marginBottom: '6px' }}>Confirm Password</label>
                <input type='password' value={form.confirmPassword} onChange={handleChange('confirmPassword')} placeholder='Re-enter password' required style={{ width: '100%', padding: '10px 14px', border: form.confirmPassword && form.password !== form.confirmPassword ? '1px solid #e00' : '1px solid #ddd', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
                {form.confirmPassword && form.password !== form.confirmPassword && <p style={{ color: '#e00', fontSize: '11px', marginTop: '4px' }}>Passwords do not match</p>}
              </div>
              <button type='submit' style={{ width: '100%', padding: '12px', backgroundColor: '#000', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'inherit' }}>CREATE ACCOUNT ?</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
