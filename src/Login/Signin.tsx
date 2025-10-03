import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import googleIcon from "../assets/google-icon.png";
import bgImage from "../assets/signin_background.jpg";

function validateEmail(email: string): { valid: boolean; error?: string } {
  const trimmedEmail = email.trim();
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_{|}~-]+(?<!\.)@(gmail\.com)$/;
  const domainPart = trimmedEmail.split("@")[1]?.toLowerCase();
  const localPart = trimmedEmail.split("@")[0];

  if (!trimmedEmail) return { valid: false, error: "Email is required" };
  if (!emailRegex.test(trimmedEmail))
    return { valid: false, error: "Invalid email format. Must be @gmail.com" };
  if (trimmedEmail.length > 254)
    return { valid: false, error: "Email must be ≤ 254 characters" };
  if (localPart.length > 64)
    return { valid: false, error: "Local part must be ≤ 64 characters" };
  if (localPart.startsWith(".") || localPart.endsWith("."))
    return { valid: false, error: "Local part cannot start or end with '.'" };
  if (localPart.includes(".."))
    return { valid: false, error: "Local part cannot contain consecutive dots" };
  if (domainPart !== "gmail.com")
    return { valid: false, error: "Domain must be gmail.com" };

  return { valid: true };
}

function validatePassword(password: string): { valid: boolean; error?: string } {
  const lengthValid = password.length >= 8;
  const upperLowerValid = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const numberValid = /\d/.test(password);
  const symbolValid = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!password) return { valid: false, error: "Password is required" };
  if (!lengthValid)
    return { valid: false, error: "Password must be at least 8 characters" };
  if (!upperLowerValid)
    return {
      valid: false,
      error: "Password must include upper and lower case letters",
    };
  if (!numberValid)
    return { valid: false, error: "Password must include a number" };
  if (!symbolValid)
    return { valid: false, error: "Password must include a symbol" };

  return { valid: true };
}

interface SigninProps {
  onSignupClick: () => void;
  onForgotPasswordClick: () => void;
}

