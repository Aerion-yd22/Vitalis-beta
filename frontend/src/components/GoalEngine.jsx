import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { FaWeight, FaDumbbell, FaRunning, FaHeartbeat, FaTrash, FaPlus, FaBullseye } from 'react-icons/fa';

const GoalEngine = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    goal_type: '',
    target_value: '',
    unit: '',
    deadline: ''
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await apiClient.get('/goals');
      if (res.data.success) {
        setGoals(res.data.goals);
      }
    } catch (err) {
      console.error("Failed to fetch goals", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/goals', newGoal);
      if (res.data.success) {
        setShowAddForm(false);
        setNewGoal({ goal_type: '', target_value: '', unit: '', deadline: '' });
        fetchGoals();
      }
    } catch (err) {
      console.error("Failed to add goal", err);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await apiClient.delete(`/goals/${id}`);
      fetchGoals();
    } catch (err) {
      console.error("Failed to delete goal", err);
    }
  };

  const calculateProgress = (current, target) => {
    const progress = (current / target) * 100;
    return Math.min(progress, 100).toFixed(0);
  };

  const getGoalIcon = (type) => {
    const t = type.toLowerCase();
    if (t.includes('weight')) return <FaWeight />;
    if (t.includes('muscle') || t.includes('strength')) return <FaDumbbell />;
    if (t.includes('run') || t.includes('cardio')) return <FaRunning />;
    return <FaHeartbeat />;
  };

  if (loading) return <div className="text-center p-4">Loading goals...</div>;

  return (
    <div className="glass-panel" style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}><FaBullseye color="var(--primary)" /> Your Goal</h3>
        <button 
          onClick={() => setShowAddForm(!showAddForm)} 
          className="btn btn-secondary"
          style={{ padding: '0.5rem 1rem' }}
        >
          {showAddForm ? 'Cancel' : <><FaPlus /> Set New Goal</>}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddGoal} style={styles.form} className="animate-fade-in">
          <div style={styles.inputGroup}>
            <input 
              type="text" 
              placeholder="Goal Type (e.g. Weight Loss)" 
              value={newGoal.goal_type}
              onChange={(e) => setNewGoal({...newGoal, goal_type: e.target.value})}
              className="glass-panel"
              style={styles.input}
              required
            />
            <input 
              type="number" 
              placeholder="Target Value" 
              value={newGoal.target_value}
              onChange={(e) => setNewGoal({...newGoal, target_value: e.target.value})}
              className="glass-panel"
              style={styles.input}
              required
            />
            <input 
              type="text" 
              placeholder="Unit (kg, steps, etc.)" 
              value={newGoal.unit}
              onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
              className="glass-panel"
              style={styles.input}
            />
            <input 
              type="date" 
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
              className="glass-panel"
              style={styles.input}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Create Goal</button>
        </form>
      )}

      <div style={styles.goalsList}>
        {goals.length === 0 ? (
          <div style={styles.emptyState}>
            <FaHeartbeat size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p>No active goals. Start by setting your health milestones!</p>
          </div>
        ) : (
          goals.map((goal) => (
            <div key={goal.id} className="glass-panel hover-scale" style={styles.goalCard}>
              <div style={styles.goalInfo}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{getGoalIcon(goal.goal_type)}</div>
                  <div>
                    <h4 style={styles.goalType}>{goal.goal_type}</h4>
                    <p style={styles.goalMeta}>Target: {goal.target_value} {goal.unit} | {goal.deadline ? `By ${new Date(goal.deadline).toLocaleDateString()}` : 'No deadline'}</p>
                  </div>
                </div>
                <button onClick={() => handleDeleteGoal(goal.id)} style={styles.deleteBtn}>
                  <FaTrash />
                </button>
              </div>
              <div style={styles.progressContainer}>
                <div style={styles.progressBarWrapper}>
                  <div 
                    style={{ 
                      ...styles.progressBar, 
                      width: `${calculateProgress(goal.current_value, goal.target_value)}%`,
                      background: `linear-gradient(90deg, var(--primary), #8b5cf6)`
                    }} 
                  />
                </div>
                <div style={styles.progressLabel}>
                  <span>{calculateProgress(goal.current_value, goal.target_value)}% Complete</span>
                  <span>{goal.current_value} / {goal.target_value} {goal.unit}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    marginTop: '2rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1.25rem',
    fontWeight: '700'
  },
  form: {
    marginBottom: '2rem',
    padding: '1.5rem',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.05)'
  },
  inputGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  input: {
    padding: '0.8rem 1rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: 'white',
    outline: 'none'
  },
  goalsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  goalCard: {
    padding: '1.5rem',
    background: 'rgba(255,255,255,0.03)'
  },
  goalInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem'
  },
  goalType: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '0.25rem'
  },
  goalMeta: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)'
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(239, 68, 68, 0.6)',
    cursor: 'pointer',
    fontSize: '1.1rem',
    transition: 'color 0.2s',
    '&:hover': {
      color: 'var(--danger)'
    }
  },
  progressContainer: {
    marginTop: '1rem'
  },
  progressBarWrapper: {
    height: '10px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '5px',
    overflow: 'hidden',
    marginBottom: '0.75rem'
  },
  progressBar: {
    height: '100%',
    borderRadius: '5px',
    transition: 'width 0.5s ease-out'
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    fontWeight: '500'
  },
  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '3rem',
    color: 'var(--text-muted)'
  }
};

export default GoalEngine;
