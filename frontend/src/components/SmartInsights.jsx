import React from 'react';
import { 
  FiTrendingUp, FiTrendingDown, FiCheckCircle, FiActivity, 
  FiClock, FiAlertCircle, FiZap, FiTarget, FiArrowRight,
  FiDroplet, FiShield, FiInfo
} from 'react-icons/fi';

const SmartInsights = ({ data, dietData }) => {
  if (!data) return (
    <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
      Updating your health coach insights...
    </div>
  );

  const { 
    adherence = 0, 
    classification = "Consistent", 
    weightTrend = 0, 
    prediction = "Analysis in progress...", 
    daysToGoal = 0,
    streak = { current_streak: 0, longest_streak: 0 },
    isNewUser = false,
    logCount = 0
  } = data;

  // TIERED SYSTEM LOGIC
  const level = isNewUser ? 1 : (logCount < 3 ? 2 : 3);

  // LEVEL 1: INITIAL STATE (0 LOGS)
  if (level === 1) return (
    <div className="animate-fade-in" style={{ marginTop: '2.5rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <FiZap color="var(--primary)" /> Smart Coaching Hub
      </h2>
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(30, 41, 59, 0.2) 100%)' }}>
        <FiZap size={48} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
        <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Your Journey Starts Here</h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
          Based on your current profile, we’ve created an initial health plan. Start logging your daily activity to unlock personalized trend analysis, consistency streaks, and weight predictions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem', color: 'var(--primary)', fontWeight: 'bold' }}>
              <FiTarget /> Goal Direction
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>You are targeting health improvement. Maintaining a balanced calorie intake and consistent daily steps is your primary focus this week.</p>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem', color: 'var(--success)', fontWeight: 'bold' }}>
              <FiCheckCircle /> Basic Recommendation
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Focus on consistent meals and regular activity (30 mins walk) to begin seeing progress. Your first log will activate your tracking engine.</p>
          </div>
        </div>
        <div style={{ marginTop: '2.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <FiInfo /> Log your first check-in above to activate Level 2 insights.
        </div>
      </div>
    </div>
  );

  // LEVEL 2 & 3 SHARED LOGIC
  const statusIcons = {
    "Elite": { icon: <FiCheckCircle color="var(--success)" />, color: 'var(--success)' },
    "Consistent": { icon: <FiActivity color="var(--warning)" />, color: 'var(--warning)' },
    "Struggling": { icon: <FiAlertCircle color="var(--danger)" />, color: 'var(--danger)' }
  };
  const statusInfo = statusIcons[classification] || statusIcons["Consistent"];

  const getStatusExplanation = () => {
    if (level === 2) return "Early progress tracking. Continue logging for more accurate status classification.";
    if (classification === "Elite") return "Your consistency is perfect. You are optimizing every health pillar.";
    if (classification === "Consistent") return `Good steady work. Maintaining ${adherence}% adherence is the key to success.`;
    return `Your adherence is ${adherence}%. Focus on small wins to rebuild momentum.`;
  };

  const getImprovedPrediction = () => {
    if (level === 2) return "Based on your early logs, we've started tracking your trajectory. Complete 3 consecutive days to unlock goal timeline predictions.";
    if (!daysToGoal || daysToGoal <= 0) return prediction;
    return `At your current pace, you are on track to reach your goal in ${daysToGoal} days. Keep up the ${classification} performance!`;
  };

  const getTrendDisplay = () => {
    if (level === 2) return (
      <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>
        <FiClock size={24} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
        <p style={{ fontSize: '0.85rem' }}>Trend available in {3 - logCount} more logs</p>
      </div>
    );
    return (
      <>
        <div style={{ ...styles.metricValue, color: parseFloat(weightTrend) <= 0 ? 'var(--success)' : 'var(--warning)' }}>
          {parseFloat(weightTrend) > 0 ? <FiTrendingUp /> : <FiTrendingDown />}
          {Math.abs(parseFloat(weightTrend))} <span style={{ fontSize: '1rem' }}>kg/week</span>
        </div>
        <p style={styles.metricSubtext}>
          {parseFloat(weightTrend) < 0 ? "You're in a sustainable deficit." : "Growth phase detected."}
        </p>
      </>
    );
  };

  return (
    <div className="animate-fade-in" style={{ marginTop: '2.5rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <FiZap color="var(--primary)" /> Smart Coaching Hub
        <span style={styles.levelBadge}>Level {level}</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ADHERENCE - Visible in Level 2 & 3 */}
        <div className="glass-panel" style={styles.metricCard}>
          <div style={styles.metricHeader}>
            <FiTarget color="var(--primary)" />
            <span>ADHERENCE</span>
          </div>
          <div style={styles.metricValue}>{adherence}%</div>
          <p style={styles.metricSubtext}>Current consistency rate</p>
        </div>

        {/* STATUS - Visible in Level 2 & 3 */}
        <div className="glass-panel" style={{ ...styles.metricCard, borderLeft: `4px solid ${statusInfo.color}` }}>
          <div style={styles.metricHeader}>
            {statusInfo.icon}
            <span>STATUS</span>
          </div>
          <div style={{ ...styles.metricValue, color: statusInfo.color }}>{level === 2 ? "Initializing" : classification}</div>
          <p style={styles.metricSubtext}>{getStatusExplanation()}</p>
        </div>

        {/* WEIGHT TREND - Level 3 only (Level 2 shows placeholder) */}
        <div className="glass-panel" style={styles.metricCard}>
          <div style={styles.metricHeader}>
            <FiTrendingDown color="var(--success)" />
            <span>WEIGHT TREND</span>
          </div>
          {getTrendDisplay()}
        </div>
      </div>

      <div className="glass-panel" style={styles.coachBanner}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={styles.coachAvatar}>AI</div>
          <div>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Smart Coach Analysis</h4>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{getImprovedPrediction()}</p>
          </div>
        </div>
      </div>

      {/* RECOMMENDATIONS - Always visible but context-aware */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="glass-panel" style={styles.focusCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>DAILY FOCUS</h4>
            <FiZap color="var(--warning)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
            {level === 2 ? "Establish Logging Habit" : (adherence < 90 ? "Complete Goals" : "Maintain Pace")}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {level === 2 ? "Focus on recording your first 3 days to unlock deep insights." : "Consistency is the fastest route to your health goal."}
          </p>
        </div>

        <div className="glass-panel" style={styles.recCard}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>RECOMMENDATIONS</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={styles.recIcon}><FiDroplet color="var(--primary)" /></div>
              <div style={{ fontSize: '0.95rem' }}>Maintain your water intake target.</div>
              <FiArrowRight style={{ marginLeft: 'auto', opacity: 0.3 }} />
            </div>
            {level > 1 && (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={styles.recIcon}><FiZap color="var(--warning)" /></div>
                <div style={{ fontSize: '0.95rem' }}>Log your meals immediately after eating.</div>
                <FiArrowRight style={{ marginLeft: 'auto', opacity: 0.3 }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  metricCard: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  metricHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    letterSpacing: '1px'
  },
  metricValue: {
    fontSize: '2.2rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  metricSubtext: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    lineHeight: '1.4'
  },
  coachBanner: {
    marginTop: '1.5rem',
    padding: '2rem',
    background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, rgba(30, 41, 59, 0) 100%)',
    borderLeft: '4px solid var(--primary)'
  },
  coachAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    color: 'white',
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
  },
  focusCard: {
    padding: '1.5rem',
    border: '1px solid rgba(245, 158, 11, 0.2)',
    background: 'rgba(245, 158, 11, 0.02)'
  },
  recCard: {
    padding: '1.5rem'
  },
  recIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  levelBadge: {
    fontSize: '0.7rem',
    padding: '0.2rem 0.6rem',
    background: 'rgba(59, 130, 246, 0.1)',
    color: 'var(--primary)',
    borderRadius: '10px',
    fontWeight: '800',
    textTransform: 'uppercase'
  }
};

export default SmartInsights;
