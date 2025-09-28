import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordUpdate({ onBackToLogin }: { onBackToLogin?: () => void }) {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold text-[#5985d8] mb-6 mt-8 text-center">HeLiCare</h1>
        <div className="flex items-center text-lg text-gray-700 mb-2">
          <span className="mr-2">✓</span>
          Password reset successful !
        </div>
        <div className="text-base text-gray-700 mb-8 text-center">
          You can now log in with your new password.
        </div>
        <button
          type="button"
          className="w-full bg-[#5985d8] text-white rounded-md py-2 font-semibold text-base hover:bg-[#466bb3] transition-colors flex items-center justify-center gap-2"
          onClick={onBackToLogin}
        >
          <ArrowLeft size={18} />
          Back to Login
        </button>
      </div>
    </div>
  );
}