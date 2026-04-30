import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { AuthContext } from '../contexts/AuthContext';
import FitnessPlan from '../components/FitnessPlan';
import GoalEngine from '../components/GoalEngine';
import SmartInsights from '../components/SmartInsights';
import ErrorBoundary from '../components/ErrorBoundary';
import DailyCheckIn from '../components/DailyCheckIn';
import { 
  FiActivity, FiCheckCircle, FiList, FiPlus, FiDroplet, 
  FiCheckSquare, FiCalendar, FiTrendingUp, FiTrendingDown, 
  FiMessageSquare, FiSun, FiWind, FiThermometer, FiAlertTriangle,
  FiMoon, FiZap, FiEdit3, FiShield, FiLogOut, FiDownload, FiPieChart
} from 'react-icons/fi';

import DashboardDiet from '../components/DashboardDiet';
import WearableIntegration from '../components/WearableIntegration';


const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [env, setEnv] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [dietData, setDietData] = useState(null);
  const [insightsData, setInsightsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dietLoading, setDietLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Analyzing your health...");
  const [coords, setCoords] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherSuggestions, setWeatherSuggestions] = useState([]);
  const [locationName, setLocationName] = useState("Your Location");
  const [isDownloading, setIsDownloading] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        () => {
          setWeatherData({ temp: 25, humidity: 50, uv: 3, condition: "Clear" });
          setWeatherSuggestions(["Location unavailable. Showing general recommendations."]);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (!coords) return;

    const fetchWeatherData = async () => {
      try {
        // 1. Fetch Weather
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,weather_code,uv_index`);
        const weatherJson = await weatherRes.json();
        
        // 2. Fetch City Name (Reverse Geocoding)
        let cityName = `${coords.lat.toFixed(2)}°, ${coords.lon.toFixed(2)}°`;
        try {
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lon}&format=json&accept-language=en`, {
            headers: { 'User-Agent': 'VitalisHealthApp' }
          });
          const geoJson = await geoRes.json();
          cityName = geoJson.address.city || geoJson.address.town || geoJson.address.village || geoJson.address.suburb || cityName;
        } catch (e) { console.warn("Geocoding failed"); }
        
        if (weatherJson.current) {
          const current = weatherJson.current;
          const wData = {
            temp: Math.round(current.temperature_2m),
            humidity: current.relative_humidity_2m,
            uv: Math.round(current.uv_index),
            code: current.weather_code
          };
          setWeatherData(wData);

          // Rule-based suggestions
          const tips = [];
          if (wData.temp > 35) tips.push("High heat detected. Stay hydrated.");
          if (wData.humidity > 70) tips.push("High humidity may cause fatigue.");
          if (wData.uv > 7) tips.push("High UV levels. Use SPF 30+.");
          if (wData.temp < 10) tips.push("Cold weather. Dress in layers.");
          
          if (tips.length === 0) tips.push("Weather looks great! Enjoy your day.");
          setWeatherSuggestions(tips);
          setLocationName(cityName);
        }
      } catch (err) {
        console.error("Weather fetch failed", err);
        setWeatherSuggestions(["Unable to fetch weather."]);
      }
    };

    fetchWeatherData();
  }, [coords]);

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    try {
      const response = await apiClient.get('/report/download', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Vitalis_Health_Report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed", err);
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRegenerateDiet = async () => {
    setDietLoading(true);
    try {
      const res = await apiClient.post('/diet/generate');
      if (res.data.success) {
        setDietData(res.data.plan);
      }
    } catch (err) {
      console.error("Failed to generate diet", err);
    } finally {
      setDietLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchWithTimeout = async (url, options = {}, timeout = 5000) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        try {
          const response = await apiClient.get(url, { ...options, signal: controller.signal });
          clearTimeout(id);
          return response;
        } catch (e) {
          clearTimeout(id);
          throw e;
        }
      };

      try {
        // Initial core data with timeout
        console.log("Dashboard: Fetching core data...");
        try {
          const [recoRes, profileRes, envRes, alertsRes] = await Promise.all([
            fetchWithTimeout('/recommendations/latest'),
            fetchWithTimeout('/user/profile'),
            fetchWithTimeout('/user/environment'),
            fetchWithTimeout('/user/alerts')
          ]);

          if (recoRes.data.data) {
            setData(recoRes.data.data);
            console.log("Dashboard: Vitals loaded");
          }
          if (profileRes.data.profile) {
            setProfile(profileRes.data.profile);
            console.log("Dashboard: Profile loaded");
          }
          if (envRes.data.success) {
            setEnv(envRes.data);
            console.log("Dashboard: Environment loaded");
          }
          if (alertsRes.data.alerts) {
            setAlerts(alertsRes.data.alerts);
            console.log("Dashboard: Alerts loaded");
          }
        } catch (e) {
          console.warn("Dashboard: Core data fetch partially failed", e.message);
        }

        // Fetch Diet and Insights with individual timeouts
        console.log("Dashboard: Fetching Diet and Insights...");
        try {
          const dietRes = await fetchWithTimeout("/diet");
          if (dietRes.data.success) {
            setDietData(dietRes.data.data);
            console.log("Dashboard: Diet Planner loaded");
          }
        } catch (e) { console.warn("Dashboard: Diet fetch failed"); }

        try {
          const insightsRes = await fetchWithTimeout("/insights");
          if (insightsRes.data.success) {
            setInsightsData(insightsRes.data.data);
            console.log("Dashboard: Smart Insights loaded");
          }
        } catch (e) { console.warn("Dashboard: Insights fetch failed"); }

      } catch (err) {
        console.error("Dashboard: Critical Fetch Error:", err);
      } finally {
        setLoading(false);
        console.log("Dashboard: Initialization complete");
      }

    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="container" style={{ padding: '8rem', textAlign: 'center' }}>
      <div className="loader"></div>
      <p style={{ marginTop: '2rem', fontSize: '1.2rem', color: 'var(--text-muted)' }}>Loading dashboard...</p>
    </div>
  );

  const bmi = data?.bmi || 0;
  const getBmiCategory = (b) => {
    if (b < 18.5) return { label: 'Underweight', color: 'var(--warning)', status: 'Risk' };
    if (b < 25) return { label: 'Normal', color: 'var(--success)', status: 'Normal' };
    if (b < 30) return { label: 'Overweight', color: 'var(--warning)', status: 'Risk' };
    return { label: 'Obese', color: 'var(--danger)', status: 'Risk' };
  };

  const bmiData = getBmiCategory(bmi);
  const trend = data?.trend || { weight_change: 0, bmi_change: 0 };
  
  const parseInsights = (text) => {
    if (!text) return null;
    const parts = text.split("STRUCTURED_INSIGHTS");
    if (parts.length < 2) return null;
    try {
      let jsonStr = parts[1].trim().replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(jsonStr);
    } catch (e) { return null; }
  };

  const aiInsights = parseInsights(data?.recommendations);
  const userFromStorage = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen pb-24">
      {/* Sidebar Controls */}
      <button onClick={() => { logout(); navigate('/login'); }} style={styles.logoutBtn} className="glass-panel"><FiLogOut /> Logout</button>
      <button onClick={() => navigate('/chat')} style={styles.chatBtn}><FiMessageSquare /> Open Health Assistant</button>

      <div className="container content-wrapper animate-fade-in">
        {/* Environment & Weather Alert */}
        {weatherData && (
          <div style={styles.alertBanner}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={styles.alertItem}>
                <FiActivity color="var(--primary)" /> 
                <span style={{ fontWeight: '700' }}>{locationName}</span> · {weatherData.temp}°C · {weatherData.humidity}% Humidity
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>UV Index: {weatherData.uv}</span>
                <div style={{ padding: '0.3rem 0.8rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '20px', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600' }}>
                  {weatherSuggestions[0]}
                </div>
              </div>
            </div>
            {weatherSuggestions.length > 1 && (
              <div style={{ marginTop: '0.8rem', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem' }}>
                {weatherSuggestions.slice(1).join(" | ")}
              </div>
            )}
          </div>
        )}

        {/* Header */}
        <header style={styles.header}>
          <div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Welcome back, <span style={{ color: 'var(--primary)' }}>{userFromStorage?.full_name?.split(' ')[0] || 'User'}</span>!</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiCalendar /> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </header>

        {/* Core Vitals Grid */}
        <div style={styles.dashboardGrid}>
          <div className="glass-panel" style={styles.card}>
            <h3 style={styles.cardTitle}><FiActivity /> Vitals Overview</h3>
            <div style={styles.bmiDisplay}>
              <div style={{ color: 'var(--text-muted)' }}>Weight: {data?.weight}kg | Height: {data?.height}cm</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: bmiData.color }}>{bmiData.label} (BMI: {parseFloat(bmi).toFixed(1)})</div>
            </div>
          </div>

          {/* New Navigation-Based Recommendation Trigger */}
          <div className="glass-panel" style={{ ...styles.card, background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/recommendation')}>
            <div style={{ textAlign: 'center' }}>
              <FiZap size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Detailed Smart Recommendations</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Update your vitals and lifestyle data for a comprehensive health analysis.</p>
              <button className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
                <FiActivity /> Generate Now
              </button>
            </div>
          </div>

        </div>

        {/* Existing Components */}
        <FitnessPlan />
        {/* HEALTH OPTIMIZATION HUB */}
        <div className="glass-panel" style={{ marginTop: '3rem', padding: '2.5rem', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Health Optimization Hub</h2>
            <p style={{ color: 'var(--text-muted)' }}>Your personalized journey from goal to results</p>
          </div>

          {/* STEP 1: GOAL */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-15px', left: '20px', background: 'var(--primary)', color: 'white', padding: '2px 12px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold' }}>STEP 1</div>
            <GoalEngine />
          </div>

          {/* FLOW CUE 1 */}
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>↓</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px' }}>Based on your goal, here's your diet</div>
          </div>

          {/* STEP 2: DIET */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-15px', left: '20px', background: 'var(--secondary)', color: 'white', padding: '2px 12px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold' }}>STEP 2</div>
            <div className="glass-panel" style={{ padding: '2rem' }}>
              {dietData ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ color: 'var(--primary)', margin: 0 }}>Your Daily Plan</h2>
                    <button onClick={handleRegenerateDiet} className="btn-icon" title="Regenerate Plan" style={{ background: 'rgba(59, 130, 246, 0.1)', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: 'var(--primary)' }}>
                      <FiZap />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['breakfast', 'lunch', 'dinner', 'snacks'].map((meal) => {
                      const mealInfo = dietData[meal];
                      if (!mealInfo) return null;
                      
                      const items = Array.isArray(mealInfo.items) ? mealInfo.items : [];
                      
                      return (
                        <div key={meal} className="glass-panel" style={{ padding: '1.5rem', borderLeft: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s ease' }}>
                          <h3 style={{ fontSize: '1.1rem', textTransform: 'capitalize', marginBottom: '1.2rem', color: 'var(--primary)' }}>{meal}</h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {items.map((item, idx) => {
                              const itemId = `${meal}-${idx}`;
                              const isItemChecked = checkedItems?.[itemId] || false;
                              return (
                                <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                                  <input 
                                    type="checkbox" 
                                    checked={isItemChecked} 
                                    onChange={() => setCheckedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }))}
                                    style={{ accentColor: 'var(--success)', width: '16px', height: '16px', cursor: 'pointer' }}
                                  />
                                  <span style={{ color: isItemChecked ? 'var(--success)' : 'var(--text-white)', textDecoration: isItemChecked ? 'line-through' : 'none', opacity: isItemChecked ? 0.6 : 1, transition: 'all 0.2s' }}>
                                    {item}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                          <div style={{ marginTop: '1.2rem', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.8rem' }}>
                            {mealInfo.calories || 0} kcal | P: {mealInfo.protein || 0}g
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* NUTRITION INTAKE SUMMARY */}
                  <div className="glass-panel" style={{ marginTop: '2.5rem', padding: '2rem', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                      <FiPieChart color="var(--primary)" />
                      <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Real-time Intake Summary</h3>
                    </div>
                    
                    {(() => {
                      const intake = { calories: 0, protein: 0, carbs: 0 };
                      
                      ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(meal => {
                        const mealInfo = dietData[meal];
                        if (!mealInfo) return;
                        const items = Array.isArray(mealInfo.items) ? mealInfo.items : [];
                        const itemCount = items.length || 1;
                        
                        items.forEach((_, idx) => {
                          if (checkedItems?.[`${meal}-${idx}`]) {
                            intake.calories += (mealInfo.calories || 0) / itemCount;
                            intake.protein += (mealInfo.protein || 0) / itemCount;
                            intake.carbs += (mealInfo.carbs || 0) / itemCount;
                          }
                        });
                      });

                      // Round to whole numbers
                      intake.calories = Math.round(intake.calories);
                      intake.protein = Math.round(intake.protein);
                      intake.carbs = Math.round(intake.carbs);

                      const targetCal = dietData.total?.calories || 2000;
                      const targetProt = dietData.total?.protein || 100;
                      const targetCarb = dietData.total?.carbs || 250;

                      const getPercent = (val, target) => Math.min(100, (val / (target || 1)) * 100);

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div style={styles.intakeBox}>
                            <div style={styles.intakeHeader}><span>Calories</span> <span>{intake.calories} / {targetCal}</span></div>
                            <div style={styles.progressBar}><div style={{ ...styles.progressFill, width: `${getPercent(intake.calories, targetCal)}%`, background: 'var(--primary)' }}></div></div>
                          </div>
                          <div style={styles.intakeBox}>
                            <div style={styles.intakeHeader}><span>Protein</span> <span>{intake.protein}g / {targetProt}g</span></div>
                            <div style={styles.progressBar}><div style={{ ...styles.progressFill, width: `${getPercent(intake.protein, targetProt)}%`, background: 'var(--success)' }}></div></div>
                          </div>
                          <div style={styles.intakeBox}>
                            <div style={styles.intakeHeader}><span>Carbs</span> <span>{intake.carbs}g / {targetCarb}g</span></div>
                            <div style={styles.progressBar}><div style={{ ...styles.progressFill, width: `${getPercent(intake.carbs, targetCarb)}%`, background: 'var(--warning)' }}></div></div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <h4 style={{ marginTop: '1.5rem', textAlign: 'right', color: 'var(--primary)', opacity: 0.8 }}>Daily Target: {dietData.total?.calories || '---'} kcal</h4>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>No diet plan generated yet.</p>
                  <button onClick={handleRegenerateDiet} className="btn btn-primary">Generate Daily Plan</button>
                </div>
              )}
            </div>
          </div>

          {/* FLOW CUE 2 */}
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>↓</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px' }}>Track your daily activity</div>
          </div>

          {/* STEP 3: LOGGING */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-15px', left: '20px', background: 'var(--warning)', color: 'white', padding: '2px 12px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold' }}>STEP 3</div>
            <DailyCheckIn />
          </div>

          {/* FLOW CUE 3 */}
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>↓</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px' }}>View your progress and guidance</div>
          </div>

          {/* COACHING HUB */}
          <div style={{ position: 'relative', marginTop: '2rem' }}>
            <ErrorBoundary>
              <SmartInsights data={insightsData} dietData={dietData} />
            </ErrorBoundary>
          </div>
        </div>

        {/* Context Insights */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-8">
          {[
            { title: 'Hydration', value: aiInsights?.hydration, icon: <FiDroplet />, color: '#3b82f6' },
            { title: 'Sleep', value: aiInsights?.sleep, icon: <FiMoon />, color: '#8b5cf6' },
            { title: 'Recovery', value: aiInsights?.recovery, icon: <FiZap />, color: '#f59e0b' },
            { title: 'Metabolism', value: aiInsights?.metabolism, icon: <FiActivity />, color: '#10b981' },
            { title: 'Immunity', value: aiInsights?.immunity, icon: <FiShield />, color: '#ef4444' }
          ].map((insight, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                {React.cloneElement(insight.icon, { color: insight.color })} {insight.title}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{insight.value || "Analyzing..."}</p>
            </div>
          ))}
        </div>

        {/* WEARABLE INTEGRATION (VISION FEATURE) */}
        <WearableIntegration />


      </div>
    </div>
  );
};



const styles = {
  logoutBtn: {
    position: 'fixed',
    bottom: '2rem',
    left: '2rem',
    zIndex: 1000,
    padding: '0.8rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    color: 'var(--danger)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    fontWeight: '600',
    borderRadius: '12px'
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--primary) 0%, #3b82f6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: '800',
    color: 'white',
    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
    border: '2px solid rgba(255,255,255,0.1)'
  },
  headerBtn: {
    width: '45px',
    height: '45px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--text-white)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  dropdown: {
    position: 'absolute',
    top: '120%',
    right: 0,
    width: '200px',
    background: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    padding: '0.8rem',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
    zIndex: 1100,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  dropdownItem: {
    padding: '0.8rem 1rem',
    borderRadius: '10px',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: 'transparent',
    color: 'var(--text-white)'
  },
  chatBtn: {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    zIndex: 1000,
    padding: '0.8rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    background: 'var(--primary)',
    color: 'white',
    border: 'none',
    fontWeight: '600',
    borderRadius: '30px',
    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)'
  },
  progressBar: {
    height: '6px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'all 0.5s ease'
  },
  intakeBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  intakeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase'
  },
  loadingContainer: {
    height: '80vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  alertBanner: {
    background: 'rgba(59, 130, 246, 0.05)',
    borderLeft: '4px solid var(--primary)',
    padding: '1.5rem',
    borderRadius: '12px',
    marginBottom: '2rem'
  },
  alertItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: '600'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2.5rem',
    flexWrap: 'wrap',
    gap: '1.5rem'
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
  },
  card: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column'
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '1.5rem'
  },
  bmiDisplay: {
    textAlign: 'center',
    marginBottom: '1rem'
  },
  statusBadge: (status) => ({
    alignSelf: 'center',
    padding: '0.3rem 1rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    background: status === 'Normal' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
    color: status === 'Normal' ? 'var(--success)' : 'var(--warning)',
    marginBottom: '1.5rem'
  }),
  actionPrompt: {
    marginTop: 'auto',
    textAlign: 'right',
    fontSize: '0.8rem',
    color: 'var(--primary)',
    fontWeight: '600'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginTop: '1rem'
  },
  statBox: {
    padding: '1rem',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    textAlign: 'center'
  },
  statLabel: {
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    marginBottom: '0.4rem'
  },
  statValue: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--text-main)'
  },
  insightCol: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  insightTitle: {
    fontSize: '0.9rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem'
  },
  insightText: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    lineHeight: '1.6'
  }
};

export default Dashboard;
