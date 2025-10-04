import { useState } from "react";
import { useNavigate } from 'react-router-dom';

interface ForgotPasswordEmailProps {
    onSend: () => void;
}

const ForgotPasswordEmail: React.FC<ForgotPasswordEmailProps> = ({ onSend }) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const validateEmail = (email: string) => {
        if (!email) {
            return { valid: false, error: "Email is required" };
        }
        const emailRegex = /^[a-zA-Z0-9._+-]+@gmail\.com$/;
        if (!emailRegex.test(email)) {
            return { valid: false, error: "Email must be in format example@gmail.com" };
        }
        return { valid: true, error: null };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validation = validateEmail(email);
        setError(validation.error || null);
        
        if (validation.valid) {
            // Simulate API call
            navigate('/forgotpassword-otp'); // Thay vì onSend()
        }
    };

    return (
        <div className="fixed inset-0 grid place-items-center bg-white">
            <form className="w-full max-w-md flex flex-col items-center px-4" onSubmit={handleSubmit}>
                <h1 className="text-3xl font-bold text-[#5985d8] mb-4 text-center">HeLiCare</h1>
                <div className="text-center text-base text-gray-700 mb-8">
                    Enter the email address you registered to
                    <br />
                    receive the OTP for resetting your password.
                </div>
                <input
                    type="email"
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#5985d8] mb-4"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(null); }}
                    autoComplete="email"
                />
                {error && <div className="text-sm text-red-500 mb-2 w-full text-left">{error}</div>}
                <button
                    type="submit"
                    className="w-full bg-[#5985d8] text-white rounded-md py-2 font-semibold text-base hover:bg-[#466bb3] transition-colors mb-4"
                >
                    Send OTP code
                </button>
                {/* Nút Back */}
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="w-full bg-gray-200 text-gray-700 rounded-md py-2 font-semibold text-base hover:bg-gray-300 transition-colors"
                >
                    Back to Signin
                </button>
            </form>
        </div>
    );
}

export default ForgotPasswordEmail;