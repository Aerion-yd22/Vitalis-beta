import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, FiActivity, FiZap, FiCheckCircle, FiHeart, 
  FiDroplet, FiMoon, FiShield, FiChevronRight, FiChevronLeft,
  FiFileText, FiDownload
} from 'react-icons/fi';
import apiClient from '../api/apiClient';
import { jsPDF } from 'jspdf';

const RecommendationPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [form, setForm] = useState({
    // Basic
    age: '25', gender: 'male', height: '170', weight: '70',
    // Vitals
    blood_pressure: '120/80', blood_sugar: '90', heart_rate: '72', conditions: 'None',
    // Lifestyle
    sleep: '8', activity: 'moderate', stress: 'medium',
    // Nutrition
    diet_type: 'vegetarian', meals_count: '3', water_intake: '2', notes: '',
    // Exercise
    exercise_freq: '3', exercise_type: ['cardio'], duration: '30',
    // Additional
    smoking: 'no', alcohol: 'no', allergies: '', medications: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'exercise_type') {
      const updated = checked 
        ? [...form.exercise_type, value]
        : form.exercise_type.filter(t => t !== value);
      setForm({ ...form, exercise_type: updated });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleNext = () => setStep(s => Math.min(s + 1, 6));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/user/profile', form);
      
      // Simulate specialized analysis
      setTimeout(() => {
        const generatedResult = {
          summary: `Health profile analyzed for a ${form.age}-year-old ${form.gender}. BMI is ${(form.weight / ((form.height/100)**2)).toFixed(1)}.`,
          diet: `As a ${form.diet_type}, focus on ${form.diet_type === 'non-vegetarian' ? 'lean proteins like grilled chicken and fish' : 'plant proteins like tofu, lentils, and chickpeas'}. Ensure you hit your ${form.water_intake}L water target.`,
          exercise: `Given your ${form.activity} lifestyle, your ${form.exercise_freq}x weekly ${form.exercise_type.join('/')} sessions are great. Aim for ${form.duration} mins of heart-rate elevation.`,
          lifestyle: `With ${form.sleep} hours of sleep and ${form.stress} stress, prioritize a 10-minute meditation before bed to optimize recovery.`
        };
        setResult(generatedResult);
        setLoading(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      const margin = 20;
      let y = 20;

      // Header
      doc.setFontSize(22);
      doc.setTextColor(59, 130, 246);
      doc.text("Vitalis Health Report", margin, y);
      
      y += 15;
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, y);

      // Section 1: User Summary
      y += 20;
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("1. User Summary", margin, y);
      
      y += 10;
      doc.setFontSize(11);
      doc.text(`Age: ${form.age} | Gender: ${form.gender}`, margin, y);
      y += 7;
      const bmi = (form.weight / ((form.height/100)**2)).toFixed(1);
      doc.text(`Weight: ${form.weight}kg | Height: ${form.height}cm | BMI: ${bmi}`, margin, y);

      // Section 2: Lifestyle
      y += 15;
      doc.setFontSize(16);
      doc.text("2. Lifestyle & Nutrition", margin, y);
      
      y += 10;
      doc.setFontSize(11);
      doc.text(`Diet Type: ${form.diet_type}`, margin, y);
      y += 7;
      doc.text(`Sleep: ${form.sleep} hours | Activity: ${form.activity}`, margin, y);
      y += 7;
      doc.text(`Water Intake: ${form.water_intake}L/day`, margin, y);

      // Section 3: Recommendations
      y += 15;
      doc.setFontSize(16);
      doc.text("3. Smart Recommendations", margin, y);
      
      y += 10;
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.text("Dietary Advice:", margin, y);
      doc.setFont(undefined, 'normal');
      y += 7;
      doc.text(doc.splitTextToSize(result.diet, 170), margin, y);
      
      y += 20;
      doc.setFont(undefined, 'bold');
      doc.text("Exercise Plan:", margin, y);
      doc.setFont(undefined, 'normal');
      y += 7;
      doc.text(doc.splitTextToSize(result.exercise, 170), margin, y);

      y += 20;
      doc.setFont(undefined, 'bold');
      doc.text("Lifestyle Tips:", margin, y);
      doc.setFont(undefined, 'normal');
      y += 7;
      doc.text(doc.splitTextToSize(result.lifestyle, 170), margin, y);

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text("Vitalis - Your Personalized Health Partner", margin, 280);

      doc.save("Vitalis_Health_Report.pdf");
    } catch (err) {
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="animate-fade-in">
            <h3 style={styles.stepTitle}><FiActivity /> Step 1: Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="input-group">
                <label style={styles.label}>Age</label>
                <input type="number" name="age" className="input-control" value={form.age} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label style={styles.label}>Gender</label>
                <select name="gender" className="input-control" value={form.gender} onChange={handleChange}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="input-group">
                <label style={styles.label}>Height (cm)</label>
                <input type="number" name="height" className="input-control" value={form.height} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label style={styles.label}>Weight (kg)</label>
                <input type="number" name="weight" className="input-control" value={form.weight} onChange={handleChange} />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in">
            <h3 style={styles.stepTitle}><FiHeart /> Step 2: Vitals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="input-group">
                <label style={styles.label}>Blood Pressure</label>
                <input type="text" name="blood_pressure" placeholder="120/80" className="input-control" value={form.blood_pressure} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label style={styles.label}>Blood Sugar</label>
                <input type="number" name="blood_sugar" placeholder="mg/dL" className="input-control" value={form.blood_sugar} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label style={styles.label}>Heart Rate</label>
                <input type="number" name="heart_rate" placeholder="bpm" className="input-control" value={form.heart_rate} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label style={styles.label}>Medical Conditions</label>
                <input type="text" name="conditions" placeholder="None" className="input-control" value={form.conditions} onChange={handleChange} />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-fade-in">
            <h3 style={styles.stepTitle}><FiMoon /> Step 3: Lifestyle</h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={styles.label}>Sleep (Hours)</label>
              <select name="sleep" className="input-control" value={form.sleep} onChange={handleChange}>
                {[4,5,6,7,8,9,10,11,12].map(h => <option key={h} value={h}>{h} Hours</option>)}
              </select>
            </div>
            <div>
              <label style={styles.label}>Activity Level</label>
              <div style={styles.checkboxGrid}>
                {['sedentary', 'moderate', 'active'].map(act => (
                  <label key={act} style={{ ...styles.checkItem, border: form.activity === act ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)' }}>
                    <input 
                      type="radio" 
                      name="activity" 
                      value={act} 
                      checked={form.activity === act} 
                      onChange={handleChange} 
                      style={{ display: 'none' }}
                    />
                    <span style={{ textTransform: 'capitalize' }}>{act}</span>
                    {form.activity === act && <FiCheckCircle color="var(--primary)" />}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="animate-fade-in">
            <h3 style={styles.stepTitle}><FiDroplet /> Step 4: Nutrition</h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={styles.label}>Diet Type</label>
              <div style={styles.radioGroup}>
                {['vegetarian', 'non-vegetarian', 'vegan'].map(diet => (
                  <label key={diet} style={styles.radioItem}>
                    <input type="radio" name="diet_type" value={diet} checked={form.diet_type === diet} onChange={handleChange} />
                    <span style={{ textTransform: 'capitalize' }}>{diet}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="input-group">
              <label style={styles.label}>Water Intake (L/day)</label>
              <input type="number" name="water_intake" className="input-control" value={form.water_intake} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label style={styles.label}>Dietary Notes</label>
              <textarea name="notes" className="input-control" value={form.notes} onChange={handleChange} style={{ minHeight: '80px' }} />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="animate-fade-in">
            <h3 style={styles.stepTitle}><FiZap /> Step 5: Exercise</h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={styles.label}>Exercise Type</label>
              <div style={styles.checkboxGrid}>
                {['cardio', 'strength', 'mixed'].map(type => (
                  <label key={type} style={{ ...styles.checkItem, border: form.exercise_type.includes(type) ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)' }}>
                    <input 
                      type="checkbox" 
                      name="exercise_type" 
                      value={type} 
                      checked={form.exercise_type.includes(type)} 
                      onChange={handleChange} 
                      style={{ display: 'none' }}
                    />
                    <span style={{ textTransform: 'capitalize' }}>{type}</span>
                    {form.exercise_type.includes(type) && <FiCheckCircle color="var(--primary)" />}
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="input-group">
                <label style={styles.label}>Frequency (days/week)</label>
                <input type="number" name="exercise_freq" className="input-control" value={form.exercise_freq} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label style={styles.label}>Duration (mins/session)</label>
                <input type="number" name="duration" className="input-control" value={form.duration} onChange={handleChange} />
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="animate-fade-in">
            <h3 style={styles.stepTitle}><FiShield /> Step 6: Review & Submit</h3>
            <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
              <div className="grid grid-cols-2 gap-4" style={{ fontSize: '0.9rem' }}>
                <p><strong>Age:</strong> {form.age}</p>
                <p><strong>Diet:</strong> {form.diet_type}</p>
                <p><strong>Activity:</strong> {form.activity}</p>
                <p><strong>Sleep:</strong> {form.sleep}h</p>
                <p><strong>Exercise:</strong> {form.exercise_type.join(', ')}</p>
                <p><strong>Water:</strong> {form.water_intake}L</p>
              </div>
              <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Click submit to generate your personalized health report.</p>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 0 8rem' }}>
      <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
        <FiArrowLeft /> Back to Dashboard
      </button>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {!result ? (
          <>
            <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
              <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Smart Recommendation Engine</h1>
              <div style={styles.progressContainer}>
                <div style={{ ...styles.progressFill, width: `${(step/6)*100}%` }}></div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem' }}>Step {step} of 6</p>
            </header>

            <div className="glass-panel" style={styles.formContainer}>
              {renderStep()}
              <div style={styles.footer}>
                <button 
                  onClick={handleBack} 
                  disabled={step === 1}
                  className="btn btn-secondary"
                  style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
                >
                  <FiChevronLeft /> Back
                </button>
                {step < 6 ? (
                  <button onClick={handleNext} className="btn btn-primary">
                    Next <FiChevronRight />
                  </button>
                ) : (
                  <button onClick={handleSubmit} className="btn btn-primary" disabled={loading}>
                    {loading ? 'Analyzing...' : 'Generate Smart Recommendation'}
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="animate-slide-up">
            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Your Smart Recommendations</h1>
              <p style={{ color: 'var(--text-muted)' }}>Optimized health plan based on your vitals</p>
            </header>

            <div className="grid grid-cols-1 gap-6">
              <div className="glass-panel" style={styles.resultSection}>
                <h3 style={styles.resultTitle}><FiActivity /> Health Summary</h3>
                <p>{result.summary}</p>
              </div>
              <div className="glass-panel" style={styles.resultSection}>
                <h3 style={styles.resultTitle}><FiDroplet /> Diet Suggestions</h3>
                <p>{result.diet}</p>
              </div>
              <div className="glass-panel" style={styles.resultSection}>
                <h3 style={styles.resultTitle}><FiZap /> Exercise Suggestions</h3>
                <p>{result.exercise}</p>
              </div>
              <div className="glass-panel" style={styles.resultSection}>
                <h3 style={styles.resultTitle}><FiMoon /> Lifestyle Advice</h3>
                <p>{result.lifestyle}</p>
              </div>
            </div>

            <div style={{ marginTop: '3rem', display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
              <button onClick={downloadPDF} className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>
                <FiDownload /> Download PDF Report
              </button>
              <button onClick={() => setResult(null)} className="btn btn-secondary" style={{ padding: '1rem 2.5rem' }}>
                Update Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  backBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    marginBottom: '2rem',
    padding: '0.6rem 1.2rem',
    borderRadius: '10px'
  },
  progressContainer: {
    width: '100%',
    height: '6px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '3px',
    overflow: 'hidden',
    marginTop: '1.5rem'
  },
  progressFill: {
    height: '100%',
    background: 'var(--primary)',
    transition: 'width 0.4s ease'
  },
  formContainer: {
    padding: '2.5rem',
    minHeight: '400px',
    display: 'flex',
    flexDirection: 'column'
  },
  stepTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    fontSize: '1.2rem',
    color: 'var(--primary)',
    marginBottom: '2rem'
  },
  label: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '0.8rem',
    display: 'block'
  },
  footer: {
    marginTop: 'auto',
    paddingTop: '3rem',
    display: 'flex',
    justifyContent: 'space-between'
  },
  checkboxGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem'
  },
  checkItem: {
    padding: '1rem',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.9rem',
    transition: 'all 0.2s'
  },
  radioGroup: {
    display: 'flex',
    gap: '1.5rem'
  },
  radioItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.95rem'
  },
  resultSection: {
    padding: '2rem'
  },
  resultTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    fontSize: '1.1rem',
    color: 'var(--primary)',
    marginBottom: '1rem'
  }
};

export default RecommendationPage;
