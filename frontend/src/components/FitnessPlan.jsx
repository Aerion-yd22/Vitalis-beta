import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { 
  FiActivity, FiCheckCircle, FiCircle, FiTrendingUp, 
  FiZap, FiWind, FiAward, FiBarChart2 
} from 'react-icons/fi';

const FitnessPlan = () => {
  const [fitnessData, setFitnessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    fetchFitness();
  }, []);

  const fetchFitness = async () => {
    try {
      const res = await apiClient.get('/fitness/daily');
      if (res.data.success) {
        setFitnessData(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch fitness plan", err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (fitnessData?.challenge?.completed || completing) return;
    
    setCompleting(true);
    try {
      const res = await apiClient.post('/fitness/complete');
      if (res.data.success) {
        setFitnessData(prev => ({
          ...prev,
          challenge: {
            ...prev.challenge,
            completed: true,
            streak: res.data.streak,
            points: res.data.points
          }
        }));
      }
    } catch (err) {
      console.error("Failed to complete challenge", err);
    } finally {
      setCompleting(false);
    }
  };

  const [doneEx, setDoneEx] = useState({});

  const toggleExercise = (idx) => {
    setDoneEx(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loading) return <div style={styles.loading}>Loading Fitness Plan...</div>;
  if (!fitnessData) return null;

  const { challenge, exercises } = fitnessData;
  const progress = challenge.completed ? 100 : 0;

  return (
    <div className="glass-panel animate-fade-in" style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}><FiActivity /> Your Daily Fitness Plan</h3>
        <div style={styles.badge}>
           <FiAward /> {challenge.streak > 0 ? `🔥 ${challenge.streak}-day streak!` : 'Start your streak!'}
        </div>
      </div>

      <div style={styles.grid}>
        {/* Daily Challenge */}
        <div style={styles.challengeCard}>
          <div style={styles.cardLabel}>TODAY'S CHALLENGE</div>
          <h4 style={styles.challengeText}>{challenge.challenge_text}</h4>
          
          <div style={styles.progressSection}>
            <div style={styles.progressBarBg}>
              <div style={{ ...styles.progressBarFill, width: `${progress}%` }}></div>
            </div>
            <div style={styles.progressLabels}>
              <span>Progress: {progress}%</span>
              <span>+10 Points</span>
            </div>
          </div>

          <button 
            onClick={handleComplete}
            disabled={challenge.completed || completing}
            style={challenge.completed ? styles.completeBtnDone : styles.completeBtn}
          >
            {challenge.completed ? (
              <><FiCheckCircle /> Challenge Completed</>
            ) : (
              completing ? 'Updating...' : 'Mark as Done'
            )}
          </button>
        </div>

        {/* Exercise Suggestions */}
        <div style={styles.exercisesList}>
          <div style={styles.cardLabel}>RECOMMENDED EXERCISES</div>
          {exercises.map((ex, idx) => {
            const isDone = doneEx[idx];
            return (
              <div key={idx} onClick={() => toggleExercise(idx)} style={{ ...styles.exerciseItem, opacity: isDone ? 0.5 : 1, borderColor: isDone ? 'var(--success)' : 'rgba(255,255,255,0.05)' }}>
                <div style={styles.exIcon}>
                  {ex.type === 'walk' && <FiWind color="#3b82f6" />}
                  {ex.type === 'strength' && <FiActivity color="#10b981" />}
                  {ex.type === 'run' && <FiZap color="#f59e0b" />}
                  {ex.type === 'stretch' && <FiTrendingUp color="#8b5cf6" />}
                  {!['walk', 'strength', 'run', 'stretch'].includes(ex.type) && <FiActivity color="var(--primary)" />}
                </div>
                <div style={styles.exInfo}>
                  <div style={{ ...styles.exTitle, textDecoration: isDone ? 'line-through' : 'none' }}>{ex.title}</div>
                  <div style={styles.exMeta}>{ex.duration} · High Impact</div>
                </div>
                <div style={styles.exAction}>
                  {isDone ? <FiCheckCircle color="var(--success)" /> : <FiCircle size={18} color="var(--text-muted)" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginTop: '2rem',
    padding: '2rem',
    borderLeft: '4px solid #10b981'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontSize: '1.4rem',
    margin: 0
  },
  badge: {
    background: 'rgba(16, 185, 129, 0.1)',
    color: '#10b981',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem'
  },
  challengeCard: {
    background: 'rgba(255,255,255,0.03)',
    padding: '1.5rem',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column'
  },
  cardLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '1rem'
  },
  challengeText: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '1.5rem'
  },
  progressSection: {
    marginBottom: '2rem'
  },
  progressBarBg: {
    height: '8px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '4px',
    marginBottom: '0.6rem',
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #10b981, #34d399)',
    transition: 'width 0.5s ease'
  },
  progressLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: 'var(--text-muted)'
  },
  completeBtn: {
    marginTop: 'auto',
    width: '100%',
    padding: '0.8rem',
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  completeBtnDone: {
    marginTop: 'auto',
    width: '100%',
    padding: '0.8rem',
    background: 'rgba(16, 185, 129, 0.2)',
    color: '#10b981',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '12px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    cursor: 'default'
  },
  exercisesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  exerciseItem: {
    background: 'rgba(255,255,255,0.02)',
    padding: '1rem',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    border: '1px solid rgba(255,255,255,0.05)',
    transition: 'all 0.2s',
    cursor: 'pointer'
  },
  exIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem'
  },
  exInfo: {
    flex: 1
  },
  exTitle: {
    fontSize: '0.95rem',
    fontWeight: '600'
  },
  exMeta: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  },
  loading: {
    padding: '2rem',
    textAlign: 'center',
    color: 'var(--text-muted)'
  }
};

export default FitnessPlan;
