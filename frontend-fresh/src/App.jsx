// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Homepage from './components/Homepage';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import ProjectHub from './components/ProjectHub';
import BIMViewer from './components/BIMViewer';
import DesignStudio from './components/DesignStudio';
import ContentStudio from './components/ContentStudio';
import Geospatial from './components/Geospatial';
import ThermalAnalysis from './components/ThermalAnalysis';
import VRARCollaboration from './components/VRARCollaboration';
import MyAccount from './components/MyAccount';
import CEO from './components/CEO';
import styled from 'styled-components';

// Protected Route for General Authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

// Protected Route for CEO
const CEOProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user && user.role !== 'CEO') return <Navigate to="/dashboard" replace />;
  return children;
};

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

function App() {
  return (
    <AppContainer>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
              <Route index element={<ProjectHub />} />
              <Route path="projecthub" element={<ProjectHub />} />
              <Route path="bim" element={<BIMViewer />} />
              <Route path="design" element={<DesignStudio />} />
              <Route path="content" element={<ContentStudio />} />
              <Route path="geospatial" element={<Geospatial />} />
              <Route path="thermal" element={<ThermalAnalysis />} />
              <Route path="vrar" element={<VRARCollaboration />} />
              <Route path="my-account" element={<MyAccount />} />
              <Route path="ceo" element={<CEOProtectedRoute><CEO /></CEOProtectedRoute>} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </AppContainer>
  );
}

export default App;