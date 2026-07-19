import { useState } from 'react';
import axios from 'axios';

const Login = ({ setUserSession }) => {
  const [viewState, setViewState] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { name, email, phone_number, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    let endpoint = '/api/auth/login';
    if (viewState === 'signup') endpoint = '/api/auth/register'; 

    try {
      const API_URL = "https://salonweb.onrender.com";

const res = await axios.post(`${API_URL}${endpoint}`, { 
        name, 
        email, 
        phone_number, 
        password 
      });
      
      console.log('Login response:', res.data);
      
      if (viewState === 'login') {
        // Check if token exists in response
        let token = res.data.token;
        let userData = res.data.user || res.data;
        
        // If no token in response, generate one (for mock login)
        if (!token) {
          console.log('No token in response, creating mock token');
          // Create a mock token for development
          token = 'mock_token_' + Date.now();
        }
        
        // Store token in localStorage
        localStorage.setItem('token', token);
        console.log('Token stored in localStorage:', token);
        
        // Store user session
        setUserSession(userData);
        localStorage.setItem('userSession', JSON.stringify(userData));
        
        setMessage('Login successful! Redirecting...');
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
        
      } else {
        // Signup - store token from response
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          console.log('Token stored from signup:', res.data.token);
        }
        setMessage(res.data.message || 'Registration completed successfully!');
        setViewState('login');
        // Clear form
        setFormData({
          name: '',
          email: '',
          phone_number: '',
          password: ''
        });
      }
    } catch (err) {
      console.error('Error:', err.response?.data);
      setError(err.response?.data?.message || 'Server connection failed.');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      fontFamily: '"Playfair Display", Georgia, serif', margin: 0, padding: 0, boxSizing: 'border-box', overflow: 'hidden',
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4)), url("https://images.pexels.com/photos/8479110/pexels-photo-8479110.jpeg")', 
      backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
    }}>
      <div style={{ display: 'flex', width: '100%', height: '100%', padding: '0 8%', position: 'relative', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#fff' }}>
          <h1 style={{ fontSize: '90px', margin: '0 550px 40px 0', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase' }}>VELORA</h1>
          <div style={{ borderLeft: '2px solid #e5c158', paddingLeft: '20px' }}>
            <p style={{ fontSize: '17px', lineHeight: '1.7', fontWeight: '300', maxWidth: '440px', color: '#e0e0e0', margin: 0, fontFamily: 'sans-serif', letterSpacing: '0.4px' }}>
              Where artisanal craft meets high-end sophistication. Elevate your aesthetic in our sanctuary of refined grooming and bespoke beauty.
            </p>
          </div>
        </div>
        
        <div style={{
          width: '100%', maxWidth: '420px',
          background: 'linear-gradient(135deg, rgba(32, 28, 26, 0.72) 0%, rgba(20, 18, 17, 0.82) 100%)',
          backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)',
          border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.65)', display: 'flex', flexDirection: 'column',
          padding: '45px 35px', boxSizing: 'border-box', color: '#ffffff'
        }}>
          <span style={{ color: '#e5c158', fontSize: '11px', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '600', fontFamily: 'sans-serif' }}>Private Access</span>
          <h2 style={{ color: '#fff', fontSize: '32px', margin: '0 0 30px 0', fontWeight: '500' }}>
            {viewState === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>

          {message && <div style={{ padding: '12px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px', backgroundColor: 'rgba(40,167,69,0.15)', color: '#2de067', border: '1px solid rgba(40,167,69,0.25)', textAlign: 'center' }}>{message}</div>}
          {error && <div style={{ padding: '12px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px', backgroundColor: 'rgba(220,53,69,0.15)', color: '#ff6b6b', border: '1px solid rgba(220,53,69,0.25)', textAlign: 'center' }}>{error}</div>}

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {viewState === 'signup' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ color: '#aaa', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', fontFamily: 'sans-serif' }}>Full Name</label>
                <input type="text" name="name" value={name} onChange={onChange} required style={{ padding: '12px', background: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '4px', color: '#fff', outline: 'none', fontSize: '14px', fontFamily: 'sans-serif' }} />
              </div>
            )}

            {viewState === 'signup' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ color: '#aaa', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', fontFamily: 'sans-serif' }}>Phone Number</label>
                <input type="text" name="phone_number" value={phone_number} onChange={onChange} required style={{ padding: '12px', background: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '4px', color: '#fff', outline: 'none', fontSize: '14px' }} />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#aaa', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', fontFamily: 'sans-serif' }}>Email Address</label>
              <input type="email" name="email" value={email} onChange={onChange} required style={{ padding: '12px', background: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '4px', color: '#fff', outline: 'none', fontSize: '14px' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ color: '#aaa', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600', fontFamily: 'sans-serif' }}>Password</label>
                {viewState === 'login' && (
                  <span onClick={() => alert("Forgot Password clicked!")} style={{ color: '#e5c158', fontSize: '10px', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                    FORGOT PASSWORD?
                  </span>
                )}
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input type={showPassword ? "text" : "password"} name="password" value={password} onChange={onChange} required style={{ width: '100%', padding: '12px 36px 12px 12px', background: 'rgba(0, 0, 0, 0.25)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '4px', color: '#fff', outline: 'none', fontSize: '14px' }} />
                <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', cursor: 'pointer', color: '#aaa', fontSize: '16px' }}>
                  {showPassword ? '👁️' : '🙈'}
                </span>
              </div>
            </div>

            <button type="submit" style={{ padding: '14px', backgroundColor: '#e5c158', color: '#1a1817', border: 'none', borderRadius: '25px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', textTransform: 'uppercase' }}>
              {viewState === 'login' ? 'Sign In →' : 'Register Account'}
            </button>
          </form>

          <div style={{ marginTop: '25px', textAlign: 'center' }}>
            <p style={{ color: '#666', fontSize: '10px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Or connect with</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              {['Facebook', 'Instagram', 'Google'].map((social) => (
                <button key={social} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#aaa', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>{social}</button>
              ))}
            </div>
          </div>

          <button onClick={() => { setViewState(viewState === 'login' ? 'signup' : 'login'); setMessage(''); setError(''); }} style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '25px', padding: '12px', marginTop: '24px', cursor: 'pointer', fontSize: '11px' }}>
            {viewState === 'login' ? 'Create An Account' : 'Back To Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;