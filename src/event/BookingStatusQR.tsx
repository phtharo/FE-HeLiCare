import React, { useMemo } from "react";
import QRCode from "react-qr-code";
import { useLocation, useNavigate } from "react-router-dom";

const PRIMARY = "#5985D8";

type BookingStatus =
    | "PENDING"
    | "CONFIRMED"
    | "COMPLETED"
    | "EXPIRED"
    | "CANCELLED"
    | "OVER_CAPACITY";

interface Props {
    bookingId: string;
    residentName: string;
    time: string; // "2025-09-27T10:00:00"
    status: BookingStatus;
}

export default function BookingStatusQR() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as Props | undefined;

    if (!state) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500 font-semibold">
                    No booking data provided.
                </p>
            </div>
        );
    }

    const { bookingId, residentName, time, status } = state;

    const formattedTime = useMemo(() => {
        return new Date(time).toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }, [time]);

    const getStatusColor = () => {
        switch (status) {
            case "CONFIRMED":
                return "bg-green-600";
            case "COMPLETED":
                return "bg-blue-600";
            case "PENDING":
                return "bg-yellow-500";
            case "CANCELLED":
                return "bg-gray-500";
            case "OVER_CAPACITY":
                return "bg-red-600";
            case "EXPIRED":
                return "bg-gray-400";
            default:
                return "bg-gray-300";
        }
    };

    const stringifyQR = JSON.stringify({
        bookingId,
        residentName,
        time,
        status,
    });

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#F4F6FB]">
            {/* Back Button */}
            <button
                onClick={() => navigate("/resident-schedule")}
                className="absolute top-4 left-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-2 shadow-md"
            >
                ← Back
            </button>

            <div className="w-full max-w-lg px-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center print:shadow-none">
                    <div className="text-2xl font-bold text-[#5985D8] mb-2">
                        HeLiCare
                    </div>

                    <p className="text-gray-500 text-sm mb-6">
                        Your booking QR code
                    </p>

                    <div className="flex justify-center mb-4">
                        <QRCode value={stringifyQR} size={180} />
                    </div>

                    <div className={`text-white font-semibold py-2 rounded-lg ${getStatusColor()}`}>
                        {status.replace("_", " ")}
                    </div>

                    <div className="mt-4 text-left text-sm text-gray-700">
                        <p><strong>Name:</strong> {residentName}</p>
                        <p><strong>Booking ID:</strong> {bookingId}</p>
                        <p><strong>Slot:</strong> {formattedTime}</p>
                    </div>

                    <button
                        onClick={() => window.print()}
                        className="mt-6 w-full py-3 rounded-lg text-white hover:opacity-90 transition print:hidden"
                        style={{ background: PRIMARY }}
                    >
                        Print / Save QR
                    </button>
                </div>
            </div>
        </div>
    );
}
