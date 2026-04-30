import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import HealthForm from './pages/HealthForm';
import Recommendations from './pages/Recommendations';
import Profile from './pages/Profile';
import DietPlanner from './pages/DietPlanner';
import ReportAnalyzer from './pages/ReportAnalyzer';
import HealthTrends from './pages/HealthTrends';
import Chat from './pages/Chat';
import RecommendationPage from './pages/RecommendationPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  
  if (loading) return null;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="main-layout">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/profile/new" element={<ProtectedRoute><HealthForm /></ProtectedRoute>} />
            <Route path="/recommendations/:profileId" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
            <Route path="/diet-planner" element={<ProtectedRoute><DietPlanner /></ProtectedRoute>} />
            <Route path="/report-analyzer" element={<ProtectedRoute><ReportAnalyzer /></ProtectedRoute>} />
            <Route path="/health-trends" element={<ProtectedRoute><HealthTrends /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/recommendation" element={<ProtectedRoute><RecommendationPage /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
