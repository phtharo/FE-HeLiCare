import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function validatePassword(pw: string) {
  return {
    length: pw.length >= 8,
    upperLower: /[a-z]/.test(pw) && /[A-Z]/.test(pw),
    number: /\d/.test(pw),
    symbol: /[!@#$%^&*(),.?":{}|<>]/.test(pw),
  };
}

interface ForgotPasswordResetProps {
  onSuccess: () => void;
}

const ForgotPasswordReset: React.FC<ForgotPasswordResetProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

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

  const pwValid = validatePassword(password);

  const handleReset = () => {
    navigate("/forgotpassword-update");
  };

  const handleBack = () => {
    navigate("/forgotpassword-otp");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;
    if (!password) {
      setError("Password is required");
      hasError = true;
    } else if (!pwValid.length || !pwValid.upperLower || !pwValid.number || !pwValid.symbol) {
      setError("Password does not meet all requirements");
      hasError = true;
    } else {
      setError(null);
    }
    if (!confirm) {
      setConfirmError("Confirm password is required");
      hasError = true;
    } else if (confirm !== password) {
      setConfirmError("Passwords do not match");
      hasError = true;
    } else {
      setConfirmError(null);
    }
    if (hasError) return;
    handleReset();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <form className="w-full max-w-lg flex flex-col items-center px-6" onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold text-[#5985d8] mb-2 text-center">HeLiCare</h1>
        <div className="text-xl font-medium text-center mb-8">Create a New Password</div>

        {/* Password */}
        <div className="w-full mb-2">
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="text-base font-normal text-gray-700">Password</label>
            <button
              type="button"
              tabIndex={-1}
              className="p-0 bg-transparent border-none focus:outline-none"
              onClick={() => setShowPassword(v => !v)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#5985d8]"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          {error && <div className="text-sm text-red-500 mt-1">{error}</div>}

          {/* Password requirements - 2 dòng, mỗi dòng 2 ý */}
          <div className="mt-2 text-gray-400 text-sm grid grid-cols-[0.9fr_1.1fr] gap-x-4 w-full">
            <div className={`flex items-center whitespace-nowrap ${pwValid.length ? "text-[#5985d8]" : ""}`}>
              <span className="mr-1">●</span>Use 8 or more characters
            </div>
            <div className={`flex items-center whitespace-nowrap ${pwValid.upperLower ? "text-[#5985d8]" : ""}`}>
              <span className="mr-1">●</span>Use upper and lower case letters (e.g. Aa)
            </div>
            <div className={`flex items-center whitespace-nowrap ${pwValid.number ? "text-[#5985d8]" : ""}`}>
              <span className="mr-1">●</span>Use a number (e.g. 1234)
            </div>
            <div className={`flex items-center whitespace-nowrap ${pwValid.symbol ? "text-[#5985d8]" : ""}`}>
              <span className="mr-1">●</span>Use a symbol (e.g. !@#$)
            </div>
          </div>



        </div>
        {/* Confirm Password */}
        <div className="w-full mb-6">
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="confirm" className="text-base font-normal text-gray-700">Confirm Password</label>
            <button
              type="button"
              tabIndex={-1}
              className="p-0 bg-transparent border-none focus:outline-none"
              onClick={() => setShowConfirm(v => !v)}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <input
            id="confirm"
            type={showConfirm ? "text" : "password"}
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#5985d8]"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            autoComplete="new-password"
          />
          {confirmError && <div className="text-sm text-red-500 mt-1">{confirmError}</div>}
        </div>

        <button
          type="submit"
          className="w-full bg-[#5985d8] text-white rounded-md py-2 font-semibold text-base hover:bg-[#466bb3] transition-colors mb-2"
        >
          Reset Password
        </button>
        <button
          type="button"
          onClick={handleBack}
          className="w-full bg-gray-200 text-gray-700 rounded-md py-2 font-semibold text-base hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordReset;