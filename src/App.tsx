import { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, BrowserRouter, useLocation } from 'react-router-dom';

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return null;
}
import { Toaster } from "sonner";

import SignupEmail from './Login/Signup-Email';
import SignupVerify from './Login/Signup-Verify';
import SignupSetPassword from './Login/Signup-Setpassword';
import ForgotPasswordEmail from './Login/forgot-password-email';
import ForgotPasswordOTP from './Login/forgot-password-otp';
import ForgotPasswordReset from './Login/forgot-password-reset';
import Signin from './Login/Signin';
import ForgotPasswordUpdate from './Login/forgot-password-update';

import ResidentFileInformation from './staff/resident-information';
import ListResident from './staff/list-resident';
import StaffCreateEvent from './event/staff-create-event';
import StaffManageEvent from './event/staff-manage-event';
import IssueLinkCode from './family-resident-link/IssueLinkCode';
import EnterInviteCode from './family-resident-link/EnterInviteCode';
import FamilySchedule from './family/family-schedule';
import ResidentSchedule from './event/resident-schedule';
import InputVital from './staff/InputVitalForm'
import './App.css';
import StaffSidebar from "./Sidebar/staff-sidebar";
import { Sidebar } from './Sidebar/resident-sidebar';
import FamilySidebar from './Sidebar/family-sidebar';

import BookingStatusQR from './event/BookingStatusQR';
import Newsfeed from './diary/newsfeed';
import StaffNutrition from './Nutrition-Allergy/staff';
import CreatePost from './diary/post';
import ResidentNutrition from './Nutrition-Allergy/resident';
import FamilyNutrition from './Nutrition-Allergy/family';
import PaymentModuleFamily from './payment/family-payment';
import PaymentModuleStaff from './payment/staff-payment';
import PaymentModuleAdmin from './payment/admin-payment';
import AdminLayout from './Sidebar/admin-sidebar';
import RoomBedStaffPage from './room-bed/staff-room';
import RoomBedResidentPage from './room-bed/resident-room';
import { RoomBedFamilyPage } from './room-bed/family-room';
import RoomBedAdminPage from './admin/admin-room';
import AdminDashboardPage from './admin/dashboard';
import ResidentManagementPage from './admin/resident-manage';
import StaffManagementPage from './admin/staff_manage';
import ScheduleActivitiesManagementPage from './admin/schedule-activity';
import NutritionPlanManagementPage from './admin/nutrition-plan';
import VisitCheckinAdmin from './admin/visit-qrcheckin';
import AdminSOSIncidentPage from './admin/sos-incident';
import AdminReportsAnalyticsPage from './admin/report-analytics';
import AdminSettingsPage from './admin/system-setting';
import MedicationCarePlan from './staff/medication';
import StaffSOSAlerts from './staff/sos';
import StaffDashboard from './staff/dashboard';
import FamilyDashboard from './family/dashboard';
import MyResident from './family/my-resident';
import FamilyHealthCare from './family/health-care';
import FamilyNotification from './family/notification';
import FamilyFeedbackSupport from './family/feedback';
import ResidentMyHealth from './resident/my-health';
import MyFamily from './resident/family';
import ResidentNotificationsCenter from './resident/notification';
import ResidentHomeScreen from './resident/home';
import MedicationManagement from './admin/medication-management';

// Mock API for login
const mockLogin = async (email: string, password: string): Promise<{ role: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email === "staff@gmail.com") {
        resolve({ role: "staff" });
      } else if (email === "resident@gmail.com") {
        resolve({ role: "resident" });
      } else if (email === "family@gmail.com") {
        resolve({ role: "family" });
      } else if (email === "admin@gmail.com") {
        resolve({ role: "admin" });
      } else {
        resolve({ role: "unknown" });
      }
    }, 500);
  });
};

