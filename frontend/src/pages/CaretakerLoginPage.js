import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import '../styles/Auth.css';

export const CaretakerLoginPage = () => {
  const [email, setEmail] = useState('caretaker@example.com');
  const [password, setPassword] = useState('caretaker123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      const user = result.user || result;
      
      if (user.role !== 'caretaker') {
        throw new Error('This account is not a caretaker account');
      }
      
      navigate('/caretaker/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>🏛️ Caretaker Login</h1>
            <p>Login to manage your institution's needs</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Logging in...' : 'Caretaker Login'}
            </button>
          </form>

          <div className="auth-footer">
            <p>New caretaker? <Link to="/caretaker-register">Register here</Link></p>
            <p>Are you a donor? <Link to="/donor-login">Donor Login</Link></p>
            <p><Link to="/">Back to Home</Link></p>
          </div>

        </div>
      </div>
    </div>
  );
};
