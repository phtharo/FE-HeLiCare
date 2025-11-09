import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Toaster } from "sonner";

import SignupEmail from './Login/Signup-Email';
import SignupVerify from './Login/Signup-Verify';
import SignupSetPassword from './Login/Signup-Setpassword';
import ForgotPasswordEmail from './Login/forgot-password-email';
import ForgotPasswordOTP from './Login/forgot-password-otp';
import ForgotPasswordReset from './Login/forgot-password-reset';
import Signin from './Login/Signin';
import ForgotPasswordUpdate from './Login/forgot-password-update';

import ResidentFileInformation from './ResidentFileManagement/resident-information';
import ListResident from './ResidentFileManagement/list-resident';
import StaffCreateEvent from './event/staff-create-event';
import StaffManageEvent from './event/staff-manage-event';
import IssueLinkCode from './family-resident-link/IssueLinkCode';
import EnterInviteCode from './family-resident-link/EnterInviteCode';
import RegisterVisit from './event/family-register-visit';
import ResidentSchedule from './event/resident-schedule';
import InputVital from './vitalSign/InputVitalForm'
import './App.css';
import { AppLayout } from "./layout/staff-sidebar";
import {Sidebar} from './layout/sidebar';
import BookingStatusQR from './event/BookingStatusQR';
import Newsfeed from './diary/newsfeed';

export default function App() {
  return (
    <div className="App">
      <Toaster richColors position="top-right" />
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
        {/* side bar staff */}
        <Route element={<AppLayout />}>
          {/* homepage */}
          <Route index element={<ListResident />} /> 
          
          <Route path="resident-information" element={<ResidentFileInformation />} />
          <Route path="list-resident" element={<ListResident />} />
          <Route path="input-vital" element={<InputVital />} />
          <Route path="staff-create-event" element={<StaffCreateEvent />} />
          <Route path="staff-manage-event" element={<StaffManageEvent />} />
        </Route>
        {/* resident */}
        <Route element={<Sidebar />}>
        {/* homepage */}
        <Route index element={<Navigate to="/home" replace />} />

        <Route path="/newsfeed" element={<Newsfeed />} />
        </Route>
        {/* no side bar */}
        <Route path="/issue-link-code" element={<IssueLinkCode />} />
        <Route path="/enter-invite-code" element={<EnterInviteCode />} />
        <Route path="/register-visit" element={<RegisterVisit />} />
        <Route path="/resident-schedule" element={<ResidentSchedule />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/booking-status-qr" element={<BookingStatusQR />} />
        
        
      </Routes>
    </div>
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
