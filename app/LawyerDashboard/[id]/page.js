"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// Apppointment details view Page
const AppointmentDetails = ({ params }) => {

    // Basic data
    const router = useRouter();
    const { id } = use(params);
    const { data: session } = useSession();
    const [appointment, setAppointment] = useState(null);

    // get Appointment details
    useEffect(() => {
        if (id) {
            fetch(`/api/book/appointment?id=${id}`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.appointment) {
                        setAppointment(data.appointment);
                    }
                });
        }
    }, [id]);

    // Accept or reject appointment
    const handleAction = async (action) => {
        const res = await fetch(`/api/book/appointment/updateAppointment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status: action }),
        });
        const result = await res.json();
        if (res.ok) {
            alert(`Appointment ${action}`);
            router.push("/LawyerDashboard");
        } else {
            alert(result.message || "Something went wrong");
        }
    };

    if (!appointment) return <p>Loading...</p>;
    if (appointment && session) {
        return (
            <div className="space-y-6">
                <div key={appointment._id} className="bg-[#2c2c2c] p-6 rounded-lg border border-gray-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p><span className="font-semibold">From:</span> {appointment.userName}</p>
                            <p><span className="font-semibold">To:</span> {session?.user.name}</p>
                        </div>
                        <div>
                            <p><span className="font-semibold">Category:</span> {appointment.category || 'Not Specified'}</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p><span className="font-semibold">Date:</span> {appointment.date}</p>
                        <p><span className="font-semibold">Time:</span> {appointment.time}</p>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                        <p><span className="font-semibold">Duration:</span> {appointment.duration || '30 min'}</p>
                        <p className={`ml-2 px-3 py-1 rounded text-sm ${appointment.status === 'confirmed' ? 'bg-green-600' : appointment.status === 'pending' ? 'bg-yellow-600' : 'bg-red-600'}`}>
                            <span className="capitalize">{appointment.status}</span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-4 mt-6">
                    <button onClick={() => handleAction("confirmed")} className="bg-green-500 cursor-pointer text-white px-4 py-2 rounded">Accept</button>
                    <button onClick={() => handleAction("cancelled")} className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded">Decline</button>
                </div>
            </div>
        );
    };
}

export default AppointmentDetails;
