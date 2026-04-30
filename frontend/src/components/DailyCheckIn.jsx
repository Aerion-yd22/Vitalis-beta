import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { FiCheck, FiX, FiActivity, FiZap, FiSmile } from 'react-icons/fi';

const DailyCheckIn = () => {
  const [log, setLog] = useState({
    diet_adherence: 'yes',
    workout_done: false,
    energy_level: 'medium'
  });
  const [streak, setStreak] = useState({ current_streak: 0, longest_streak: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchTodayLog();
  }, []);

  const fetchTodayLog = async () => {
    try {
      const res = await apiClient.get('/logs/status');
      if (res.data.log) {
        setLog(res.data.log);
        setSubmitted(true);
      }
      if (res.data.streak) {
        setStreak(res.data.streak);
      }
    } catch (err) {
      console.error("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedLog) => {
    const finalLog = { ...log, ...updatedLog };
    setLog(finalLog);
    setSaving(true);
    try {
      await apiClient.post('/logs/daily', finalLog);
      setSubmitted(true);
      // Refresh streak after logging
      const streakRes = await apiClient.get('/logs/streak');
      if (streakRes.data.streak) setStreak(streakRes.data.streak);
    } catch (err) {
      console.error("Failed to save log");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className="glass-panel animate-fade-in" style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h3 style={styles.title}><FiSmile /> {submitted ? "Daily Log: Completed" : "Today's Check-in: Pending"}</h3>
          <div style={styles.streakDisplay}>
            <span title="Current Streak">🔥 {streak.current_streak} days</span>
            <span style={{ opacity: 0.5, margin: '0 0.5rem' }}>|</span>
            <span title="Longest Streak">🏆 {streak.longest_streak} days</span>
          </div>
        </div>
        {submitted ? (
          <span style={styles.doneBadge}><FiCheck /> Logged Today</span>
        ) : (
          <span style={{ fontSize: '0.8rem', color: 'var(--warning)', fontWeight: 'bold' }}>Action Required</span>
        )}
      </div>

      {!submitted && (
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Welcome back! Take a second to log your activity. It helps us personalize your coaching hub.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Diet Adherence */}
        <div style={styles.section}>
          <p style={styles.label}>Followed Diet?</p>
          <div style={styles.btnGroup}>
            {[
              { val: 'yes', label: 'Yes', color: 'var(--success)' },
              { val: 'partial', label: 'Partially', color: 'var(--warning)' },
              { val: 'no', label: 'No', color: 'var(--danger)' }
            ].map(opt => (
              <button
                key={opt.val}
                onClick={() => handleSave({ diet_adherence: opt.val })}
                style={{
                  ...styles.miniBtn,
                  background: log.diet_adherence === opt.val ? opt.color : 'rgba(255,255,255,0.05)',
                  color: log.diet_adherence === opt.val ? 'white' : 'var(--text-muted)'
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Workout */}
        <div style={styles.section}>
          <p style={styles.label}>Workout Done?</p>
          <div style={styles.btnGroup}>
            <button
              onClick={() => handleSave({ workout_done: true })}
              style={{
                ...styles.miniBtn,
                background: log.workout_done ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                color: log.workout_done ? 'white' : 'var(--text-muted)'
              }}
            >
              <FiCheck /> Yes
            </button>
            <button
              onClick={() => handleSave({ workout_done: false })}
              style={{
                ...styles.miniBtn,
                background: !log.workout_done ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                color: !log.workout_done ? 'white' : 'var(--text-muted)'
              }}
            >
              <FiX /> No
            </button>
          </div>
        </div>

        {/* Energy Level */}
        <div style={styles.section}>
          <p style={styles.label}>Energy Level?</p>
          <div style={styles.btnGroup}>
            {[
              { val: 'high', icon: <FiZap /> },
              { val: 'medium', icon: <FiActivity /> },
              { val: 'low', icon: <FiActivity style={{ opacity: 0.5 }} /> }
            ].map(opt => (
              <button
                key={opt.val}
                onClick={() => handleSave({ energy_level: opt.val })}
                style={{
                  ...styles.miniBtn,
                  background: log.energy_level === opt.val ? 'var(--secondary)' : 'rgba(255,255,255,0.05)',
                  color: log.energy_level === opt.val ? 'white' : 'var(--text-muted)',
                  fontSize: '1.2rem'
                }}
              >
                {opt.icon}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginTop: '2rem',
    padding: '1.5rem',
    borderLeft: '4px solid var(--primary)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.2rem',
    margin: 0
  },
  streakDisplay: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.9rem',
    fontWeight: '700',
    background: 'rgba(255,255,255,0.05)',
    padding: '0.4rem 0.8rem',
    borderRadius: '12px',
    color: 'var(--primary)'
  },
  doneBadge: {
    fontSize: '0.8rem',
    background: 'rgba(34, 197, 94, 0.1)',
    color: 'var(--success)',
    padding: '0.2rem 0.8rem',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    fontWeight: 'bold'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem'
  },
  label: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    margin: 0
  },
  btnGroup: {
    display: 'flex',
    gap: '0.5rem'
  },
  miniBtn: {
    flex: 1,
    padding: '0.6rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '600',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.3rem'
  }
};

export default DailyCheckIn;
