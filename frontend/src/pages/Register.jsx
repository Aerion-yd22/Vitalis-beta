import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FiUser, FiMail, FiLock, FiAlertCircle, FiActivity, FiArrowRight } from 'react-icons/fi';

const Register = () => {
  const { register: authRegister } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      const result = await authRegister(form.name, form.email, form.password);
      
      if (result.success) {
        setSuccess(true);
        alert("User registered successfully! Redirecting to login...");
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }

    setIsLoading(false);
  };

  return (
    <div className="container animate-fade-in" style={styles.wrapper}>
      <div className="glass-panel" style={styles.card}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Create Account</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Start your personalized health journey
        </p>

        {error && (
          <div style={styles.errorAlert}>
            <FiAlertCircle /> {error}
          </div>
        )}
        {success && (
          <div style={{ ...styles.errorAlert, background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#6ee7b7', flexDirection: 'column', textAlign: 'center', gap: '1rem' }}>
            <div><FiActivity size={32} /></div>
            <div style={{ fontWeight: '700', fontSize: '1.2rem' }}>Account Created Successfully!</div>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>Logging you in automatically...</p>
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              Go to Dashboard <FiArrowRight />
            </button>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <div style={styles.inputWrapper}>
              <FiUser style={styles.inputIcon} />
              <input
                type="text"
                name="name"
                className="input-control"
                style={{ paddingLeft: '2.5rem' }}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <div style={styles.inputWrapper}>
              <FiMail style={styles.inputIcon} />
              <input
                type="email"
                name="email"
                className="input-control"
                style={{ paddingLeft: '2.5rem' }}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div style={styles.inputWrapper}>
              <FiLock style={styles.inputIcon} />
              <input
                type="password"
                name="password"
                className="input-control"
                style={{ paddingLeft: '2.5rem' }}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Phone Number (Optional)</label>
            <div style={styles.inputWrapper}>
              <FiActivity style={styles.inputIcon} />
              <input
                type="text"
                name="phone"
                className="input-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="+1234567890"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        )}

        <p style={styles.footerText}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 80px)',
    padding: '2rem 1rem',
  },
  card: {
    width: '100%',
    maxWidth: '450px',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    color: 'var(--text-muted)',
  },
  submitBtn: {
    width: '100%',
    marginTop: '1rem',
  },
  errorAlert: {
    padding: '1rem',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    color: '#fca5a5',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  footerText: {
    textAlign: 'center',
    marginTop: '2rem',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
  }
};

export default Register;
