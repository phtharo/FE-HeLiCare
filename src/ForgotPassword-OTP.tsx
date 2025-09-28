import { useState, useEffect } from "react";

export default function ForgotPasswordOTP({ onVerify, onResend }: { onVerify?: (otp: string) => void; onResend?: () => void }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(120); // 2 minutes (120 seconds)

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
      setError("OTP is required");
      return;
    }
    if (!/^[0-9]{6}$/.test(otp)) {
      setError("OTP must be 6 digits");
      return;
    }
    setError(null);
    if (onVerify) onVerify(otp);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-white">
      <form className="w-full max-w-md flex flex-col items-center" onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold text-[#5985d8] mb-4 mt-8 text-center">HeLiCare</h1>
        <div className="text-center text-base text-gray-700 mb-8">
          An OTP has just been sent to your email address.<br />
          Please check your inbox and enter the code below.
        </div>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          className="w-full rounded-md border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#5985d8] mb-2 text-center"
          placeholder="Enter OTP code"
          value={otp}
          onChange={e => {
            setOtp(e.target.value.replace(/[^0-9]/g, ""));
            setError(null);
          }}
          autoComplete="one-time-code"
        />
        {error && <div className="text-sm text-red-500 mb-2 w-full text-left">{error}</div>}
        <div className="flex justify-between w-full text-sm text-gray-500 mt-2 mb-1">
          <span>Code expires in 2 minutes</span>
          <span className="font-bold text-[#5985d8]">{formatTime(seconds)}</span>
        </div>
        <div className="text-xs text-gray-500 mb-4 w-full text-left">*Your OTP is confidential. Never disclose it to anyone.</div>
        <button
          type="submit"
          className="w-full bg-[#5985d8] text-white rounded-md py-2 font-semibold text-base hover:bg-[#466bb3] transition-colors mb-4"
        >
          Verify
        </button>
        <button
          type="button"
          className="flex items-center text-[#5985d8] text-sm gap-1 hover:underline"
          disabled={seconds > 0}
          onClick={() => {
            setSeconds(120);
            setOtp(""); // Reset OTP input field
            if (onResend) onResend();
          }}
        >
          <span>&rarr;</span>
          <span>Resend OTP</span>
        </button>
      </form>
    </div>
  );
}
