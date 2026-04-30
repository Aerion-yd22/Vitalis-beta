import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <h3 style={{ color: 'var(--danger)' }}>Insights temporarily unavailable</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>We're working on fixing this section.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
