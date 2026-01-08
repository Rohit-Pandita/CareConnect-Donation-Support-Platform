import { useAuth } from '../context/AuthContext.js';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { NotificationPanel } from './NotificationPanel.js';
import '../styles/Navbar.css';

export const Navbar = ({ socket }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <h1>🤝 CareConnect</h1>
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>

          {user.role === 'caretaker' && (
            <>
              <Link to="/caretaker/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/caretaker/create-request" className="nav-link">Create Request</Link>
            </>
          )}

          {user.role === 'donor' && (
            <>
              <Link to="/donor/dashboard" className="nav-link">My Donations</Link>
            </>
          )}

          {user.role === 'admin' && (
            <>
              <Link to="/admin/dashboard" className="nav-link">Admin Dashboard</Link>
            </>
          )}
        </div>

        <div className="nav-right">
          <div className="notification-wrapper">
            <button
              className="notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              🔔
            </button>
            <NotificationPanel
              socket={socket}
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>

          <div className="user-menu">
            <span className="user-name">{user.fullName || user.email}</span>
            <span className="user-role">{user.role}</span>
          </div>

          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
