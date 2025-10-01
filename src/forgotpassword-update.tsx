import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ForgotPasswordUpdate: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/signin");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#f9fafb]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-[#5985d8] mb-6 text-center">
          HeLiCare
        </h1>
        <div className="flex items-center text-lg text-gray-700 mb-4">
          <span className="mr-2">✓</span>
          Password reset successful!
        </div>
        <div className="text-base text-gray-700 mb-6 text-center">
          You can now log in with your new password.
        </div>
        <button
          type="button"
          className="w-full bg-[#5985d8] text-white rounded-md py-2 font-semibold text-base hover:bg-[#466bb3] transition-colors flex items-center justify-center gap-2"
          onClick={handleBackToLogin}
        >
          <ArrowLeft size={18} />
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordUpdate;