import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { FiChevronLeft, FiActivity, FiZap, FiAlertTriangle, FiList } from 'react-icons/fi';

const Recommendations = () => {
  const { profileId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await apiClient.get('/recommendations/latest');
        if (response.data.data) {
          console.log("FULL RESPONSE:", response.data.data.recommendations);
          setData(response.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem' }}>Generating your Personalized Plan...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem', maxWidth: '500px', margin: '0 auto' }}>
          <FiAlertTriangle size={48} color="var(--danger)" style={{ marginBottom: '1rem' }} />
          <h2>Issue Loading Plan</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{error || "No data found."}</p>
          <Link to="/dashboard" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in content-wrapper">
      <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        <FiChevronLeft /> Back to Dashboard
      </Link>

      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Your Personalized Plan</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
          Clinically-informed Smart Insights based on your unique profile.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        {(() => {
          let fullText;
          try {
            const parsed = JSON.parse(data?.recommendations);
            fullText = typeof parsed === 'object' ? (parsed.text || data?.recommendations) : parsed;
          } catch {
            fullText = data?.recommendations;
          }

          if (fullText && fullText.length > 20) {
            return (
              <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: '1.8', fontSize: '1.1rem', color: '#e2e8f0' }}>
                {fullText}
              </div>
            );
          }
          return <p style={{ color: 'var(--text-muted)' }}>No detailed plan available.</p>;
        })()}
      </div>
    </div>
  );
};

const styles = {
  recoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem'
  },
  recoCard: {
    padding: '2rem',
    background: 'rgba(15, 23, 42, 0.4)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '20px',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.02)'
    }
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    color: 'var(--primary)',
    marginBottom: '1.5rem',
    fontSize: '1.2rem',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '1rem'
  },
  recoContent: {
    fontSize: '1.05rem',
    lineHeight: '1.8',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    color: 'var(--text-main)'
  }
};

export default Recommendations;
