import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiUploadCloud, FiFileText, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import apiClient from '../api/apiClient';

const ReportAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type !== 'application/pdf') {
      setError('Only PDF files are supported.');
      return;
    }
    setFile(selected);
    setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type !== 'application/pdf') {
      setError('Only PDF files are supported.');
      return;
    }
    setFile(dropped);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    setAnalyzing(true);
    setError('');

    // Safe vitals retrieval
    let vitals = { age: 25, weight: 70, height: 175 };
    try {
      const saved = sessionStorage.getItem('userVitals');
      if (saved && saved !== 'undefined') {
        vitals = { ...vitals, ...JSON.parse(saved) };
      }
    } catch { /* use defaults */ }

    const formData = new FormData();
    formData.append('report', file);
    Object.keys(vitals).forEach(key => formData.append(key, vitals[key]));

    // Get token directly from sessionStorage for reliability
    const token = sessionStorage.getItem('token');

    try {
      const response = await apiClient.post(
        '/recommendations',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setFeedback(response.data.recommendations || 'Analysis complete. No specific flags found.');
      setDone(true);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to analyze. Please try again.';
      setError(`Error: ${msg}`);
      console.error('Upload error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="container animate-fade-in content-wrapper min-h-screen pb-24">
      <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        <FiChevronLeft /> Back to Dashboard
      </Link>

      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>AI Report Analyzer</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
          Upload your blood reports or medical summaries. Vitalis AI will read and analyze them for you.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
        {!done ? (
          <>
            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragging ? 'var(--primary)' : 'rgba(255,255,255,0.15)'}`,
                borderRadius: '16px',
                padding: '3rem 2rem',
                marginBottom: '2rem',
                background: dragging ? 'rgba(14,165,233,0.05)' : 'rgba(255,255,255,0.02)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onClick={() => document.getElementById('report-upload').click()}
            >
              <FiUploadCloud size={56} color={dragging ? 'var(--primary)' : 'var(--text-muted)'} style={{ marginBottom: '1rem', transition: 'all 0.3s' }} />
              <p style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.4rem' }}>
                {file ? file.name : 'Drag & drop your PDF here'}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {file ? `${(file.size / 1024).toFixed(1)} KB · PDF` : 'or click to browse — PDF only, max 10MB'}
              </p>
            </div>

            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="report-upload"
            />

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', justifyContent: 'center', marginBottom: '1rem' }}>
                <FiAlertCircle /> {error}
              </div>
            )}

            {analyzing && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Vitalis AI is reading your report...</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <label htmlFor="report-upload" className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                <FiFileText /> {file ? 'Change File' : 'Select PDF'}
              </label>
              <button
                className="btn btn-primary"
                onClick={handleUpload}
                disabled={analyzing || !file}
                style={{ opacity: (!file || analyzing) ? 0.5 : 1 }}
              >
                {analyzing ? 'Analyzing...' : 'Start Analysis'}
              </button>
            </div>
          </>
        ) : (
          <div className="animate-fade-in" style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <FiCheckCircle size={48} color="var(--success)" />
              <div>
                <h3 style={{ margin: 0 }}>Analysis Complete</h3>
                <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>{file?.name}</p>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', background: 'rgba(16,185,129,0.05)', borderLeft: '4px solid var(--success)', marginBottom: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--success)' }}>Vitalis AI Feedback & Observations</h4>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.9', whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>
                {feedback}
              </p>
            </div>

            <div style={{ padding: '1rem', background: 'rgba(59,130,246,0.05)', borderRadius: '12px', border: '1px solid rgba(59,130,246,0.1)', marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--primary)', margin: 0 }}>
                <strong>Note:</strong> This analysis is AI-generated and is not a substitute for professional medical advice. Always consult a licensed physician.
              </p>
            </div>

            <button className="btn btn-secondary" onClick={() => { setDone(false); setFile(null); setFeedback(''); }}>
              <FiUploadCloud /> Upload Another Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh'
  }
};

export default ReportAnalyzer;

