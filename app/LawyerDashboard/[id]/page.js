"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

const AppointmentDetails = ({ params }) => {
    const router = useRouter();
    const { id } = use(params);
    const { data: session } = useSession();
    const [appointment, setAppointment] = useState(null);

    useEffect(() => {
        if (id) {
            fetch(`/api/book/appointment?id=${id}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data && data.appointment) {
                        setAppointment(data.appointment);
                    }
                })
                
        }
    }, [id]);

    const handleConfirmed = async (appt) => {
        if (appt.caseId) {
            const res = await fetch(`/api/book/appointment/updateAppointment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: appt._id, status: 'confirmed' }),
            });
            const data = await res.json();
            if (res.ok) {
                await fetch('/api/calendar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        summary: 'LegalDeck Appointment',
                        description: 'Meeting with your lawyer via LegalDeck',
                        startTime: new Date(`${appt.date}T${appt.time}:00`).toISOString(),
                        endTime: new Date(new Date(`${appt.date}T${appt.time}:00`).getTime() + 30 * 60 * 1000).toISOString(),
                    }),
                });

                router.push("/LawyerDashboard");
            } else {
                alert(data.message || "Something went wrong");
            }
        } else {
            // Create new case
            const res1 = await fetch('/api/case', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: appt._id }),
            });
            const data1 = await res1.json();

            // Use case ID to update appointment
            const res2 = await fetch(`/api/book/appointment/updateAppointment/withCaseId`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: appt._id, caseId: data1._id, status: 'confirmed' }),
            });
            const data2 = await res2.json();
            if (res2.ok) {
                await fetch('/api/calendar/addEvent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        summary: 'LegalDeck Appointment',
                        description: 'Meeting with your lawyer via LegalDeck',
                        startTime: new Date(`${appt.date}T${appt.time}:00`).toISOString(),
                        endTime: new Date(new Date(`${appt.date}T${appt.time}:00`).getTime() + 30 * 60 * 1000).toISOString(),
                    }),
                });
                router.push("/LawyerDashboard");
            } else {
                alert(data2.message || "Something went wrong");
            }
        }
    };

    const handleCancelled = async (appt) => {
        const res = await fetch(`/api/book/appointment/updateAppointment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: appt._id, status: 'cancelled' }),
        });
        const result = await res.json();
        if (res.ok) {
            router.push("/LawyerDashboard");
        } else {
            alert(result.message || "Something went wrong");
        }
    };

    if (!appointment || !session) return null;

    return (
        <div className="min-h-screen p-2 sm:p-8 bg-[#151515] cursor-default text-white">
            <div className="max-w-3xl mx-auto bg-black border border-white/20  p-4 sm:p-8 rounded-2xl shadow-lg relative group transition duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl pointer-events-none transition-opacity duration-500" />

                <div className="mb-4 sm:mb-6">
                    <h2 className="sm:text-2xl text-sm font-bold mb-1">Appointment Details</h2>
                    <div>
                        <span className="inline-block sm:text-xs px-3 py-1 text-sm bg-white text-black rounded-full font-semibold">
                            Case ID: {appointment.caseId || "New"}
                        </span>
                        {appointment.caseId && (
                            <Link
                                href={`/CaseProgress/${appointment.caseId}`}
                                className="ml-4 text-sm text-blue-400 hover:text-blue-300 underline font-medium"
                            >
                                View Details
                            </Link>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 sm:gap-6">
                    <div>
                        <p className="text-sm text-white/70 uppercase mb-1">From</p>
                        <p className="text-lg font-medium">{appointment.userName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-white/70 uppercase mb-1">To</p>
                        <p className="text-lg font-medium">{session?.user?.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-white/70 uppercase mb-1">Category</p>
                        <p className="text-base">{appointment.category || "Not Specified"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-white/70 uppercase mb-1">Duration</p>
                        <p className="text-base">{appointment.duration || "30 min"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-white/70 uppercase mb-1">Date</p>
                        <p className="text-base">{appointment.date}</p>
                    </div>
                    <div>
                        <p className="text-sm text-white/70 uppercase mb-1">Time</p>
                        <p className="text-base">{appointment.time}</p>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm font-semibold">
                        Status:{" "}
                        <span
                            className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold capitalize ${appointment.status === "confirmed"
                                ? "bg-green-600"
                                : appointment.status === "pending"
                                    ? "bg-yellow-600"
                                    : "bg-red-600"
                                }`}
                        >
                            {appointment.status}
                        </span>
                    </p>
                </div>

                <div className="mt-8 flex gap-4 justify-end">
                    <button
                        onClick={() => handleConfirmed(appointment)}
                        className="bg-green-500 cursor-pointer hover:bg-green-600 transition px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                        Accept
                    </button>
                    <button
                        onClick={() => handleCancelled(appointment)}
                        className="bg-red-500 cursor-pointer hover:bg-red-600 transition px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                        Decline
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetails;
