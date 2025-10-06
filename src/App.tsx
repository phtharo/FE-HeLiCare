import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';


import SignupEmail from './Login/Signup-Email';
import SignupVerify from './Login/Signup-Verify';
import SignupSetPassword from './Login/Signup-Setpassword';
import ForgotPasswordEmail from './Login/forgot-password-email';
import ForgotPasswordOTP from './Login/forgot-password-otp';
import ForgotPasswordReset from './Login/forgot-password-reset';
import Signin from './Login/Signin';
import ForgotPasswordUpdate from './Login/forgot-password-update';

import ResidentFileInformation from './ResidentFileManagement/ResidentFileInformation';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={<SigninWrapper />}
          />

          <Route
            path="/forgotpassword-email"
            element={<ForgotPasswordEmailWrapper />}
          />

          <Route
            path="/forgotpassword-otp"
            element={<ForgotPasswordOTPWrapper />}
          />

          <Route
            path="/forgotpassword-reset"
            element={<ForgotPasswordResetWrapper />}
          />

          <Route
            path="/signup-email"
            element={<SignupEmailWrapper />}
          />

          <Route
            path="/signup-verify"
            element={<SignupVerifyWrapper />}
          />

          <Route
            path="/signup-setpassword"
            element={<SignupSetPasswordWrapper />}
          />

          <Route
            path="/forgotpassword-update"
            element={<ForgotPasswordUpdateWrapper />}
          />

          <Route path="/resident-information" element={<ResidentFileInformation />} />
        </Routes>
      </div>
    </Router>
  );
}

// Wrapper cho Signin
const SigninWrapper = () => {
  const navigate = useNavigate();
  return (
    <Signin
      onSignupClick={() => navigate('/signup-email')}
      onForgotPasswordClick={() => navigate('/forgotpassword-email')}
    />
  );
};

// Wrapper cho ForgotPasswordEmail
const ForgotPasswordEmailWrapper = () => {
  const navigate = useNavigate();
  return (
    <ForgotPasswordEmail
      onSend={() => navigate('/forgotpassword-otp')}
    />
  );
};

// Wrapper cho ForgotPasswordOTP
const ForgotPasswordOTPWrapper = () => {
  const navigate = useNavigate();
  return (
    <ForgotPasswordOTP
      onVerify={() => navigate('/forgotpassword-reset')}
      onResend={() => navigate('/forgotpassword-otp')}
    />
  );
};

// Wrapper cho ForgotPasswordReset
const ForgotPasswordResetWrapper = () => {
  const navigate = useNavigate();
  return (
    <ForgotPasswordReset
      onSuccess={() => navigate('/forgotpassword-update')}
    />
  );
};

// Wrapper cho SignupEmail
const SignupEmailWrapper = () => {
  const navigate = useNavigate();
  return (
    <SignupEmail
      onLoginClick={() => navigate('/')}
      onVerify={() => navigate('/signup-verify')}
    />
  );
};

// Wrapper cho SignupVerify
const SignupVerifyWrapper = () => {
  const navigate = useNavigate();
  return (
    <SignupVerify
      onBack={() => navigate('/signup-email')}
      onVerified={() => navigate('/signup-setpassword')}
    />
  );
};

// Wrapper cho SignupSetPassword
const SignupSetPasswordWrapper = () => {
  const navigate = useNavigate();
  return (
    <SignupSetPassword
      onLoginClick={() => navigate('/')}
    />
  );
};

// Wrapper cho ForgotPasswordUpdate
const ForgotPasswordUpdateWrapper = () => {
  const navigate = useNavigate();
  return (
    <ForgotPasswordUpdate
      onBackToLogin={() => navigate('/')}
    />
  );
};
