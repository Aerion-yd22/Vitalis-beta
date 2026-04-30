import React, { useState } from 'react';
import { FiWatch, FiActivity, FiCompass, FiInfo, FiSmartphone } from 'react-icons/fi';
import { SiApple, SiFitbit, SiGarmin } from 'react-icons/si';

const WearableIntegration = () => {
  const [showMessage, setShowMessage] = useState(false);

  const devices = [
    { name: 'Apple Watch', icon: <SiApple />, badge: 'PRO', color: '#ff3b30' },
    { name: 'Fitbit', icon: <SiFitbit />, badge: 'PRO', color: '#00b0b9' },
    { name: 'Garmin', icon: <SiGarmin />, badge: 'PRO', color: '#000000' },
  ];

  const handleClick = () => {
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  return (
    <div className="glass-panel" style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={styles.titleIcon}><FiSmartphone /></div>
          <div>
            <h2 style={styles.title}>Wearable Integration</h2>
            <p style={styles.subtitle}>Connect your smart devices (Pro Feature)</p>
          </div>
        </div>
        <div style={styles.infoBadge}>
          <FiInfo /> Vision Feature
        </div>
      </div>

      <p style={styles.description}>
        Auto-sync your vitals directly from your wearable devices for real-time health monitoring and automated insights.
      </p>

      <div style={styles.deviceGrid}>
        {devices.map((device, index) => (
          <div key={index} style={styles.deviceCard} onClick={handleClick}>
            <div style={styles.badge}>{device.badge}</div>
            <div style={{ ...styles.iconWrapper, color: device.color }}>
              {device.icon}
            </div>
            <span style={styles.deviceName}>{device.name}</span>
            <div style={styles.cardOverlay}></div>
          </div>
        ))}
      </div>

      {showMessage && (
        <div style={styles.toast}>
          <FiInfo /> Coming Soon — Wearable integration is part of our future vision.
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    marginTop: '3rem',
    padding: '2.5rem',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  titleIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(59, 130, 246, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--primary)',
    fontSize: '1.2rem',
  },
  title: {
    fontSize: '1.5rem',
    margin: 0,
    color: 'var(--text-white)',
  },
  subtitle: {
    fontSize: '0.9rem',
    margin: '0.2rem 0 0 0',
    color: 'var(--primary)',
    fontWeight: '600',
    opacity: 0.8,
  },
  infoBadge: {
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  description: {
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    maxWidth: '600px',
    marginBottom: '2.5rem',
  },
  deviceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1.5rem',
  },
  deviceCard: {
    position: 'relative',
    padding: '2rem 1rem',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
  },
  iconWrapper: {
    fontSize: '2.5rem',
    transition: 'transform 0.3s ease',
  },
  deviceName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--text-white)',
  },
  badge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    padding: '2px 8px',
    borderRadius: '6px',
    background: 'var(--primary)',
    color: 'white',
    fontSize: '0.65rem',
    fontWeight: '800',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)',
  },
  toast: {
    position: 'absolute',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(15, 23, 42, 0.9)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    padding: '0.8rem 1.5rem',
    borderRadius: '12px',
    border: '1px solid var(--primary)',
    fontSize: '0.9rem',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    animation: 'slideUp 0.3s ease-out',
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  }
};

export default WearableIntegration;
