import React, { useMemo } from "react";
import QRCode from "react-qr-code";
import { useLocation, useNavigate, useParams } from "react-router-dom";

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
    const { id } = useParams();

    if (!state && !id) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500 font-semibold">
                    No booking data provided.
                </p>
            </div>
        );
    }

    const bookingId = state?.bookingId || id;
    const residentName = state?.residentName || "Unknown";
    const time = state?.time || "Unknown";
    const status = state?.status || "PENDING";

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
        <div className="relative min-h-screen w-full">

            <div className="fixed inset-0 -z-10 bg-[radial-gradient(120%_120%_at_0%_100%,#dfe9ff_0%,#ffffff_45%,#efd8d3_100%)]"></div>


            {/* <button
                onClick={() => navigate("/staff-manage-event")}
                className="absolute top-6 left-6 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full px-4 py-2 shadow-md z-20"
            >
                ← Back
            </button> */}

            {/* Form center */}
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">

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
                    <button
                        onClick={() => navigate("/staff-manage-event")}
                        className="mt-3 w-full py-3 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition print:hidden"
                    >
                        ← Back to Schedule
                    </button>

                </div>
            </div>
        </div>
    );

}
