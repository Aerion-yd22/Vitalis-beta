import React, { useState } from 'react';
import { FiCpu, FiX, FiChevronRight, FiCode } from 'react-icons/fi';

/**
 * RuleEngineShowcase
 * 
 * A purely static, non-functional UI card that displays the
 * rule-based recommendation logic for demonstration purposes.
 * 
 * - Does NOT import or execute ruleEngine.js
 * - Does NOT connect to any API or real user data
 * - Does NOT modify any existing system behavior
 */
const RuleEngineShowcase = () => {
  const [showModal, setShowModal] = useState(false);

  const rules = [
    {
      condition: 'IF BMI > 25',
      action: 'Recommend calorie deficit and increased physical activity',
      category: 'Weight Management',
      color: '#ef4444',
    },
    {
      condition: 'IF BMI < 18.5',
      action: 'Recommend increased calorie intake with balanced nutrition',
      category: 'Weight Management',
      color: '#f59e0b',
    },
    {
      condition: 'IF sleep < 6 hours',
      action: 'Recommend improved sleep hygiene and duration',
      category: 'Recovery',
      color: '#8b5cf6',
    },
    {
      condition: 'IF activity = sedentary',
      action: 'Suggest daily light physical activity like walking',
      category: 'Fitness',
      color: '#10b981',
    },
    {
      condition: 'IF diet = vegetarian',
      action: 'Suggest plant-based protein sources (lentils, soy, quinoa)',
      category: 'Nutrition',
      color: '#3b82f6',
    },
  ];

  return (
    <>
      <div className="glass-panel" style={styles.container}>
        {/* Decorative glow */}
        <div style={styles.glowOrb} />

        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={styles.iconBox}>
              <FiCpu />
            </div>
            <div>
              <h2 style={styles.title}>Recommendation Engine</h2>
              <p style={styles.subtitle}>Rule-Based System (Core Logic)</p>
            </div>
          </div>
          <div style={styles.statusBadge}>
            <span style={styles.statusDot} />
            Deterministic
          </div>
        </div>

        <p style={styles.description}>
          Explainable, rule-based health recommendations powered by deterministic logic.
          Each rule maps a health metric to an actionable suggestion.
        </p>

        <div style={styles.statsRow}>
          <div style={styles.statItem}>
            <span style={styles.statValue}>5</span>
            <span style={styles.statLabel}>Active Rules</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>4</span>
            <span style={styles.statLabel}>Categories</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>100%</span>
            <span style={styles.statLabel}>Explainable</span>
          </div>
        </div>

        <button style={styles.viewBtn} onClick={() => setShowModal(true)}>
          <FiCode /> View Logic
          <FiChevronRight style={{ marginLeft: 'auto' }} />
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={styles.overlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FiCpu color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Rule Engine — Core Logic</h3>
              </div>
              <button style={styles.closeBtn} onClick={() => setShowModal(false)}>
                <FiX />
              </button>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 1.5rem 0', lineHeight: '1.6' }}>
              The following deterministic rules form the core of the recommendation engine.
              Each rule evaluates a health metric and produces an explainable suggestion.
            </p>

            <div style={styles.rulesContainer}>
              {rules.map((rule, idx) => (
                <div key={idx} style={styles.ruleCard}>
                  <div style={{ ...styles.ruleCategoryTag, background: `${rule.color}20`, color: rule.color }}>
                    {rule.category}
                  </div>
                  <div style={styles.ruleCondition}>
                    <span style={{ color: '#c084fc', fontWeight: 700 }}>IF</span>{' '}
                    {rule.condition.replace('IF ', '')}
                  </div>
                  <div style={styles.ruleArrow}>→</div>
                  <div style={styles.ruleAction}>{rule.action}</div>
                </div>
              ))}
            </div>

            <div style={styles.modalFooter}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Static demonstration — no live data connected
              </span>
              <button style={styles.closeModalBtn} onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  container: {
    marginTop: '2rem',
    padding: '2.5rem',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid rgba(139, 92, 246, 0.15)',
    boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
  },
  glowOrb: {
    position: 'absolute',
    top: '-40px',
    right: '-40px',
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.2rem',
    flexWrap: 'wrap',
    gap: '1rem',
    position: 'relative',
  },
  iconBox: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    background: 'rgba(139, 92, 246, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#8b5cf6',
    fontSize: '1.3rem',
  },
  title: {
    fontSize: '1.4rem',
    margin: 0,
    color: 'var(--text-white)',
  },
  subtitle: {
    fontSize: '0.85rem',
    margin: '0.15rem 0 0 0',
    color: '#8b5cf6',
    fontWeight: '600',
    opacity: 0.85,
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.35rem 0.9rem',
    borderRadius: '20px',
    background: 'rgba(16, 185, 129, 0.08)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    fontSize: '0.75rem',
    color: '#10b981',
    fontWeight: '600',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#10b981',
    display: 'inline-block',
  },
  description: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    maxWidth: '550px',
    marginBottom: '2rem',
  },
  statsRow: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem 1.8rem',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.05)',
    minWidth: '100px',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#8b5cf6',
  },
  statLabel: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginTop: '0.3rem',
  },
  viewBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    width: '100%',
    padding: '1rem 1.5rem',
    background: 'rgba(139, 92, 246, 0.08)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    borderRadius: '12px',
    color: '#8b5cf6',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  },

  /* Modal Styles */
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '1rem',
  },
  modal: {
    background: 'rgba(15, 23, 42, 0.98)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    borderRadius: '20px',
    padding: '2rem',
    maxWidth: '580px',
    width: '100%',
    maxHeight: '85vh',
    overflowY: 'auto',
    boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  closeBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: 'var(--text-muted)',
    padding: '0.5rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
    transition: 'all 0.2s',
  },
  rulesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  ruleCard: {
    padding: '1.2rem',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  ruleCategoryTag: {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '6px',
    fontSize: '0.65rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '0.7rem',
  },
  ruleCondition: {
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: '0.9rem',
    color: 'var(--text-white)',
    marginBottom: '0.3rem',
  },
  ruleArrow: {
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    margin: '0.2rem 0',
  },
  ruleAction: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1.5rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  closeModalBtn: {
    padding: '0.6rem 1.5rem',
    background: 'rgba(139, 92, 246, 0.15)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '10px',
    color: '#8b5cf6',
    fontWeight: '600',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};

export default RuleEngineShowcase;
