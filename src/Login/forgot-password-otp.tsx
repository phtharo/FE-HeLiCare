import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ForgotPasswordOTPProps {
  onVerify: () => void;
  onResend: () => void;
}

const ForgotPasswordOTP: React.FC<ForgotPasswordOTPProps> = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(120); // Thời gian đếm ngược (120s)
  const [resendDisabled, setResendDisabled] = useState(true); // Trạng thái nút resend

  // Reset body styles để full màn hình
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.width = '100vw';

    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100vh';
    document.documentElement.style.width = '100vw';

    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, []);

  // Đếm ngược thời gian
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setResendDisabled(false); // Hết thời gian thì nút resend được kích hoạt
    }
  }, [timeLeft]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError(null);

      // Auto focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    navigate('/forgotpassword-reset');
  };

  const handleResend = () => {
    if (!resendDisabled) {
      setOtp(['', '', '', '', '', '']);
      setError(null);
      setTimeLeft(120); // Reset thời gian đếm ngược
      setResendDisabled(true); // Vô hiệu hóa nút resend
      // Logic gửi lại OTP
    }
  };

  const handleBack = () => {
    navigate('/forgotpassword-email');
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9fafb',
        padding: '2rem',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '28rem',
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow:
            '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <h1
          style={{
            fontSize: '1.875rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '1rem',
            margin: '0 0 1rem 0',
          }}
        >
          Enter OTP Code
        </h1>

        <p
          style={{
            fontSize: '1rem',
            color: '#6b7280',
            marginBottom: '2rem',
            margin: '0 0 2rem 0',
          }}
        >
          We've sent a 6-digit code to your email address
        </p>

        {/* OTP Input */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'center',
            marginBottom: '1.5rem',
          }}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              style={{
                width: '3rem',
                height: '3rem',
                textAlign: 'center',
                fontSize: '1.25rem',
                fontWeight: '600',
                border: error ? '2px solid #ef4444' : '2px solid #d1d5db',
                borderRadius: '0.5rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#5985d8')}
              onBlur={(e) =>
                (e.target.style.borderColor = error ? '#ef4444' : '#d1d5db')
              }
            />
          ))}
        </div>

        {error && (
          <p
            style={{
              fontSize: '0.875rem',
              color: '#ef4444',
              marginBottom: '1.5rem',
              margin: '0 0 1.5rem 0',
            }}
          >
            {error}
          </p>
        )}

        {/* Resend */}
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Didn't receive the code?{' '}
          </span>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendDisabled}
            style={{
              background: 'none',
              border: 'none',
              color: resendDisabled ? '#d1d5db' : '#5985d8',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: resendDisabled ? 'not-allowed' : 'pointer',
              textDecoration: 'none',
            }}
            onMouseOver={(e) =>
              !resendDisabled &&
              ((e.target as HTMLButtonElement).style.textDecoration = 'underline')
            }
            onMouseOut={(e) =>
              !resendDisabled &&
              ((e.target as HTMLButtonElement).style.textDecoration = 'none')
            }
          >
            Resend
          </button>
          <span
            style={{
              fontSize: '0.875rem',
              color: '#5985d8',
              fontWeight: 'bold',
              marginLeft: '0.5rem',
            }}
          >
            {timeLeft}s
          </span>
        </div>

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexDirection: 'column',
          }}
        >
          <button
            onClick={handleVerify}
            style={{
              width: '100%',
              padding: '0.875rem',
              backgroundColor: '#5985d8',
              color: 'white',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              boxSizing: 'border-box',
            }}
            onMouseOver={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor = '#466bb3')
            }
            onMouseOut={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor = '#5985d8')
            }
          >
            Verify Code
          </button>

          <button
            onClick={handleBack}
            style={{
              width: '100%',
              padding: '0.875rem',
              backgroundColor: 'transparent',
              color: '#6b7280',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '500',
              border: '1px solid #d1d5db',
              cursor: 'pointer',
              boxSizing: 'border-box',
            }}
            onMouseOver={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor = '#f9fafb')
            }
            onMouseOut={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor =
                'transparent')
            }
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordOTP;