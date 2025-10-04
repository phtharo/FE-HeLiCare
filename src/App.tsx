import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from './Login/Signin';
import SignupEmail from './Login/Signup-Email';
import SignupVerify from './Login/Signup-Verify';
import SignupSetPassword from './Login/Signup-Setpassword';
import ForgotPasswordEmail from './Login/forgot-password-email';
import ForgotPasswordOTP from './Login/forgot-password-otp';
import ForgotPasswordReset from './Login/forgot-password-reset';
import ForgotPasswordUpdate from './Login/forgot-password-update';
// Update the import path and filename casing as needed to match your file system
import ResidentFileInformation from './ResidentFileManagement/Resident-Information';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <Signin
                onSignupClick={() => (window.location.href = '/signup-email')}
                onForgotPasswordClick={() => (window.location.href = '/forgotpassword-email')}
              />
            }
          />

          <Route
            path="/forgotpassword-email"
            element={<ForgotPasswordEmail />}
          />

          <Route
            path="/forgotpassword-otp"
            element={
              <ForgotPasswordOTP
                onVerify={() => (window.location.href = '/forgotpassword-reset')}
                onResend={() => {
                  // Implement resend logic here, or show a notification
                }}
              />
            }
          />

          <Route
            path="/forgotpassword-reset"
            element={<ForgotPasswordReset />}
          />

          <Route
            path="/signup-email"
            element={
              <SignupEmail
                onLoginClick={() => (window.location.href = '/')}
                onVerify={() => (window.location.href = '/signup-verify')}
              />
            }
          />

          <Route
            path="/signup-verify"
            element={<SignupVerify />}
          />

          <Route
            path="/signup-setpassword"
            element={
              <SignupSetPassword
                onLoginClick={() => (window.location.href = '/')}
              />
            }
          />

          <Route
            path="/forgotpassword-update"
            element={<ForgotPasswordUpdate />}
          />

          <Route
            path="/resident-information"
            element={<ResidentFileInformation />}
          />
        </Routes>
      </div>
    </Router>
  );
}