const Signin: React.FC<SigninProps> = ({ onSignupClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Reset body styles to prevent scroll
  useEffect(() => {
    // Set body styles
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.width = '100vw';
    
    // Set html styles
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100vh';
    document.documentElement.style.width = '100vw';
    
    // Cleanup function
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    setEmailError(emailValidation.error || null);
    setPasswordError(passwordValidation.error || null);

    if (emailValidation.valid && passwordValidation.valid) {
      alert("Sign in successful!");
    }
  };

  return (
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        border: 'none',
        outline: 'none',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {/* LEFT: Image */}
      <div 
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
          border: 'none',
          outline: 'none',
          background: 'none',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        <img
          src={bgImage}
          alt="HeLiCare"
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: '20% center', // Thay đổi từ 'left center' thành '20% center'
            border: 'none',
            outline: 'none',
            margin: 0,
            padding: 0,
            verticalAlign: 'top'
          }}
        />
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
            border: 'none',
            outline: 'none',
            margin: 0,
            padding: 0
          }}
        >
          <div 
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              zIndex: 10,
              padding: '2rem',
              border: 'none',
              outline: 'none',
              margin: 0,
              textAlign: 'left' // Thêm căn lề trái
            }}
          >
            <h1 
              style={{
                fontSize: '3rem', // Tăng kích thước font
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '1rem',
                lineHeight: '1.2',
                margin: '0 0 1rem 0',
                textAlign: 'left' // Căn lề trái cho title
              }}
            >
              HeLiCare
            </h1>
            <p 
              style={{
                fontSize: '1.125rem', // Tăng kích thước font cho paragraph
                color: 'white',
                maxWidth: '32rem',
                lineHeight: '1.5',
                margin: 0,
                textAlign: 'left' // Căn lề trái cho text
              }}
            >
              Helps you keep track of and stay connected with your loved ones in
              the nursing home anytime, no matter where you are.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT: Form */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          padding: '2rem', // Tăng padding
          border: 'none',
          outline: 'none',
          margin: 0,
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            width: '100%',
            maxWidth: '28rem', // Tăng kích thước form từ 20rem lên 28rem
            padding: '2rem', // Tăng padding
            backgroundColor: 'white',
            borderRadius: '0.75rem', // Tăng border radius
            boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: 'none',
            outline: 'none',
            margin: 0,
            boxSizing: 'border-box'
          }}
        >
          <h2 style={{ 
            fontSize: '1.875rem', // Tăng kích thước từ 1.25rem lên 1.875rem
            fontWeight: '600', 
            marginBottom: '2rem', // Tăng margin bottom
            textAlign: 'center', 
            color: '#1f2937',
            margin: '0 0 2rem 0'
          }}>
            Sign in
          </h2>

          {/* Email */}
          <div style={{ marginBottom: '1.5rem' }}> {/* Tăng margin bottom */}
            <label
              htmlFor="email"
              style={{ 
                display: 'block', 
                fontSize: '1rem', // Tăng kích thước font
                fontWeight: '500', 
                color: '#374151', 
                textAlign: 'left', 
                marginBottom: '0.5rem',
                margin: '0 0 0.5rem 0'
              }}
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              style={{
                width: '100%',
                padding: '0.875rem', // Tăng padding
                border: emailError ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '0.5rem', // Tăng border radius
                fontSize: '1rem', // Tăng font size
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(null);
              }}
              onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = '#5985d8')}
              onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = emailError ? '#ef4444' : '#d1d5db')}
            />
            {emailError && (
              <p style={{ 
                fontSize: '0.875rem', // Tăng font size cho error message
                color: '#ef4444', 
                marginTop: '0.5rem', 
                margin: '0.5rem 0 0 0' 
              }}>
                {emailError}
              </p>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.5rem' }}> {/* Tăng margin bottom */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginBottom: '0.5rem' 
            }}>
              <label
                htmlFor="password"
                style={{ 
                  display: 'block', 
                  fontSize: '1rem', // Tăng font size
                  fontWeight: '500', 
                  color: '#374151', 
                  textAlign: 'left' 
                }}
              >
                Your password
              </label>
              <button
                type="button"
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#5985d8', 
                  cursor: 'pointer', 
                  padding: '0.25rem' 
                }}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />} {/* Tăng icon size */}
              </button>
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              style={{
                width: '100%',
                padding: '0.875rem', // Tăng padding
                border: passwordError ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '0.5rem', // Tăng border radius
                fontSize: '1rem', // Tăng font size
                outline: 'none',
                boxSizing: 'border-box'
              }}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(null);
              }}
              onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = '#5985d8')}
              onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = passwordError ? '#ef4444' : '#d1d5db')}
            />
            {passwordError && (
              <p style={{ 
                fontSize: '0.875rem', // Tăng font size
                color: '#ef4444', 
                marginTop: '0.5rem', 
                margin: '0.5rem 0 0 0' 
              }}>
                {passwordError}
              </p>
            )}
          </div>

          {/* Forgot password */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
            <button
              type="button"
              style={{ 
                background: 'none', 
                border: 'none', 
                fontSize: '0.875rem', // Tăng font size
                color: '#5985d8', 
                cursor: 'pointer', 
                textDecoration: 'none' 
              }}
              onClick={() => navigate("/forgotpassword-email")}
              onMouseOver={(e) => ((e.target as HTMLButtonElement).style.textDecoration = 'underline')}
              onMouseOut={(e) => ((e.target as HTMLButtonElement).style.textDecoration = 'none')}
            >
              Forgot your password?
            </button>
          </div>

          {/* Separator */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
            <div style={{ flexGrow: 1, height: '1px', backgroundColor: '#d1d5db' }}></div>
            <span style={{ 
              margin: '0 1rem', // Tăng margin
              fontSize: '0.875rem', // Tăng font size
              color: '#6b7280', 
              fontWeight: '500' 
            }}>OR</span>
            <div style={{ flexGrow: 1, height: '1px', backgroundColor: '#d1d5db' }}></div>
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem', // Tăng gap
              padding: '0.875rem 1rem', // Tăng padding
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem', // Tăng border radius
              fontSize: '1rem', // Tăng font size
              fontWeight: '500',
              color: '#374151',
              backgroundColor: 'white',
              cursor: 'pointer',
              marginBottom: '1.5rem', // Tăng margin bottom
              boxSizing: 'border-box'
            }}
            onMouseOver={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#f9fafb')}
            onMouseOut={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = 'white')}
          >
            <img
              src={googleIcon}
              alt="Google"
              style={{ width: '1.25rem', height: '1.25rem' }} // Tăng icon size
            />
            Continue with Google
          </button>

          {/* Sign in button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.875rem', // Tăng padding
              backgroundColor: '#5985d8',
              color: 'white',
              borderRadius: '0.5rem', // Tăng border radius
              fontSize: '1rem', // Tăng font size
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '1.5rem', // Tăng margin bottom
              boxSizing: 'border-box'
            }}
            onMouseOver={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#466bb3')}
            onMouseOut={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = '#5985d8')}
          >
            Sign in
          </button>

          {/* Sign up */}
          <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}> {/* Tăng font size */}
            Don't have an account?{" "}
            <button
              type="button"
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#5985d8', 
                cursor: 'pointer', 
                fontWeight: '500', 
                textDecoration: 'none',
                fontSize: '0.875rem' // Tăng font size
              }}
              onClick={onSignupClick}
              onMouseOver={(e) => ((e.target as HTMLButtonElement).style.textDecoration = 'underline')}
              onMouseOut={(e) => ((e.target as HTMLButtonElement).style.textDecoration = 'none')}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;