import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from "../assets/signup_background.jpg";

function validateEmail(email: string): { valid: boolean; error?: string } {
  // Simple email regex for demonstration purposes
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { valid: false, error: "Email is required." };
  }
  if (!re.test(email)) {
    return { valid: false, error: "Please enter a valid email address." };
  }
  return { valid: true };
}

interface SignupEmailProps {
  onLoginClick: () => void;
  onVerify: () => void;
}

const SignupEmail: React.FC<SignupEmailProps> = ({ onLoginClick, onVerify }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateEmail(email);
    setError(validation.error || null);
    
    if (validation.valid) {
      onVerify();
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
          Already have an account?{' '}
          <button type="button" className="underline" onClick={onLoginClick}>
            Log in
          </button>
        </div>
        <div className="bg-white rounded-[2rem] shadow-xl w-full max-w-lg mx-auto p-10 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-semibold mb-8 text-center text-[#5985d8]">Create an account</h2>
          <form
            className="w-full flex flex-col gap-6"
            onSubmit={handleSubmit}
          >
            <label htmlFor="email" className="block text-sm font-normal text-gray-700 -mb-2">
              Email address
            </label>
            <input
              type="email"
              className={`w-full rounded-md border px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#5985d8] mt-0 ${error ? 'border-red-500' : 'border-gray-400'}`}
              placeholder="example@gmail.com"
              aria-label="Email"
              id="email"
              maxLength={320}
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                setError(null);
              }}
              autoComplete="email"
            />
            {error && (
              <div className="text-sm text-red-500 mt-1">{error}</div>
            )}
            <button
              type="submit"
              className="w-full bg-[#5985d8] text-white rounded-full py-3 font-semibold text-lg hover:bg-[#466bb3] transition-colors"
            >
              Continue
            </button>
            <div className="text-xs text-gray-500 text-center mt-2">
              By creating an account, you agree to the <a href="#" className="underline">Terms of use</a> and <a href="#" className="underline">Privacy Policy</a>.
            </div>
          </form>
      </div>
     </div>
    </div>
  );
}

export default SignupEmail;