import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/signup_background.jpg"; // Import hình nền

interface SignupVerifyProps {
  onBack: () => void;
  onVerified: () => void;
}

const SignupVerify: React.FC<SignupVerifyProps> = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(120); // Thời gian đếm ngược (120s)
  const [resendDisabled, setResendDisabled] = useState(true); // Trạng thái nút resend

  // Đếm ngược thời gian
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setResendDisabled(false); // Hết thời gian thì nút resend được kích hoạt
    }
  }, [timeLeft]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError(null);

      // Auto focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    navigate('/signup-setpassword');
  };

  const handleResend = () => {
    if (!resendDisabled) {
      setOtp(['', '', '', '', '', '']);
      setError(null);
      setTimeLeft(120); // Reset thời gian đếm ngược
      setResendDisabled(true); // Vô hiệu hóa nút resend
      // Logic gửi lại OTP
    }
  };

  const handleBack = () => {
    navigate('/signup-email'); // Điều hướng về trang trước đó
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Nền hình ảnh */}
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center -z-10"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>

      {/* Nội dung */}
      <div className="fixed inset-0 flex items-center justify-center z-10">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
          <h1 className="!text-xl font-bold text-[#5985d8] mb-4 text-center">Verify your email</h1>
          <p className="text-sm text-gray-600 text-center mb-6">
            An OTP has just been sent to your email address.<br />
            Please check your inbox and enter the code below.
          </p>

          {/* OTP Input */}
          <div className="flex justify-center gap-2 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric" // Chỉ cho phép nhập số
                maxLength={1}
                value={digit}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, ""); // Loại bỏ ký tự không phải số
                  handleOtpChange(index, value);
                }}
                className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5985d8]"
              />
            ))}
          </div>
          {error && <p className="text-sm text-red-500 mb-4 text-center">{error}</p>}

          {/* Resend */}
          <div className="flex justify-center items-center text-sm text-gray-500 mb-4">
            <span>Didn't receive the code? </span>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendDisabled}
              className={`ml-2 ${
                resendDisabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#5985d8] hover:underline"
              }`}
            >
              Resend
            </button>
            <span className="ml-4 font-bold text-[#5985d8]">{timeLeft}s</span>
          </div>

          {/* Verify Button */}
          <button
            type="button"
            onClick={handleVerify}
            className="w-full bg-[#5985d8] text-white rounded-md py-2 font-semibold text-sm hover:bg-[#466bb3] mt-4"
          >
            Verify Code
          </button>

          {/* Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="w-full bg-gray-200 text-gray-700 rounded-md py-2 font-semibold text-sm hover:bg-gray-300 mt-4"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupVerify;