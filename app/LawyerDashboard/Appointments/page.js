'use client';
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useAppointmentStore } from '@/app/store/appointment';
import LoadingPage from "@/app/components/LoadingPage";

const LawyerDashboard = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { setAppt } = useAppointmentStore();

    const [appointments, setAppointments] = useState([]);
    const [completedApp, setCompletedApp] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [hasMounted, setHasMounted] = useState(false);
    const [showCompleted, setShowCompleted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const lawyerId = session?.user?.id;
                if (!lawyerId) return;

                const res = await fetch(`/api/book/approvedApp/lawyerApp?lawyerId=${lawyerId}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.message || 'Failed to fetch approved appointments.');

                const sortedAppointments = (data.appointments || []).sort((a, b) => {
                    const dateA = new Date(`${a.date}T${a.time}`);
                    const dateB = new Date(`${b.date}T${b.time}`);
                    return dateA - dateB;
                });

                setAppointments(sortedAppointments);
            } catch (err) {
                setMessage(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated' && session?.user?.id) {
            fetchAppointments();
        }
    }, [session, status]);

    function isWithinCallWindow(dateStr, timeStr, durationStr = "60") {
        try {
            const [hours, minutes] = timeStr.split(":").map(Number);
            const start = new Date(dateStr);
            start.setHours(hours, minutes, 0, 0);
            const duration = parseInt(durationStr) || 60;
            const end = new Date(start.getTime() + duration * 60000);
            const now = new Date();

            return now >= start && now <= end;
        } catch (err) {
            console.error("Invalid time window check:", err);
            return false;
        }
    }

    useEffect(() => {
        const fetchCompletedAppointments = async () => {
            try {
                const lawyerId = session?.user?.id;
                if (!lawyerId) return;

                const res = await fetch(`/api/book/completedApp?lawyerId=${lawyerId}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.message || 'Failed to fetch completed appointments.');

                const sortedCompleted = (data.appointments || []).sort((a, b) => {
                    const dateA = new Date(`${a.date}T${a.time}`);
                    const dateB = new Date(`${b.date}T${b.time}`);
                    return dateB - dateA; // reversed order
                });

                setCompletedApp(sortedCompleted);
            } catch (err) {
                setMessage(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated' && session?.user?.id) {
            fetchCompletedAppointments();
        }
    }, [session, status]);


    const handleCaseDetial = (appointment) => {
        setAppt(appointment);
        router.push(`/CaseProgress/${appointment.caseId}`);
    };

    const handleStartCall = (appointment) => {
        setAppt(appointment);
        router.push(`/callRoom?roomId=${appointment._id}`);
    };

    if (!hasMounted) return null;

    const currentAppointments = showCompleted ? completedApp : appointments;

    return (
        <div className="relative w-full mx-auto p-4 bg-[#151515] text-white rounded-lg">
            <h1 className="text-sm sm:text-3xl font-bold mb-6 border-b border-white/10 pb-4">
                Your Appointments
            </h1>
            <button
                onClick={() => setShowCompleted(!showCompleted)}
                className="absolute text-sm sm:text-lg top-3 px-1 py-1 sm:px-4 sm:py-1.5 cursor-pointer right-4 sm:right-6 border rounded-lg bg-white text-black hover:bg-gray-300"
            >
                {showCompleted ? 'Confirmed Appointments' : 'Completed Appointments'}
            </button>

            {loading ? (
                <span><LoadingPage /></span>
            ) : message ? (
                <p className="text-red-400">{message}</p>
            ) : currentAppointments.length === 0 ? (
                <span className="text-yellow-400">No appointments found.</span>
            ) : (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                    {currentAppointments.map((appt) => (
                        <div
                            key={appt._id}
                            className="bg-black border cursor-default border-white/30 p-6 rounded-xl shadow-md hover:shadow-white/40 transition-all duration-350 ease-in-out relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />

                            <div className="flex justify-between items-center mb-4">
                                <div className="text-left">
                                    <p className="text-xs uppercase text-white/60">From</p>
                                    <p className="text-sm font-semibold">{appt.userName || "Unknown User"}</p>
                                </div>

                                <div className="w-1/3 h-[2px] bg-white/20 relative mx-2" />

                                <div className="text-right">
                                    <p className="text-xs uppercase text-white/60">To</p>
                                    <p className="text-sm font-semibold">{session?.user.name}</p>
                                </div>
                            </div>

                            <div className="text-center -mt-2">
                                <span className="px-4 py-1 text-xs tracking-wider uppercase border border-white rounded-full text-white">
                                    {appt.category || "Not Specified"}
                                </span>
                            </div>

                            <div className="flex justify-between items-center text-sm mt-4">
                                <span>
                                    <p><span className="font-medium">Date:</span> {appt.date}</p>
                                    <p><span className="font-medium">Time:</span> {appt.time}</p>
                                </span>
                                <span className="font-medium">Duration: {appt.duration || '30 min'}</span>
                            </div>

                            <div className="flex justify-between items-center mt-4 mb-4 text-sm">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${appt.status === "confirmed" || appt.status === "completed"
                                    ? "bg-green-600"
                                    : appt.status === "pending"
                                        ? "bg-yellow-600"
                                        : "bg-red-600"
                                    }`}>
                                    {appt.status}
                                </span>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => handleCaseDetial(appt)}
                                    className="border border-white cursor-pointer text-white px-4 py-2 rounded hover:bg-white hover:text-black transition duration-200 text-sm"
                                >
                                    View Details
                                </button>

                                {!showCompleted && isWithinCallWindow(appt.date, appt.time, appt.duration) && (
                                    <button
                                        onClick={() => handleStartCall(appt)}
                                        className="bg-white cursor-pointer text-black px-4 py-2 rounded hover:bg-gray-300 transition duration-200 text-sm"
                                    >
                                        Join Video Call
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LawyerDashboard;