export default function App() {
  return (
    <div className="App">
      <ScrollToTop />
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<SigninWrapper />} />
        <Route path="/forgotpassword-email" element={<ForgotPasswordEmailWrapper />} />
        <Route path="/forgotpassword-otp" element={<ForgotPasswordOTPWrapper />} />
        <Route path="/forgotpassword-reset" element={<ForgotPasswordResetWrapper />} />
        <Route path="/signup-email" element={<SignupEmailWrapper />} />
        <Route path="/signup-verify" element={<SignupVerifyWrapper />} />
        <Route path="/signup-setpassword" element={<SignupSetPasswordWrapper />} />
        <Route path="/forgotpassword-update" element={<ForgotPasswordUpdateWrapper />} />

        {/* staff */}
        <Route element={<StaffSidebar />}>
          <Route path="/list-resident" element={<ListResident />} />
          <Route path="/resident-information" element={<ResidentFileInformation />} />
          <Route path="/input-vital" element={<InputVital />} />
          <Route path="/staff-create-event" element={<StaffCreateEvent />} />
          <Route path="/staff-manage-event" element={<StaffManageEvent />} />
          <Route path="/newsfeed" element={<Newsfeed />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/create-post/:postId" element={<CreatePost />} />
          <Route path="/booking-status-qr/:id" element={<BookingStatusQR />} />
          <Route path="/staff-nutrition" element={<StaffNutrition />} />
          <Route path="/staff-payment" element={<PaymentModuleStaff />} />
          <Route path="/staff-room" element={<RoomBedStaffPage />} />
          <Route path="/staff-medication-careplan" element={<MedicationCarePlan />} />
          <Route path="/sos-alerts" element={<StaffSOSAlerts />} />
          <Route path="/staff-dashboard" element={<StaffDashboard />} />
        </Route>
        <Route path="/resident" element={<Sidebar />}>
          <Route index element={<Navigate to="newsfeed" replace />} />
          <Route path="newsfeed" element={<Newsfeed />} />
          <Route path="resident-schedule" element={<ResidentSchedule />} />
          <Route path="resident-nutrition" element={<ResidentNutrition />} />
          <Route path="resident-room" element={<RoomBedResidentPage />} />
          <Route path="resident-payment" element={<PaymentModuleStaff />} />
          <Route path="my-health" element={<ResidentMyHealth />} />
          <Route path="family" element={<MyFamily />} />
          <Route path="notifications" element={<ResidentNotificationsCenter />} />
          <Route path="home" element={<ResidentHomeScreen />} />
        </Route>

        <Route path="/family" element={<FamilySidebar />}>
          <Route index element={<Navigate to="newsfeed" replace />} />
          <Route path="newsfeed" element={<Newsfeed />} />
          <Route path="family-schedule" element={<FamilySchedule />} />
          <Route path="family-nutrition" element={<FamilyNutrition />} />
          <Route path="family-room" element={<RoomBedFamilyPage />} />
          {/* <Route path="demo" element={<PaymentModuleFamily />} /> */}
          <Route path="family-payment" element={<PaymentModuleFamily />} />
          <Route path="family-dashboard" element={<FamilyDashboard />} />
          <Route path="my-resident" element={<MyResident />} />
          <Route path="family-health-care" element={<FamilyHealthCare />} />
          <Route path="notifications" element={<FamilyNotification />} />
          <Route path="family-feedback" element={<FamilyFeedbackSupport />} />

        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin-payment" element={<PaymentModuleAdmin />} />
          <Route path="/admin-room" element={<RoomBedAdminPage />} />
          <Route path='/admin-resident' element={<ResidentManagementPage />} />
          <Route path='/admin-staff' element={<StaffManagementPage />} />
          <Route path="/admin-activities" element={<ScheduleActivitiesManagementPage />} />
          <Route path="/admin-nutrition" element={<NutritionPlanManagementPage />} />
          <Route path="/admin-visit-qrcheckin" element={<VisitCheckinAdmin />} />
          <Route path="/admin-sos-incident" element={<AdminSOSIncidentPage />} />
          <Route path="/admin-report-analytics" element={<AdminReportsAnalyticsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          <Route path="/medication-management" element={<MedicationManagement />} />
        </Route>

        {/* no side bar */}
        <Route path="/issue-link-code" element={<IssueLinkCode />} />
        <Route path="/enter-invite-code" element={<EnterInviteCode />} />
        <Route path="/resident-sidebar" element={<Sidebar />} />
        <Route path="/family-sidebar" element={<FamilySidebar />} />

        {/* <Route path="/admin-payment" element={<PaymentModuleAdmin />} /> */}
        {/* <Route path="/booking-status-qr/:id" element={<BookingStatusQR />} /> */}

        {/* Set the default route to Signin*/}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      < ScrollToTop />
    </div>
  );
}

// Wrapper cho Signin
function SigninWrapper() {
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string): Promise<void> => {
    const response = await mockLogin(email, password);
    localStorage.setItem("userRole", response.role);
    if (response.role === "staff") {
      navigate("/staff-dashboard");
    } else if (response.role === "resident") {
      navigate("/resident/newsfeed");
    } else if (response.role === "family") {
      navigate("/family/newsfeed");
    }
    else if (response.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <Signin
      onLogin={(email: string, password: string) => handleLogin(email, password)}
      onSignupClick={() => navigate("/signup-email")}
      onForgotPasswordClick={() => navigate("/forgotpassword-email")}
    />
  );
}

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
