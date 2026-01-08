import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

export const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="landing-container">
        {/* Header */}
        <header className="landing-header">
          <h1 className="logo">CareConnect</h1>
          <p className="tagline">Connecting Donors with Those in Need</p>
        </header>

        {/* Hero Section */}
        <section className="hero">
          <h2>Welcome to CareConnect</h2>
          <p>A platform dedicated to connecting generous donors with institutions that need support</p>
        </section>

        {/* Main Content */}
        <section className="landing-content">
          <div className="features">
            <div className="feature-card">
              <h3>📦 Browse Requests</h3>
              <p>Discover donation requests from orphanages, schools, and charitable institutions</p>
            </div>
            <div className="feature-card">
              <h3>💝 Make a Difference</h3>
              <p>Help those in need by accepting and delivering donations</p>
            </div>
            <div className="feature-card">
              <h3>🤝 Connect & Support</h3>
              <p>Build meaningful connections with institutions and donors</p>
            </div>
          </div>

          {/* Auth Options */}
          <div className="auth-section">
            <div className="auth-container">
              <div className="auth-option donor-option">
                <h3>💝 I want to donate</h3>
                <p>Help institutions by making donations</p>
                <div className="auth-buttons">
                  <Link to="/donor-login" className="btn btn-primary">Donor Login</Link>
                  <Link to="/donor-register" className="btn btn-secondary">Donor Register</Link>
                </div>
              </div>

              <div className="divider">OR</div>

              <div className="auth-option caretaker-option">
                <h3>🏛️ I manage an institution</h3>
                <p>Request support for your institution</p>
                <div className="auth-buttons">
                  <Link to="/caretaker-login" className="btn btn-primary">Caretaker Login</Link>
                  <Link to="/caretaker-register" className="btn btn-secondary">Caretaker Register</Link>
                </div>
              </div>

              <div className="divider">OR</div>

              <div className="auth-option admin-option">
                <h3>🔐 Admin Access</h3>
                <p>Login as an administrator</p>
                <Link to="/admin-login" className="btn btn-danger">Admin Login</Link>
              </div>
            </div>
          </div>

          {/* Browse as Guest */}
          <div className="guest-section">
            <p>Want to browse requests first?</p>
            <Link to="/browse" className="btn btn-outline">Browse Requests</Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          <p>&copy; 2025 CareConnect. Making a difference, one donation at a time.</p>
        </footer>
      </div>
    </div>
  );
};
