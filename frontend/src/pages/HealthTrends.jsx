import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiTrendingUp, FiActivity, FiTarget } from 'react-icons/fi';

const HealthTrends = () => {
  return (
    <div className="container animate-fade-in content-wrapper min-h-screen pb-24">
      <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        <FiChevronLeft /> Back to Dashboard
      </Link>

      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Health Trends</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
          Visualize your progress and biometric changes over time.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiActivity /> Weight Trend (30 Days)
          </h3>
          <div style={styles.chartPlaceholder}>
            {/* Mock Chart Area */}
            <div style={{ display: 'flex', alignItems: 'flex-end', height: '150px', gap: '8px' }}>
              {[40, 45, 42, 48, 55, 52, 60].map((h, i) => (
                <div key={i} style={{ flex: 1, background: 'var(--primary)', height: `${h}%`, borderRadius: '4px 4px 0 0', opacity: 0.7 }}></div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiTarget /> BMI Stability
          </h3>
          <div style={styles.chartPlaceholder}>
            <div style={{ display: 'flex', alignItems: 'flex-end', height: '150px', gap: '8px' }}>
              {[30, 32, 31, 30, 31, 32, 31].map((h, i) => (
                <div key={i} style={{ flex: 1, background: 'var(--success)', height: `${h}%`, borderRadius: '4px 4px 0 0', opacity: 0.7 }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  chartPlaceholder: {
    height: '200px',
    background: 'rgba(255,255,255,0.01)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px dashed rgba(255,255,255,0.1)',
    padding: '1rem'
  }
};

export default HealthTrends;
