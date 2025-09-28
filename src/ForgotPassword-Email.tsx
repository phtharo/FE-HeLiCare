import { useState } from "react";

export default function ForgotPasswordEmail({ onSend }: { onSend?: (email: string) => void }) {
	const [email, setEmail] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) {
			setError("Email is required");
			return;
		}
		const emailRegex = /^[a-zA-Z0-9._+-]+@gmail\.com$/;
		if (!emailRegex.test(email)) {
			setError("Email must be in format example@gmail.com");
			return;
		}
		setError(null);
		if (onSend) onSend(email);
	};

	return (
		<div className="min-h-screen w-screen flex items-center justify-center bg-white">
    <form className="w-full max-w-md flex flex-col items-center" onSubmit={handleSubmit}>
				<h1 className="text-3xl font-bold text-[#5985d8] mb-4 mt-8 text-center">HeLiCare</h1>
				<div className="text-center text-base text-gray-700 mb-8">
					Enter the email address you registered to<br />
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
					className="w-full bg-[#5985d8] text-white rounded-md py-2 font-semibold text-base hover:bg-[#466bb3] transition-colors"
				>
					Send OTP code
				</button>
			</form>
		</div>
	);
}
