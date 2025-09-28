import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function validatePassword(pw: string) {
  return {
    length: pw.length >= 8,
    upperLower: /[a-z]/.test(pw) && /[A-Z]/.test(pw),
    number: /\d/.test(pw),
    symbol: /[!@#$%^&*(),.?":{}|<>]/.test(pw),
  };
}

export default function ForgotPasswordReset({ onSuccess }: { onSuccess?: () => void }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const pwValid = validatePassword(password);

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
    // Điều hướng sang trang forgot-password-update
    if (onSuccess) onSuccess();
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-white">
      <form className="w-full max-w-md flex flex-col items-center" onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold text-[#5985d8] mb-2 mt-8 text-center">HeLiCare</h1>
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
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-gray-400 text-sm">
            <div className={`flex items-center ${pwValid.length ? "text-[#5985d8]" : ""}`}>
              <span className="mr-2">●</span>Use 8 or more characters
            </div>
            <div className={`flex items-center ${pwValid.upperLower ? "text-[#5985d8]" : ""}`}>
              <span className="mr-2">●</span>Use upper and lower case letters (e.g. Aa)
            </div>
            <div className={`flex items-center ${pwValid.number ? "text-[#5985d8]" : ""}`}>
              <span className="mr-2">●</span>Use a number (e.g. 1234)
            </div>
            <div className={`flex items-center ${pwValid.symbol ? "text-[#5985d8]" : ""}`}>
              <span className="mr-2">●</span>Use a symbol (e.g. !@#$)
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
      </form>
    </div>
  );
}