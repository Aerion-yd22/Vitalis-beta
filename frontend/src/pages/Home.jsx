import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiHeart, FiTrendingUp } from 'react-icons/fi';

const Home = () => {
  return (
    <div className="animate-fade-in content-wrapper">
      <div className="container" style={styles.hero}>
        <div style={styles.badge}>✨ The Next Generation of Health</div>
        <h1 style={styles.title}>Your Intelligent Health Architect</h1>
        <p style={styles.subtitle}>
          Analyze your vitals, habits, and environmental context. Receive hyper-personalized 
          Smart Insights and a tailored plan to transform your wellbeing.
        </p>
        <div style={styles.actions}>
          <Link to="/register" className="btn btn-primary" style={styles.heroBtn}>
            Start Your Journey <FiArrowRight />
          </Link>
          <Link to="/login" className="btn btn-secondary" style={styles.heroBtn}>
            Sign In
          </Link>
        </div>
      </div>

      <div className="container" style={styles.features}>
        <div className="glass-panel" style={styles.featureCard}>
          <div style={{...styles.iconWrapper, background: 'rgba(14, 165, 233, 0.2)'}}>
            <FiHeart color="var(--primary)" size={24} />
          </div>
          <h3 style={{marginTop: '1rem'}}>Holistic Analysis</h3>
          <p style={{color: 'var(--text-muted)'}}>Evaluate comprehensive metrics spanning diet, exercise, clinical history, and allergies.</p>
        </div>
        <div className="glass-panel" style={styles.featureCard}>
          <div style={{...styles.iconWrapper, background: 'rgba(236, 72, 153, 0.2)'}}>
            <FiTrendingUp color="var(--secondary)" size={24} />
          </div>
          <h3 style={{marginTop: '1rem'}}>Data-Driven Tracking</h3>
          <p style={{color: 'var(--text-muted)'}}>Create continuous profiles over time and monitor how your health risk category shifts.</p>
        </div>
        <div className="glass-panel" style={styles.featureCard}>
          <div style={{...styles.iconWrapper, background: 'rgba(16, 185, 129, 0.2)'}}>
            <FiShield color="var(--success)" size={24} />
          </div>
          <h3 style={{marginTop: '1rem'}}>Clinical Safety</h3>
          <p style={{color: 'var(--text-muted)'}}>Automatically flags dangerous interactions and urgent conditions requiring MD consultation.</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '6rem 0rem 4rem',
    maxWidth: '800px',
  },
  badge: {
    padding: '0.4rem 1rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border-color)',
    borderRadius: '100px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '4.5rem',
    marginBottom: '1.5rem',
    letterSpacing: '-1.5px',
  },
  subtitle: {
    fontSize: '1.25rem',
    color: 'var(--text-muted)',
    marginBottom: '3rem',
    lineHeight: '1.8',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
  },
  heroBtn: {
    padding: '1rem 2rem',
    fontSize: '1.1rem',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    paddingTop: '2rem',
  },
  featureCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  iconWrapper: {
    height: '48px',
    width: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

export default Home;
