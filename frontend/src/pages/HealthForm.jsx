import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { 
  FiUser, FiActivity, FiAlertCircle, FiHeart, FiFileText, 
  FiClock, FiZap, FiDroplet, FiMoon, FiShield, FiArrowRight, FiArrowLeft, FiCheck
} from 'react-icons/fi';

const HealthForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);
  const [env, setEnv] = useState(null);

  // DEMO DATA: Pre-fill some fields for a faster demo
  const [formData, setFormData] = useState({
    // Step 1: Basic Profile
    age: '28',
    gender: 'Male',
    weight: '75',
    height: '180',
    
    // Step 2: Lifestyle
    activity: 'Moderate',
    sleep_hours: '6–8 hrs',
    sleep_quality: 'Good',
    water: '2–3L',
    
    // Step 3: Nutrition
    diet: 'Non-vegetarian',
    eating_pattern: 'Regular',
    junk: 'Occasional',
    
    // Step 4: Health Status
    bp: 'Normal',
    sugar: 'Normal',
    conditions: 'None',
    symptoms: ['Stress', 'Fatigue'],
    
    // Step 5: Activity
    steps: '3k–7k',
    workout_freq: '3-4 days',
    focus: 'General Health'
  });

  const loadingMessages = [
    "Analyzing your health...",
    "Checking environment...",
    "Calculating personalized metrics...",
    "Preparing your plan...",
    "Finalizing Smart Insights..."
  ];

  useEffect(() => {
    const fetchEnv = async () => {
      try {
        const envRes = await apiClient.get('/user/environment');
        if (envRes.data.success) setEnv(envRes.data);
      } catch (err) {
        console.error("Failed to fetch environment", err);
      }
    };
    fetchEnv();
  }, []);

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSymptomToggle = (symptom) => {
    setFormData((prev) => {
      const isSelected = prev.symptoms.includes(symptom);
      return {
        ...prev,
        symptoms: isSelected 
          ? prev.symptoms.filter(s => s !== symptom)
          : [...prev.symptoms, symptom]
      };
    });
  };

  const handleNext = () => {
    if (currentStep === 1 && (!formData.age || !formData.gender)) {
      setError("Please fill in your Age and Gender to continue.");
      return;
    }
    setError("");
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setError("");
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    setLoading(true);
    try {
      // 1. Prepare structured data
      const response = await apiClient.post('/recommendations', formData);
      const recoData = response.data;
      sessionStorage.setItem('recoData', JSON.stringify(recoData));
      
      navigate('/dashboard');
    } catch (err) {
      console.error("Submission failed", err);
      setError(err.response?.data?.message || "Vitalis is currently overloaded. Please try again in a few seconds.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container content-wrapper animate-fade-in" style={styles.loadingContainer}>
        <div className="glass-panel" style={styles.loadingPanel}>
          <div className="spinner"></div>
          <h2 style={{ fontSize: '1.8rem', marginTop: '2rem' }}>{loadingMessages[loadingStep]}</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Generating structured AI insights...</p>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="animate-fade-in">
            <h3 style={styles.sectionTitle}><FiUser /> Basic Profile</h3>
            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <label>Age</label>
              <input type="number" name="age" className="input-control" value={formData.age} onChange={handleChange} placeholder="e.g. 25" required />
            </div>
            <div className="input-group" style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label>Weight (kg)</label>
                <input type="number" name="weight" className="input-control" value={formData.weight} onChange={handleChange} placeholder="e.g. 70" required />
              </div>
              <div>
                <label>Height (cm)</label>
                <input type="number" name="height" className="input-control" value={formData.height} onChange={handleChange} placeholder="e.g. 175" required />
              </div>
            </div>
            <div className="input-group">
              <label>Gender</label>
              <div style={styles.optionsGrid}>
                {['Male', 'Female', 'Other'].map(opt => (
                  <div 
                    key={opt} 
                    style={formData.gender === opt ? styles.optionSelected : styles.optionBtn}
                    onClick={() => setFormData({ ...formData, gender: opt })}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in">
            <h3 style={styles.sectionTitle}><FiMoon /> Lifestyle</h3>
            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <label>How active are you?</label>
              <div style={styles.optionsGrid2}>
                {['Sedentary', 'Light', 'Moderate', 'Active'].map(opt => (
                  <div key={opt} style={formData.activity === opt ? styles.optionSelected : styles.optionBtn} onClick={() => setFormData({ ...formData, activity: opt })}>{opt}</div>
                ))}
              </div>
            </div>
            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <label>How many hours do you sleep?</label>
              <div style={styles.optionsGrid2}>
                {['<5 hrs', '5–6 hrs', '6–8 hrs', '8+ hrs'].map(opt => (
                  <div key={opt} style={formData.sleep_hours === opt ? styles.optionSelected : styles.optionBtn} onClick={() => setFormData({ ...formData, sleep_hours: opt })}>{opt}</div>
                ))}
              </div>
            </div>
            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <label>How would you rate your sleep quality?</label>
              <div style={styles.optionsGrid}>
                {['Poor', 'Average', 'Good'].map(opt => (
                  <div key={opt} style={formData.sleep_quality === opt ? styles.optionSelected : styles.optionBtn} onClick={() => setFormData({ ...formData, sleep_quality: opt })}>{opt}</div>
                ))}
              </div>
            </div>
            <div className="input-group">
              <label>Daily water intake</label>
              <div style={styles.optionsGrid2}>
                {['<1L', '1–2L', '2–3L', '3L+'].map(opt => (
                  <div key={opt} style={formData.water === opt ? styles.optionSelected : styles.optionBtn} onClick={() => setFormData({ ...formData, water: opt })}>{opt}</div>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-fade-in">
            <h3 style={styles.sectionTitle}><FiDroplet /> Nutrition</h3>
            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <label>Diet type</label>
              <div style={styles.optionsGrid}>
                {['Vegetarian', 'Non-vegetarian', 'Vegan'].map(opt => (
                  <div key={opt} style={formData.diet === opt ? styles.optionSelected : styles.optionBtn} onClick={() => setFormData({ ...formData, diet: opt })}>{opt}</div>
                ))}
              </div>
            </div>
            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <label>Eating pattern</label>
              <div style={styles.optionsGrid}>
                {['Regular', 'Skipping meals', 'Overeating'].map(opt => (
                  <div key={opt} style={formData.eating_pattern === opt ? styles.optionSelected : styles.optionBtn} onClick={() => setFormData({ ...formData, eating_pattern: opt })}>{opt}</div>
                ))}
              </div>
            </div>
            <div className="input-group">
              <label>Junk food frequency</label>
              <div style={styles.optionsGrid}>
                {['Rare', 'Occasional', 'Frequent'].map(opt => (
                  <div key={opt} style={formData.junk === opt ? styles.optionSelected : styles.optionBtn} onClick={() => setFormData({ ...formData, junk: opt })}>{opt}</div>
                ))}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="animate-fade-in">
            <h3 style={styles.sectionTitle}><FiHeart /> Health Status</h3>
            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <label>Blood pressure</label>
              <div style={styles.optionsGrid2}>
                {['Normal', 'Slightly High', 'High', "Don't Know"].map(opt => (
                  <div key={opt} style={formData.bp === opt ? styles.optionSelected : styles.optionBtn} onClick={() => setFormData({ ...formData, bp: opt })}>{opt}</div>
                ))}
              </div>
            </div>
            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <label>Blood sugar</label>
              <div style={styles.optionsGrid2}>
                {['Normal', 'Prediabetic', 'Diabetic', "Don't Know"].map(opt => (
                  <div key={opt} style={formData.sugar === opt ? styles.optionSelected : styles.optionBtn} onClick={() => setFormData({ ...formData, sugar: opt })}>{opt}</div>
                ))}
              </div>
            </div>
            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <label>Any existing condition?</label>
              <div style={styles.optionsGrid2}>
                {['None', 'Diabetes', 'BP', 'Thyroid', 'Other'].map(opt => (
                  <div key={opt} style={formData.conditions === opt ? styles.optionSelected : styles.optionBtn} onClick={() => setFormData({ ...formData, conditions: opt })}>{opt}</div>
                ))}
              </div>
            </div>
            <div className="input-group">
              <label>Current symptoms (Multi-select)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['Fatigue', 'Headache', 'Stress', 'Poor sleep', 'Digestion issues'].map(opt => (
                  <div 
                    key={opt} 
                    style={formData.symptoms.includes(opt) ? styles.optionSelected : styles.optionBtn} 
                    onClick={() => handleSymptomToggle(opt)}
                  >
                    {formData.symptoms.includes(opt) && <FiCheck style={{ marginRight: '0.4rem' }}/>}
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="animate-fade-in">
            <h3 style={styles.sectionTitle}><FiActivity /> Activity & Fitness</h3>
            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <label>Steps per day</label>
              <div style={styles.optionsGrid2}>
                {['<3k', '3k–7k', '7k–10k', '10k+'].map(opt => (
                  <div key={opt} style={formData.steps === opt ? styles.optionSelected : styles.optionBtn} onClick={() => setFormData({ ...formData, steps: opt })}>{opt}</div>
                ))}
              </div>
            </div>
            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <label>Exercise frequency</label>
              <div style={styles.optionsGrid2}>
                {['None', '1–2 days', '3–4 days', '5+ days'].map(opt => (
                  <div key={opt} style={formData.exercise === opt ? styles.optionSelected : styles.optionBtn} onClick={() => setFormData({ ...formData, exercise: opt })}>{opt}</div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container content-wrapper animate-fade-in" style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '700px', position: 'relative' }}>
        
        {/* Progress Bar */}
        <div style={styles.progressContainer}>
          <div style={{ ...styles.progressBar, width: `${(currentStep / totalSteps) * 100}%` }}></div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2.5rem', marginTop: '1rem' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Health Profile</h2>
          <p style={{ color: 'var(--text-muted)' }}>Step {currentStep} of {totalSteps}</p>
        </div>

        {error && (
          <div style={styles.errorBanner}>
            <FiAlertCircle /> <span>{error}</span>
          </div>
        )}

        <div style={{ minHeight: '350px' }}>
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div style={styles.buttonRow}>
          {currentStep > 1 ? (
            <button type="button" onClick={handleBack} style={styles.navBtnSecondary}>
              <FiArrowLeft /> Back
            </button>
          ) : <div></div>}

          {currentStep < totalSteps ? (
            <button type="button" onClick={handleNext} className="btn btn-primary" style={styles.navBtnPrimary}>
              Next <FiArrowRight />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} className="btn btn-primary" style={styles.navBtnPrimary}>
              <FiZap /> Generate AI Plan
            </button>
          )}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button type="button" onClick={handleNext} style={styles.skipBtn}>
            Skip if unsure
          </button>
        </div>
        
      </div>
    </div>
  );
};

const styles = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh'
  },
  loadingPanel: {
    width: '100%',
    maxWidth: '550px',
    textAlign: 'center',
    padding: '4rem 2rem'
  },
  errorBanner: {
    padding: '1rem',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    color: '#fca5a5',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  progressContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '6px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px 12px 0 0',
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    background: 'var(--primary)',
    transition: 'width 0.4s ease'
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.4rem',
    marginBottom: '1.5rem',
    color: 'var(--primary)'
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.8rem'
  },
  optionsGrid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.8rem'
  },
  optionBtn: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '1rem',
    borderRadius: '12px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: 'var(--text-muted)'
  },
  optionSelected: {
    background: 'var(--primary)',
    border: '1px solid var(--primary)',
    padding: '1rem',
    borderRadius: '12px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: 'white',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(255,255,255,0.05)'
  },
  navBtnSecondary: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.2)',
    color: 'white',
    padding: '0.8rem 1.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s'
  },
  navBtnPrimary: {
    padding: '0.8rem 2rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1rem'
  },
  skipBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: '0.9rem'
  }
};

export default HealthForm;
