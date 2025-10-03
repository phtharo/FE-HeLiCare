import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import SignupEmail from "./Login/Signup-Email";
import SignupVerify from "./Login/Signup-Verify";
import SignupSetPassword from "./Login/Signup-Setpassword";
import ForgotPasswordEmail from "./Login/forgot-password-email";
import ForgotPasswordOTP from "./Login/forgot-password-otp";
import ForgotPasswordReset from "./Login/forgot-password-reset";
import Signin from "./Login/Signin";
import ForgotPasswordUpdate from "./Login/forgot-password-update";
import ResidentFileInformation from "./ResidentFile-information";
import "./App.css";

// Wrapper cho Signin vì nó cần props
const SigninWrapper = () => {
  const navigate = useNavigate();
  return (
    <Signin
      onSignupClick={() => navigate("/signup-email")}
      onForgotPasswordClick={() => navigate("/forgotpassword-email")}
    />
  );
};

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SigninWrapper />} />
          <Route path="/signin" element={<SigninWrapper />} />
          <Route path="/signup-email" element={<SignupEmail />} />
          <Route path="/signup-verify" element={<SignupVerify />} />
          <Route path="/signup-setpassword" element={<SignupSetPassword />} />
          <Route path="/forgotpassword-email" element={<ForgotPasswordEmail />} />
          <Route path="/forgotpassword-otp" element={<ForgotPasswordOTP />} />
          <Route path="/forgotpassword-reset" element={<ForgotPasswordReset />} />
          <Route path="/forgotpassword-update" element={<ForgotPasswordUpdate />} />
          <Route path="/resident-information" element={<ResidentFileInformation />} />
          <Route path="*" element={<Navigate to="/resident-information" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

