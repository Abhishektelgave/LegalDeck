'use client';
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// User Dashboard Page
const UserDashboard = () => {

  // Basic data
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const router = useRouter();

  // Fetch approved Appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`/api/book/approvedApp?userId=${session?.user.id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Failed to fetch appointments.');
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

    if (session) fetchAppointments();
  }, [session]);

  // on Click Case Progress
  const handleCaseCall = (appointment) => {
    router.push(`/CaseProgress`);
  };

  // on Click Start Call
  const handleStartCall = (appointment) => {
    router.push(`/callRoom?roomId=${appointment._id}`);
  };

  return (
    <div className="w-full min-h-screen bg-[#151515] p-8 text-white">
      <h1 className="text-3xl font-bold mb-6 border-b border-white/10 pb-4">
        Your Appointments
      </h1>

      {loading ? (
        <p className="text-white/70">Loading...</p>
      ) : message ? (
        <p className="text-red-400">{message}</p>
      ) : appointments.length === 0 ? (
        <p className="text-yellow-400">No appointments yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className="bg-black border border-white/30 p-6 rounded-xl shadow-md hover:shadow-white/40   transition-all duration-350 ease-in-out  relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />
              <div className="flex justify-between items-center mb-4">
                <div className="text-left">
                  <p className="text-xs uppercase text-white/60">From</p>
                  <p className="text-sm font-semibold">{appt.userName || "Unknown User"}</p>
                </div>

                <div className="w-1/3 h-[2px] bg-white/20 relative mx-2">
                  {/* <div className="absolute w-2 h-2 bg-white rounded-full left-0 top-1/2 -translate-y-1/2 animate-ping" />
                  <div className="absolute w-2 h-2 bg-white rounded-full right-0 top-1/2 -translate-y-1/2 animate-ping delay-200" /> */}
                </div>

                <div className="text-right">
                  <p className="text-xs uppercase text-white/60">To</p>
                  <p className="text-sm font-semibold">{appt.lawyerName}</p>
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
                <div className="w-1/3 h-[2px] bg-white/20 relative mx-2">
                </div>
                <span className="font-medium">Duration:{appt.duration || '30 min'}</span>
              </div>

              <div className="flex justify-between items-center mt-4 mb-4 text-sm">
                <p><span className="font-medium"></span></p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${appt.status === "confirmed"
                    ? "bg-green-600"
                    : appt.status === "pending"
                      ? "bg-yellow-600"
                      : "bg-red-600"
                    }`}
                >
                  {appt.status}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button onClick={() => handleCaseCall(appt)} className="border border-white cursor-pointer text-white px-4 py-2 rounded hover:bg-white hover:text-black transition duration-200 text-sm">
                  View Details
                </button>
                <button
                  onClick={() => handleStartCall(appt)}
                  className="bg-white text-black cursor-pointer px-4 py-2 rounded hover:bg-gray-300 transition duration-200 text-sm"
                >
                  Join Video Call
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
