import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from './AuthService';
import { AppContext } from '../Context/Context';

const Login = () => {
  const navigate = useNavigate();
  const { user, authLogin } = useContext(AppContext);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false
  });
  const [status, setStatus] = useState({
    loading: false,
    error: '',
    success: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error/success when user starts typing again
    if (status.error || status.success) {
      setStatus({ loading: false, error: '', success: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    try {
      const response = await login(formData);
      setStatus({ loading: false, error: '', success: 'Login successful! Redirecting...' });
      authLogin(response.data.jwtToken);
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      const message =
        error?.response?.status === 401
          ? 'Invalid username or password. Please try again.'
          : error?.response?.data?.message
          ? error.response.data.message
          : 'Something went wrong. Please try again later.';
      setStatus({ loading: false, error: message, success: '' });
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      paddingTop: '80px'
    },
    loginContainer: {
      maxWidth: '450px',
      margin: '0 auto',
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      padding: '40px'
    },
    header: { marginBottom: '30px' },
    title: {
      fontSize: '28px',
      color: '#333',
      marginBottom: '8px',
      fontWeight: '600'
    },
    subtitle: { color: '#666', fontSize: '14px' },
    formGroup: { marginBottom: '20px' },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#333',
      fontSize: '14px',
      fontWeight: '500'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      transition: 'border-color 0.2s',
      outline: 'none',
      boxSizing: 'border-box'
    },
    inputError: {
      border: '1px solid #dc3545'
    },
    formOptions: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      fontSize: '14px'
    },
    rememberMe: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      color: '#666'
    },
    checkbox: { width: '16px', height: '16px', cursor: 'pointer' },
    forgotPassword: {
      color: '#28a745',
      textDecoration: 'none',
      transition: 'color 0.2s'
    },
    loginBtn: {
      width: '100%',
      padding: '12px',
      backgroundColor: status.loading ? '#6c8ebf' : '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: status.loading ? 'not-allowed' : 'pointer',
      transition: 'background-color 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    },
    // --- Feedback banners ---
    alertBase: {
      padding: '12px 16px',
      borderRadius: '4px',
      fontSize: '14px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    alertError: {
      backgroundColor: '#fdf2f2',
      border: '1px solid #f5c6cb',
      color: '#842029'
    },
    alertSuccess: {
      backgroundColor: '#f0faf4',
      border: '1px solid #a3d9b1',
      color: '#1a6633'
    },
    // --- Spinner ---
    spinner: {
      width: '18px',
      height: '18px',
      border: '2px solid rgba(255,255,255,0.4)',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      flexShrink: 0
    },
    divider: {
      textAlign: 'center',
      margin: '24px 0',
      position: 'relative'
    },
    dividerLine: {
      position: 'absolute',
      left: 0,
      top: '50%',
      width: '100%',
      height: '1px',
      backgroundColor: '#e5e5e5'
    },
    dividerText: {
      backgroundColor: 'white',
      padding: '0 12px',
      color: '#999',
      fontSize: '14px',
      position: 'relative',
      zIndex: 1
    },
    signupLink: {
      textAlign: 'center',
      color: '#666',
      fontSize: '14px'
    },
    link: {
      color: '#28a745',
      textDecoration: 'none',
      fontWeight: '500',
      cursor: 'pointer'
    }
  };

  return (
    <>
      {/* Inject keyframe for spinner */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={styles.container}>
        <div style={styles.loginContainer}>
          <div style={styles.header}>
            <h1 style={styles.title}>Welcome Back</h1>
            <p style={styles.subtitle}>Please login to your account</p>
          </div>

          {/* ---- Error Banner ---- */}
          {status.error && (
            <div style={{ ...styles.alertBase, ...styles.alertError }}>
              <span>⚠️</span>
              <span>{status.error}</span>
            </div>
          )}

          {/* ---- Success Banner ---- */}
          {status.success && (
            <div style={{ ...styles.alertBase, ...styles.alertSuccess }}>
              <span>✅</span>
              <span>{status.success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>User name</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                style={{
                  ...styles.input,
                  ...(status.error ? styles.inputError : {})
                }}
                disabled={status.loading}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                style={{
                  ...styles.input,
                  ...(status.error ? styles.inputError : {})
                }}
                disabled={status.loading}
                required
              />
            </div>

            <div style={styles.formOptions}>
              <label style={styles.rememberMe}>
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  style={styles.checkbox}
                  disabled={status.loading}
                />
                Remember me
              </label>
              <a href="/forgot-password" style={styles.forgotPassword}>
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              style={styles.loginBtn}
              disabled={status.loading}
            >
              {status.loading && <span style={styles.spinner} />}
              {status.loading ? 'Verifying...' : 'Login'}
            </button>
          </form>

          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
          </div>

          <div style={styles.signupLink}>
            Don't have an account?{' '}
            <span style={styles.link} onClick={() => navigate('/register')}>
              Sign up
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;