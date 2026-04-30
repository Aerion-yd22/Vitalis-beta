import React from 'react';
import { FiCheckCircle, FiZap, FiPieChart } from 'react-icons/fi';

const DashboardDiet = ({ dietData, onRegenerate, loading }) => {
  if (!dietData) return (
    <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>No diet plan generated yet.</p>
      <button onClick={onRegenerate} className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={loading}>
        {loading ? 'Generating...' : 'Generate My Plan'}
      </button>
    </div>
  );

  const MealItem = ({ title, data }) => (
    <div className="glass-panel" style={styles.mealCard}>
      <div style={styles.mealHeader}>
        <h4 style={styles.mealTitle}>{title}</h4>
        <span style={styles.calories}>{data.calories} kcal</span>
      </div>
      <ul style={styles.foodList}>
        {data.items.map((item, idx) => (
          <li key={idx} style={styles.foodItem}>
            <FiCheckCircle size={14} color="var(--success)" style={{ marginRight: '8px' }} />
            {item}
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

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '2rem', marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', fontWeight: '700' }}>
          <FiPieChart color="var(--primary)" /> Smart Diet Planner
        </h3>
        <button onClick={onRegenerate} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }} disabled={loading}>
          {loading ? 'Updating...' : <><FiZap /> Regenerate Plan</>}
        </button>
      </div>

      <div style={styles.mealsGrid}>
        <MealItem title="Breakfast" data={dietData.breakfast} />
        <MealItem title="Lunch" data={dietData.lunch} />
        <MealItem title="Snacks" data={dietData.snacks} />
        <MealItem title="Dinner" data={dietData.dinner} />
      </div>

      <div className="glass-panel" style={styles.macroTracker}>
        <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem', color: 'var(--text-muted)' }}>Daily Macro Tracker</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Calories', val: dietData.total.calories, target: dietData.total.calories, color: 'var(--primary)' },
            { label: 'Protein', val: dietData.total.protein, target: dietData.total.protein, color: 'var(--success)' },
            { label: 'Carbs', val: dietData.total.carbs, target: dietData.total.carbs, color: 'var(--warning)' },
            { label: 'Fats', val: dietData.total.fats, target: dietData.total.fats, color: '#ef4444' }
          ].map((m, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                <span>{m.label}</span>
                <span>{m.val}g / {m.target}g</span>
              </div>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: '100%', background: m.color }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  mealsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem'
  },
  mealCard: {
    padding: '1.5rem',
    background: 'rgba(255,255,255,0.02)'
  },
  mealHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  mealTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: 'var(--primary)'
  },
  calories: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)'
  },
  foodList: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 1rem 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  foodItem: {
    fontSize: '0.9rem',
    color: '#e2e8f0',
    display: 'flex',
    alignItems: 'center'
  },
  nutrientCounter: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '8px'
  },
  nItem: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    fontWeight: '600'
  },
  macroTracker: {
    marginTop: '2rem',
    padding: '1.5rem',
    background: 'rgba(59, 130, 246, 0.03)'
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
    transition: 'width 0.5s ease'
  }
};

export default DashboardDiet;
