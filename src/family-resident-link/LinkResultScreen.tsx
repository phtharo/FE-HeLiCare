//[FE] Notification of successful/failed linking results
import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

type Props = {
  success?: boolean; // true = thành công, false = thất bại
};

export default function LinkResultScreen({ success = true }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000); // auto hide sau 3s
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const bg = success ? "bg-green-100" : "bg-red-100";
  const iconColor = success ? "text-green-600" : "text-red-600";
  const textColor = success ? "text-green-800" : "text-red-800";

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${bg} transition-all`}
    >
      <div className="text-center flex flex-col items-center gap-3">
        {success ? (
          <CheckCircle2 className={`w-16 h-16 ${iconColor}`} />
        ) : (
          <XCircle className={`w-16 h-16 ${iconColor}`} />
        )}

        <h1 className={`text-2xl font-semibold ${textColor}`}>
          {success ? "Connection successful" : "Connection failed"}
        </h1>

        <p className="text-gray-600">
          {success
            ? "The information has been confirmed"
            : "Please check the link code again or try again later."}
        </p>
      </div>
    </div>
  );
}
