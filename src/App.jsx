import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadResource from './pages/UploadResource';
import AllResources from './pages/AllResources';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated } from './utils/auth';

function App() {
  const [authenticated, setAuthenticated] = React.useState(isAuthenticated());

  // Listen for token changes (login/logout)
  React.useEffect(() => {
    const onStorage = () => setAuthenticated(isAuthenticated());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar authenticated={authenticated} setAuthenticated={setAuthenticated} />
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={!authenticated ? <Login setAuthenticated={setAuthenticated} /> : <Navigate to="/dashboard" replace />} 
          />
          <Route 
            path="/register" 
            element={!authenticated ? <Register setAuthenticated={setAuthenticated} /> : <Navigate to="/dashboard" replace />} 
          />
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/upload" element={
            <ProtectedRoute>
              <UploadResource />
            </ProtectedRoute>
          } />
          <Route path="/resources" element={
            <ProtectedRoute>
              <AllResources />
            </ProtectedRoute>
          } />
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;