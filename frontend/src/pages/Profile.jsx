import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { 
  FiUser, FiMail, FiActivity, FiZap, FiMoon, 
  FiEdit3, FiSave, FiClock, FiShield
} from 'react-icons/fi';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/user/profile');
        if (response.data.profile) {
          setProfile(response.data.profile);
          setFormData(response.data.profile);
          
          const logRes = await apiClient.get('/recommendations/latest');
          if (logRes.data.data) {
            setLastUpdated(new Date(logRes.data.data.created_at).toLocaleString());
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await apiClient.post('/user/profile', formData);
      setProfile(formData);
      setEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading profile...</div>;

  return (
    <div className="container content-wrapper animate-fade-in" style={{ maxWidth: '900px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>My Profile</h1>
        <button 
          onClick={() => editing ? handleSave() : setEditing(true)} 
          className="btn btn-primary"
        >
          {editing ? <><FiSave /> Save Vitals</> : <><FiEdit3 /> Update Vitals</>}
        </button>
      </div>

      <div style={styles.profileGrid}>
        {/* User Info Card */}
        <div className="glass-panel" style={styles.card}>
          <h3 style={styles.cardTitle}><FiUser /> User Info</h3>
          <div style={styles.infoRow}>
            <FiUser color="var(--primary)" />
            <div>
              <div style={styles.label}>Full Name</div>
              <div style={styles.value}>{profile.full_name}</div>
            </div>
          </div>
          <div style={styles.infoRow}>
            <FiMail color="var(--primary)" />
            <div>
              <div style={styles.label}>Email Address</div>
              <div style={styles.value}>{profile.email}</div>
            </div>
          </div>
        </div>

        {/* Health Profile */}
        <div className="glass-panel" style={styles.card}>
          <h3 style={styles.cardTitle}><FiActivity /> Health Profile</h3>
          {editing ? (
            <div style={styles.formGrid}>
              <div className="input-group">
                <label>Age</label>
                <input type="number" name="age" className="input-control" value={formData.age || ''} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Gender</label>
                <select name="gender" className="input-control" value={formData.gender || ''} onChange={handleChange}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="input-group">
                <label>Height (cm)</label>
                <input type="number" name="height" className="input-control" value={formData.height || ''} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Weight (kg)</label>
                <input type="number" name="weight" className="input-control" value={formData.weight || ''} onChange={handleChange} />
              </div>
            </div>
          ) : (
            <div style={styles.statsGrid}>
              <div style={styles.statBox}>
                <div style={styles.label}>Age</div>
                <div style={styles.statValue}>{profile.age || '--'}</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.label}>Gender</div>
                <div style={{ ...styles.statValue, textTransform: 'capitalize' }}>{profile.gender || '--'}</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.label}>Height</div>
                <div style={styles.statValue}>{profile.height ? `${profile.height} cm` : '--'}</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.label}>Weight</div>
                <div style={styles.statValue}>{profile.weight ? `${profile.weight} kg` : '--'}</div>
              </div>
            </div>
          )}
        </div>

        {/* Lifestyle */}
        <div className="glass-panel" style={styles.card}>
          <h3 style={styles.cardTitle}><FiZap /> Lifestyle</h3>
          {editing ? (
            <div style={styles.formGrid}>
              <div className="input-group">
                <label>Activity Level</label>
                <select name="activity_level" className="input-control" value={formData.activity_level || ''} onChange={handleChange}>
                  <option value="sedentary">Sedentary</option>
                  <option value="moderate">Moderate</option>
                  <option value="active">Active</option>
                </select>
              </div>
              <div className="input-group">
                <label>Sleep Hours</label>
                <input type="number" name="sleep_hours" className="input-control" value={formData.sleep_hours || ''} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Dietary Preference</label>
                <select name="diet_type" className="input-control" value={formData.diet_type || ''} onChange={handleChange}>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="non-vegetarian">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                </select>
              </div>
              <div className="input-group">
                <label>Stress Level</label>
                <select name="stress_level" className="input-control" value={formData.stress_level || ''} onChange={handleChange}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          ) : (
            <div style={styles.lifestyleList}>
              <div style={styles.lifestyleItem}>
                <FiZap color="#fbbf24" />
                <span>Diet: <strong style={{ textTransform: 'capitalize' }}>{profile.diet_type || 'Balanced'}</strong></span>
              </div>
              <div style={styles.lifestyleItem}>
                <FiZap color="#fbbf24" />
                <span>Activity: <strong>{profile.activity_level || 'Moderate'}</strong></span>
              </div>
              <div style={styles.lifestyleItem}>
                <FiMoon color="#818cf8" />
                <span>Sleep: <strong>{profile.sleep_hours || '--'}h</strong></span>
              </div>
              <div style={styles.lifestyleItem}>
                <FiActivity color="#f87171" />
                <span>Stress: <strong>{profile.stress_level || 'Medium'}</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* History / Meta */}
        <div className="glass-panel" style={{ ...styles.card, gridColumn: 'span 1' }}>
          <h3 style={styles.cardTitle}><FiClock /> Update History</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            <FiClock style={{ marginRight: '0.5rem' }} />
            Last updated: <span style={{ color: 'var(--text-main)' }}>{lastUpdated || 'No records yet'}</span>
          </p>
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', fontSize: '0.85rem' }}>
             <FiShield color="var(--success)" style={{ marginRight: '0.5rem' }} />
             Your health data is encrypted and secure.
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  profileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem'
  },
  card: {
    padding: '2rem'
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontSize: '1.1rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '1.5rem',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '0.8rem'
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  label: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  value: {
    fontSize: '1.1rem',
    fontWeight: '600'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem'
  },
  statBox: {
    padding: '1rem',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    textAlign: 'center'
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: '800',
    marginTop: '0.3rem',
    color: 'var(--primary)'
  },
  lifestyleList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem'
  },
  lifestyleItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontSize: '1rem'
  },
  formGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }
};

export default Profile;
