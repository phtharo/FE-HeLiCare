


import { useEffect, useState } from "react";
import bgImage from "./assets/signup_background.jpg";

export default function SignupVerify({ onBack, onVerified }: { onBack?: () => void; onVerified?: () => void }) {
  const [seconds, setSeconds] = useState(300); // 5 phút = 300 giây
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [lastOtp, setLastOtp] = useState<string | null>(null);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [seconds]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setOtpError("OTP is required");
      return;
    }
    if (otp.length !== 6 || !/^[0-9]{6}$/.test(otp)) {
      setOtpError("OTP must be exactly 6 digits.");
      return;
    }
    if (lastOtp && otp === lastOtp) {
      setOtpError("OTP must be unique and not reused.");
      return;
    }
    setOtpError(null);
    setLastOtp(otp);
    if (onVerified) onVerified();
  };

  return (
    <div className="relative min-h-screen w-full">
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
      <div className="fixed inset-0 flex items-center justify-center z-10">
        {/* Nút quay lại góc phải */}
        <div className="absolute top-6 right-10 text-sm text-gray-700">
          <button type="button" className="underline" onClick={onBack}>
            &larr; Back
          </button>
        </div>
        <div className="bg-white rounded-[2rem] shadow-xl w-full max-w-lg mx-auto p-10 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold mb-4 text-center text-[#5985d8]">Verify your email</h2>
          <div className="text-base text-gray-700 text-center mb-6">An OTP has just been sent to your email address.<br/>Please check your inbox and enter the code below.</div>
          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              className={`w-full rounded-md border px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#5985d8] ${otpError ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={e => {
                // Chỉ cho phép nhập số
                const val = e.target.value.replace(/[^0-9]/g, "");
                setOtp(val);
                setOtpError(null);
              }}
              autoComplete="one-time-code"
            />
            {otpError && (
              <div className="text-sm text-red-500 mt-1">{otpError}</div>
            )}
            <div className="flex justify-between text-sm text-gray-500 mt-2 mb-1">
              <span>Code expires in 5 minutes</span>
              <span>{formatTime(seconds)}</span>
            </div>
            <div className="text-xs text-gray-500 mb-2">*Your OTP is confidential. Never disclose it to anyone.</div>
            <button
              type="submit"
              className="w-full bg-[#5985d8] text-white rounded-md py-3 font-semibold text-lg hover:bg-[#466bb3] transition-colors"
            >
              Verify
            </button>
            <div className="flex items-center mt-2">
              <button
                type="button"
                className={`flex items-center text-[#5985d8] text-sm ${seconds > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={seconds > 0}
                onClick={() => setSeconds(300)}
              >
                <span className="text-[#5985d8]">&rarr;</span>
                <span className="ml-1 underline">Didn’t receive the code? Resend</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
