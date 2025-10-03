import React from 'react';
import { useState, type JSX } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupEmail from './Login/Signup-Email';
import SignupVerify from './Login/Signup-Verify';
import SignupSetPassword from './Login/Signup-Setpassword';
import ForgotPasswordEmail from './Login/forgot-password-email';
import ForgotPasswordOTP from './Login/forgot-password-otp';
import ForgotPasswordReset from './Login/forgot-password-reset';
import Signin from './Login/Signin';
import ForgotPasswordUpdate from './Login/forgot-password-update';
import ResidentFileInformation from "./ResidentFileManagement/resident-information";
import './App.css';

type Page =
  | 'signin'
  | 'signup-email'
  | 'signup-verify'
  | 'signup-setpassword'
  | 'forgot-password-email'
  | 'forgot-password-otp'
  | 'forgot-password-reset'
  | 'forgot-password-update';

export default function App() {
  const [page, setPage] = useState<Page>('signin');

  const pages: Record<Page, JSX.Element> = {
    'signin': (
      <Signin
        onSignupClick={() => setPage('signup-email')}
        onForgotPasswordClick={() => setPage('forgot-password-email')}
      />
    ),
    'forgot-password-email': (
      <ForgotPasswordEmail onSend={() => setPage('forgot-password-otp')} />
    ),
    'forgot-password-otp': (
      <ForgotPasswordOTP
        onVerify={() => setPage('forgot-password-reset')}
        onResend={() => setPage('forgot-password-otp')}
      />
    ),
    'forgot-password-reset': (
      <ForgotPasswordReset onSuccess={() => setPage('forgot-password-update')} />
    ),
    'signup-email': (
      <SignupEmail
        onLoginClick={() => setPage('signin')}
        onVerify={() => setPage('signup-verify')}
      />
    ),
    'signup-verify': (
      <SignupVerify
        onBack={() => setPage('signup-email')}
        onVerified={() => setPage('signup-setpassword')}
      />
    ),
    'signup-setpassword': (
      <SignupSetPassword onLoginClick={() => setPage('signin')} />
    ),
    'forgot-password-update': (
      <ForgotPasswordUpdate onBackToLogin={() => setPage('signin')} />
    ),
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Signin 
            onSignupClick={() => setPage('signup-email')} 
            onForgotPasswordClick={() => setPage('forgot-password-email')} 
          />} />
          <Route path="/forgotpassword-email" element={<ForgotPasswordEmail onSend={() => setPage('forgot-password-otp')} />} />
          <Route path="/signup-email" element={<SignupEmail 
            onLoginClick={() => setPage('signin')} 
            onVerify={() => setPage('signup-verify')} 
          />} />
          <Route path="/resident-information" element={<ResidentFileInformation />} />
        </Routes>
      </div>
    </Router>
  );
}