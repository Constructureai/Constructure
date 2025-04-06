import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Homepage from './components/Homepage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/features" element={<div>Features Page</div>} />
          <Route path="/subscribe" element={<div>Subscribe Page</div>} />
          <Route path="/pricing" element={<div>Pricing Page</div>} />
          <Route path="/about" element={<div>About Us Page</div>} />
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;