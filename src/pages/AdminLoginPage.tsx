import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { royalEdgeService } from '../services/api';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated with ROLE_ADMIN, immediately redirect to admin dashboard
  useEffect(() => {
    if (royalEdgeService.isAdminAuthenticated()) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const fromLocation = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await royalEdgeService.adminLogin(password);
      if (result.success) {
        // Redirect to admin dashboard
        navigate(fromLocation, { replace: true });
      } else {
        setError(result.error || 'Invalid administrator password.');
      }
    } catch {
      setError('An error occurred during authentication. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-screen">
      <div className="admin-login-box">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="admin-login-back-btn"
        >
          <ArrowLeft size={16} />
          <span>Return to Public Website</span>
        </button>

        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="login-logo-frame">
              <img
                src="/royal-edge-logo.jpg"
                alt="Royal Edge Enterprises"
                className="login-logo-img"
              />
            </div>
            <h1 className="login-title">Operations Portal</h1>
            <p className="login-desc">
              Restricted access for catalogue management, customer inquiries, private quotation generation, and order processing.
            </p>
          </div>

          {error && (
            <div className="login-error-alert" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="adminPassword">Administrator Password</label>
              <div className="login-input-wrap">
                <Lock size={17} className="lock-icon" />
                <input
                  id="adminPassword"
                  type="password"
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  autoFocus
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary login-btn">
              <span>{isLoading ? 'Verifying...' : 'Sign In to Dashboard'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="login-security-notice">
            <ShieldCheck size={16} className="notice-icon" />
            <div className="notice-text">
              <strong>PRD Security Baseline:</strong> Public visitors cannot access internal pricing slabs or quotation records without authorization.
              <div className="demo-hint">
                <span>Demo Passcode: </span>
                <code>admin123</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
