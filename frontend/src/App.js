import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { useSocket } from './hooks/useSocket.js';
import { Navbar } from './components/Navbar.js';
import { PrivateRoute } from './components/PrivateRoute.js';

import { LandingPage } from './pages/LandingPage.js';
import { BrowsePage } from './pages/BrowsePage.js';
import { DonorLoginPage } from './pages/DonorLoginPage.js';
import { CaretakerLoginPage } from './pages/CaretakerLoginPage.js';
import { AdminLoginPage } from './pages/AdminLoginPage.js';
import { DonorRegisterPage } from './pages/DonorRegisterPage.js';
import { CaretakerRegisterPage } from './pages/CaretakerRegisterPage.js';
import { HomePage } from './pages/HomePage.js';
import { RequestDetailPage } from './pages/RequestDetailPage.js';
import { CreateRequestPage } from './pages/CreateRequestPage.js';
import { CaretakerDashboardPage } from './pages/CaretakerDashboardPage.js';
import { DonorDashboardPage } from './pages/DonorDashboardPage.js';
import { AdminDashboardPage } from './pages/AdminDashboardPage.js';

import './styles/global.css';

function AppContent() {
  const { user, loading } = useAuth();
  const socket = useSocket();

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <>
      {user && <Navbar socket={socket} />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        
        {/* Donor Routes */}
        <Route path="/donor-login" element={<DonorLoginPage />} />
        <Route path="/donor-register" element={<DonorRegisterPage />} />
        
        {/* Caretaker Routes */}
        <Route path="/caretaker-login" element={<CaretakerLoginPage />} />
        <Route path="/caretaker-register" element={<CaretakerRegisterPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin-login" element={<AdminLoginPage />} />

        {/* Authenticated Routes */}
        <Route path="/home" element={user ? <HomePage socket={socket} /> : <Navigate to="/" />} />
        <Route path="/request/:id" element={<RequestDetailPage socket={socket} />} />

        {/* Caretaker Dashboard Routes */}
        <Route
          path="/caretaker/create-request"
          element={
            <PrivateRoute requiredRole="caretaker">
              <CreateRequestPage socket={socket} />
            </PrivateRoute>
          }
        />
        <Route
          path="/caretaker/dashboard"
          element={
            <PrivateRoute requiredRole="caretaker">
              <CaretakerDashboardPage />
            </PrivateRoute>
          }
        />

        {/* Donor Dashboard Routes */}
        <Route
          path="/donor/dashboard"
          element={
            <PrivateRoute requiredRole="donor">
              <DonorDashboardPage />
            </PrivateRoute>
          }
        />

        {/* Admin Dashboard Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute requiredRole="admin">
              <AdminDashboardPage />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
