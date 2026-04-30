import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiPlus, FiCalendar, FiPieChart, FiActivity, FiZap, FiCheckCircle } from 'react-icons/fi';
import apiClient from '../api/apiClient';

const DietPlanner = () => {
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchDiet = async () => {
    setGenerating(true);
    try {
      const res = await apiClient.post('/diet/generate');
      if (res.data.success) {
        setPlan(res.data.plan);
      }
    } catch (err) {
      console.error("Failed to generate diet plan", err);
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get('/user/profile');
        if (res.data.profile) setProfile(res.data.profile);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
    fetchDiet();
  }, []);

  const dietType = profile?.diet_type === 'veg' ? 'Vegetarian' : (profile?.diet_type === 'non-veg' ? 'Non-Vegetarian' : 'Mixed');

  if (loading) {
    return (
      <div className="container" style={{ padding: '8rem', textAlign: 'center' }}>
        <div className="loader"></div>
        <p style={{ marginTop: '2rem', fontSize: '1.2rem', color: 'var(--text-muted)' }}>Vitalis AI is curating your personalized meal plan...</p>
      </div>
    );
  }

  const MealCard = ({ title, data }) => {
    const [completed, setCompleted] = useState({});

    const toggleItem = (idx) => {
      setCompleted(prev => ({
        ...prev,
        [idx]: !prev[idx]
      }));
    };

    return (
      <div className="glass-panel hover-scale" style={styles.mealCard}>
        <div style={styles.mealHeader}>
          <h4 style={styles.mealTitle}>{title}</h4>
          <span style={styles.calories}>{data.calories} kcal</span>
        </div>
        <ul style={styles.foodList}>
          {data.items.map((item, idx) => (
            <li key={idx} style={{...styles.foodItem, opacity: completed[idx] ? 0.5 : 1}}>
              <input 
                type="checkbox" 
                checked={!!completed[idx]} 
                onChange={() => toggleItem(idx)}
                style={styles.checkbox}
              />
              <span style={{ textDecoration: completed[idx] ? 'line-through' : 'none' }}>
                {item}
              </span>
            </li>
          ))}
        </ul>
        <div style={styles.nutrientCounter}>
          <div style={styles.nItem}>P: {data.protein}g</div>
          <div style={styles.nItem}>C: {data.carbs}g</div>
          <div style={styles.nItem}>F: {data.fats}g</div>
        </div>
      </div>
    );
  };

  return (
    <div className="container animate-fade-in content-wrapper min-h-screen pb-24">
      <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        <FiChevronLeft /> Back to Dashboard
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Smart Diet Planner</h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
            Personalized <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{dietType}</span> strategy for you.
          </p>
        </div>
        <button onClick={fetchDiet} className="btn btn-primary" disabled={generating}>
          {generating ? <div className="spinner-sm"></div> : <FiZap />} 
          {generating ? " Generating..." : " Regenerate Plan"}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {plan && (
              <>
                <MealCard title="Breakfast" data={plan.breakfast} />
                <MealCard title="Lunch" data={plan.lunch} />
                <MealCard title="Evening Snacks" data={plan.snacks} />
                <MealCard title="Dinner" data={plan.dinner} />
              </>
            )}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <FiPieChart /> Daily Macro Targets
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={styles.targetProgress}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Calories</span>
                <span style={{ fontWeight: 'bold' }}>{plan?.total.calories} kcal</span>
              </div>
              <div style={styles.progressBar}><div style={{ ...styles.progressFill, width: '100%', background: 'var(--primary)' }}></div></div>
            </div>
            <div style={styles.targetProgress}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Protein</span>
                <span style={{ fontWeight: 'bold' }}>{plan?.total.protein}g</span>
              </div>
              <div style={styles.progressBar}><div style={{ ...styles.progressFill, width: '100%', background: 'var(--success)' }}></div></div>
            </div>
            <div style={styles.targetProgress}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Carbs</span>
                <span style={{ fontWeight: 'bold' }}>{plan?.total.carbs}g</span>
              </div>
              <div style={styles.progressBar}><div style={{ ...styles.progressFill, width: '100%', background: 'var(--warning)' }}></div></div>
            </div>
            <div style={styles.targetProgress}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Fats</span>
                <span style={{ fontWeight: 'bold' }}>{plan?.total.fats}g</span>
              </div>
              <div style={styles.progressBar}><div style={{ ...styles.progressFill, width: '100%', background: '#ef4444' }}></div></div>
            </div>
          </div>
          
          <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--primary)' }}>Vitalis AI Tips</h4>
            <ul style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li>• Hydrate: Drink 500ml water before each meal</li>
              <li>• Timing: Maintain 4-hour gaps between meals</li>
              <li>• Fiber: Always start with salad for lunch/dinner</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  mealCard: {
    padding: '1.5rem',
    background: 'rgba(255,255,255,0.03)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  mealHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem'
  },
  mealTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--primary)'
  },
  calories: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-muted)'
  },
  foodList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  foodItem: {
    fontSize: '0.95rem',
    color: '#e2e8f0',
    display: 'flex',
    alignItems: 'center'
  },
  checkbox: {
    width: '16px',
    height: '16px',
    marginRight: '12px',
    cursor: 'pointer',
    accentColor: 'var(--primary)'
  },
  nutrientCounter: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '0.5rem',
    padding: '0.6rem 1rem',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.05)'
  },
  nItem: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: '600'
  },
  targetProgress: {
    display: 'flex',
    flexDirection: 'column'
  },
  progressBar: {
    height: '6px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'all 0.5s ease'
  }
};

export default DietPlanner;

