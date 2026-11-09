import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { royalEdgeService } from '../../services/api';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onReturnHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onReturnHome }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await royalEdgeService.adminLogin(password);
    if (result.success) {
      onLoginSuccess();
    } else {
      setError(result.error || 'Invalid admin credentials. Please enter the authorized password.');
    }
  };

  return (
    <div className="admin-login-screen">
      <div className="admin-login-box">
        <button
          type="button"
          onClick={onReturnHome}
          className="admin-login-back-btn"
        >
          <ArrowLeft size={16} />
          <span>Back to Royal Edge Website</span>
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
              Authorized access for catalogue management, customer inquiries, private quotation generation, and order processing.
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

            <button type="submit" className="btn-primary login-btn">
              <span>Sign In to Dashboard</span>
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
