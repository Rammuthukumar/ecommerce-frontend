import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import {AppContext} from '../Context/Context'

const OTPVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const email = location.state?.email;
  const {authLogin} = useContext(AppContext);
  
  const inputRefs = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    setShowError(false);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length === 6) {
      console.log('Verifying OTP:', otpValue);
      
      try{
        const response = await axios.post("https://ecommerce-backend-28es.onrender.com/verify-otp",{
          email:email,
          otpCode : otpValue
        });
        if(response.status == 200){
          console.log(response.data);
          authLogin(response.data.jwtToken);
          setShowSuccess(true);
          setShowError(false);
        
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      } catch(e) {
          setShowError(true);
        setShowSuccess(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } else {
      setShowError(true);
      setShowSuccess(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = () => {
    if (canResend) {
      console.log('Resending OTP...');
      setTimeLeft(120);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      setShowError(false);
      setShowSuccess(false);
      inputRefs.current[0]?.focus();
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      paddingTop: '100px'
    },
    otpContainer: {
      maxWidth: '450px',
      margin: '0 auto',
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      padding: '40px',
      textAlign: 'center'
    },
    otpIcon: {
      width: '80px',
      height: '80px',
      backgroundColor: '#e8f5e9',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 24px',
      fontSize: '40px'
    },
    title: {
      fontSize: '28px',
      color: '#333',
      marginBottom: '12px',
      fontWeight: '600'
    },
    subtitle: {
      color: '#666',
      fontSize: '14px',
      marginBottom: '8px'
    },
    phoneNumber: {
      color: '#28a745',
      fontWeight: '600',
      marginBottom: '30px'
    },
    otpInputs: {
      display: 'flex',
      justifyContent: 'center',
      gap: '12px',
      marginBottom: '24px'
    },
    otpInput: {
      width: '56px',
      height: '56px',
      border: '2px solid #ddd',
      borderRadius: '8px',
      fontSize: '24px',
      textAlign: 'center',
      transition: 'all 0.2s',
      fontWeight: '600',
      color: '#333',
      outline: 'none'
    },
    otpInputFilled: {
      borderColor: '#28a745',
      backgroundColor: '#f0f9f4'
    },
    otpInputError: {
      borderColor: '#dc3545',
      backgroundColor: '#fff5f5'
    },
    otpInputFocus: {
      borderColor: '#28a745',
      boxShadow: '0 0 0 3px rgba(40, 167, 69, 0.1)'
    },
    timer: {
      color: '#666',
      fontSize: '14px',
      marginBottom: '20px'
    },
    timerValue: {
      color: '#28a745',
      fontWeight: '600'
    },
    verifyBtn: {
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
      marginBottom: '16px'
    },
    verifyBtnDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed'
    },
    resendSection: {
      fontSize: '14px',
      color: '#666'
    },
    resendBtn: {
      background: 'none',
      border: 'none',
      color: '#007bff',
      cursor: 'pointer',
      textDecoration: 'underline',
      fontSize: '14px',
      fontWeight: '500'
    },
    resendBtnDisabled: {
      color: '#ccc',
      cursor: 'not-allowed'
    },
    backLink: {
      marginTop: '24px',
      fontSize: '14px'
    },
    link: {
      color: '#28a745',
      textDecoration: 'none',
      cursor: 'pointer'
    },
    message: {
      padding: '12px',
      borderRadius: '4px',
      marginBottom: '20px',
      fontSize: '14px'
    },
    successMessage: {
      backgroundColor: '#d4edda',
      border: '1px solid #c3e6cb',
      color: '#155724'
    },
    errorMessage: {
      backgroundColor: '#f8d7da',
      border: '1px solid #f5c6cb',
      color: '#721c24'
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <div style={styles.container}>
      <div style={styles.otpContainer}>
        <div style={styles.otpIcon}>📱</div>
        
        <h2 style={styles.title}>Verify Your Account</h2>
        <p style={styles.subtitle}>We've sent a verification code to</p>
        <p style={styles.email}>********gmail.com</p>

        {showSuccess && (
          <div style={{ ...styles.message, ...styles.successMessage }}>
            OTP verified successfully! Redirecting...
          </div>
        )}

        {showError && (
          <div style={{ ...styles.message, ...styles.errorMessage }}>
            Invalid OTP. Please try again.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.otpInputs}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                style={{
                  ...styles.otpInput,
                  ...(digit ? styles.otpInputFilled : {}),
                  ...(showError ? styles.otpInputError : {})
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#28a745';
                  e.target.style.boxShadow = '0 0 0 3px rgba(40, 167, 69, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = digit ? '#28a745' : '#ddd';
                  e.target.style.boxShadow = 'none';
                }}
              />
            ))}
          </div>

          <div style={styles.timer}>
            Code expires in{' '}
            <span style={styles.timerValue}>{formatTime(timeLeft)}</span>
          </div>

          <button
            type="submit"
            style={{
              ...styles.verifyBtn,
              ...((!isOtpComplete) ? styles.verifyBtnDisabled : {})
            }}
            disabled={!isOtpComplete}
            onMouseEnter={(e) => {
              if (isOtpComplete) {
                e.target.style.backgroundColor = '#218838';
              }
            }}
            onMouseLeave={(e) => {
              if (isOtpComplete) {
                e.target.style.backgroundColor = '#28a745';
              }
            }}
          >
            Verify OTP
          </button>
        </form>

        <div style={styles.resendSection}>
          Didn't receive the code?{' '}
          <button
            style={{
              ...styles.resendBtn,
              ...((!canResend) ? styles.resendBtnDisabled : {})
            }}
            onClick={handleResend}
            disabled={!canResend}
            onMouseEnter={(e) => {
              if (canResend) {
                e.target.style.color = '#0056b3';
              }
            }}
            onMouseLeave={(e) => {
              if (canResend) {
                e.target.style.color = '#007bff';
              }
            }}
          >
            Resend OTP
          </button>
        </div>

        <div style={styles.backLink}>
          <span style={styles.link} onClick={() => navigate('/login')}>
            ← Back to Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default OTPVerify;
