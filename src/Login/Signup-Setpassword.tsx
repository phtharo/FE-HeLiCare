import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/signup_background.jpg";
import { Eye, EyeOff } from "lucide-react";

function validatePassword(password: string) {
  return {
    length: password.length >= 8,
    upperLower: /[a-z]/.test(password) && /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^a-zA-Z0-9]/.test(password),
  };
}

interface SignupSetPasswordProps {
  onLoginClick: () => void;
}

const SignupSetPassword: React.FC<SignupSetPasswordProps> = ({ onLoginClick }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null); // Lỗi từ server
  // const [rememberMe, setRememberMe] = useState(false); // Trạng thái "Remember Me"
  const [successMessage, setSuccessMessage] = useState(false); // Trạng thái hiển thị thông báo thành công

  const status = validatePassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!status.length || !status.upperLower || !status.number || !status.symbol) {
      setError("Password does not meet all requirements.");
      return;
    }
    if (password !== confirm) {
      setConfirmError("Passwords do not match.");
      return;
    }
    setError(null);
    setConfirmError(null);

    try {
      // Giả lập API call
      const response = await fakeApiCall({ password });
      if (response.success) {
        setSuccessMessage(true);
        setTimeout(() => {
          navigate("/signin");
        }, 3000);
      } else {
        setServerError(response.message ?? "An unknown error occurred."); // Hiển thị lỗi từ server
      }
    } catch (err) {
      setServerError("An unexpected error occurred. Please try again later.");
    }
  };


  return (
    <div className="relative min-h-screen w-full">
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
      <div className="fixed inset-0 flex items-center justify-center z-10">
        {/* Link đăng nhập góc phải */}
        <div className="absolute top-6 right-10 text-sm text-gray-700">
          Already have an account?{" "}
          <button type="button" className="underline" onClick={onLoginClick}>
            Log in
          </button>
        </div>
        <div className="bg-white rounded-[2rem] shadow-xl w-full max-w-md mx-auto p-10 flex flex-col items-center justify-center">
          {successMessage ? (
            // Hiển thị thông báo thành công
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4 text-[#5985d8]">
                Registration Successful!
              </h2>
              <p className="text-sm text-gray-600">
                You will be redirected to the login page shortly.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-6 text-center text-[#5985d8]">
                Set Password
              </h2>
              <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="flex items-center -mb-5">
                  <label
                    htmlFor="password"
                    className="block text-sm font-normal text-gray-700 flex-1 text-left"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-[#5985d8] p-0 rounded focus:outline-none ml-2"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-md border border-gray-400 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#5985d8]"
                  placeholder="Password"
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  autoComplete="new-password"
                />
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-600 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-lg ${
                        status.length ? "text-[#5985d8]" : "text-gray-400"
                      }`}
                    >
                      ●
                    </span>
                    Use 8 or more characters
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-lg ${
                        status.upperLower ? "text-[#5985d8]" : "text-gray-400"
                      }`}
                    >
                      ●
                    </span>
                    Use upper and lower case letters (e.g. Aa)
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-lg ${
                        status.number ? "text-[#5985d8]" : "text-gray-400"
                      }`}
                    >
                      ●
                    </span>
                    Use a number (e.g. 1234)
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-lg ${
                        status.symbol ? "text-[#5985d8]" : "text-gray-400"
                      }`}
                    >
                      ●
                    </span>
                    Use a symbol (e.g. !@#$)
                  </div>
                </div>
                {error && <div className="text-sm text-red-500 mb-2">{error}</div>}
                <div className="flex items-center -mb-5">
                  <label
                    htmlFor="confirm"
                    className="block text-sm font-normal text-gray-700 flex-1 text-left"
                  >
                    Confirm Password
                  </label>
                  <button
                    type="button"
                    className="text-[#5985d8] p-0 rounded focus:outline-none ml-2"
                    onClick={() => setShowConfirm((v) => !v)}
                    tabIndex={-1}
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <input
                  type={showConfirm ? "text" : "password"}
                  className="w-full rounded-md border border-gray-400 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#5985d8]"
                  placeholder="Confirm Password"
                  id="confirm"
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    setConfirmError(null);
                  }}
                  autoComplete="new-password"
                />
                {confirmError && (
                  <div className="text-sm text-red-500 mb-2">{confirmError}</div>
                )}
            
                
                <button
                  type="submit"
                  className="w-full bg-[#5985d8] text-white rounded-md py-2 font-semibold text-base hover:bg-[#466bb3] transition-colors mt-2"
                >
                  Sign up
                </button>
                <div className="text-xs text-gray-500 text-center mt-2">
                  By creating an account, you agree to the{" "}
                  <a href="#" className="underline">
                    Terms of use
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline">
                    Privacy Policy
                  </a>
                  .
                </div>
                {serverError && (
                  <div className="text-sm text-red-500 mt-4 text-center">
                    {serverError}
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Giả lập API call
const fakeApiCall = async (data: { password: string }) => {
  return new Promise<{ success: boolean; message?: string }>((resolve) => {
    setTimeout(() => {
      if (data.password === "error") {
        resolve({ success: false, message: "Server error: Password is invalid." });
      } else {
        resolve({ success: true });
      }
    }, 1000);
  });
};

export default SignupSetPassword;