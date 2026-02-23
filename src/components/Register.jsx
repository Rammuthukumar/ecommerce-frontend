import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from './AuthService';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    terms: false
  });

  const [errors, setErrors] = useState({});
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

    // Clear field-level error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Clear global status banner when user edits anything
    if (status.error || status.success) {
      setStatus({ loading: false, error: '', success: '' });
    }
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = '';

    switch (name) {
      case 'email':
        if (!validateEmail(value)) error = 'Please enter a valid email address';
        break;
      case 'password':
        if (!validatePassword(value)) error = 'Password does not meet requirements';
        break;
      case 'confirmPassword':
        if (value !== formData.password) error = 'Passwords do not match';
        break;
      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run all validations before submitting
    const newErrors = {};
    if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!validatePassword(formData.password)) newErrors.password = 'Password does not meet requirements';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.terms) newErrors.terms = 'You must accept the terms and conditions';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStatus({ loading: true, error: '', success: '' });

    try {
     // console.log(formData);
      const response = await register(formData);
      //console.log(response.data);
      console.log(response);
      if(response.status === 200) {
        setStatus({ loading: false, error: '', success: 'Account created! Redirecting to verify your email...' });
        setTimeout(() => {
          navigate('/otp-verify', { state: { email: formData.email } });
        }, 1200);
      }
    } catch (error) {
      const httpStatus = error?.response?.status;
      const backendMessage = error?.response?.data?.message || error?.response?.data;

      let message = 'Something went wrong. Please try again later.';

      if (httpStatus === 226) {
        // HTTP 226 IM_USED — email already registered
        message = 'This email is already registered. Try logging in instead.';
        setErrors(prev => ({ ...prev, email: 'Email already in use' }));
      } else if (httpStatus === 400) {
        message = typeof backendMessage === 'string'
          ? backendMessage
          : 'Invalid details. Please check your input and try again.';
      } else if (typeof backendMessage === 'string' && backendMessage.length > 0) {
        message = backendMessage;
      }

      setStatus({ loading: false, error: message, success: '' });
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      paddingTop: '60px',
      paddingBottom: '60px'
    },
    registerContainer: {
      maxWidth: '500px',
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
    inputError: { borderColor: '#dc3545' },
    passwordRequirements: {
      fontSize: '12px',
      color: '#999',
      marginTop: '6px'
    },
    errorMessage: {
      color: '#dc3545',
      fontSize: '12px',
      marginTop: '4px'
    },
    termsCheckbox: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
      marginBottom: '8px',
      fontSize: '14px',
      color: '#666'
    },
    checkbox: {
      width: '18px',
      height: '18px',
      marginTop: '2px',
      cursor: 'pointer'
    },
    link: {
      color: '#28a745',
      textDecoration: 'none',
      cursor: 'pointer'
    },
    registerBtn: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    },
    registerBtnLoading: {
      backgroundColor: '#6aaa7e',
      cursor: 'not-allowed'
    },
    // --- Feedback banners ---
    alertBase: {
      padding: '12px 16px',
      borderRadius: '4px',
      fontSize: '14px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'flex-start',
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
    alertActionLink: {
      color: '#007bff',
      textDecoration: 'underline',
      cursor: 'pointer',
      fontWeight: '500',
      background: 'none',
      border: 'none',
      padding: 0,
      fontSize: '14px'
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
    loginLink: {
      textAlign: 'center',
      color: '#666',
      fontSize: '14px'
    },
    loginLinkText: {
      color: '#007bff',
      textDecoration: 'none',
      fontWeight: '500',
      cursor: 'pointer'
    }
  };

  const isDuplicateEmail = status.error.includes('already registered');

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div style={styles.container}>
        <div style={styles.registerContainer}>
          <div style={styles.header}>
            <h2 style={styles.title}>Create Account</h2>
            <p style={styles.subtitle}>Join SnapMart to start shopping</p>
          </div>

          {/* ---- Error Banner ---- */}
          {status.error && (
            <div style={{ ...styles.alertBase, ...styles.alertError }}>
              <span>⚠️</span>
              <span>
                {status.error}
                {isDuplicateEmail && (
                  <>
                    {' '}
                    <button
                      style={styles.alertActionLink}
                      onClick={() => navigate('/login')}
                    >
                      Go to Login →
                    </button>
                  </>
                )}
              </span>
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
              <label htmlFor="username" style={styles.label}>User Name</label>
              <input
                type="text"
                id="username"
                name="username"
                style={styles.input}
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                disabled={status.loading}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                style={{
                  ...styles.input,
                  ...(errors.email ? styles.inputError : {})
                }}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={status.loading}
                required
              />
              {errors.email && <div style={styles.errorMessage}>{errors.email}</div>}
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.label}>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                style={{
                  ...styles.input,
                  ...(errors.password ? styles.inputError : {})
                }}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={status.loading}
                required
              />
              <div style={styles.passwordRequirements}>
                At least 8 characters with uppercase, lowercase, and number
              </div>
              {errors.password && <div style={styles.errorMessage}>{errors.password}</div>}
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                style={{
                  ...styles.input,
                  ...(errors.confirmPassword ? styles.inputError : {})
                }}
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={status.loading}
                required
              />
              {errors.confirmPassword && (
                <div style={styles.errorMessage}>{errors.confirmPassword}</div>
              )}
            </div>

            <label style={styles.termsCheckbox}>
              <input
                type="checkbox"
                name="terms"
                style={styles.checkbox}
                checked={formData.terms}
                onChange={handleChange}
                disabled={status.loading}
                required
              />
              <span>
                I agree to the{' '}
                <a href="#" style={styles.link}>Terms & Conditions</a>
                {' '}and{' '}
                <a href="#" style={styles.link}>Privacy Policy</a>
              </span>
            </label>
            {errors.terms && (
              <div style={{ ...styles.errorMessage, marginBottom: '16px' }}>
                {errors.terms}
              </div>
            )}

            <button
              type="submit"
              style={{
                ...styles.registerBtn,
                ...(status.loading ? styles.registerBtnLoading : {})
              }}
              disabled={status.loading}
            >
              {status.loading && <span style={styles.spinner} />}
              {status.loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={styles.divider}>
            <div style={styles.dividerLine}></div>
            <span style={styles.dividerText}>or</span>
          </div>

          <div style={styles.loginLink}>
            Already have an account?{' '}
            <span style={styles.loginLinkText} onClick={() => navigate('/login')}>
              Login
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;