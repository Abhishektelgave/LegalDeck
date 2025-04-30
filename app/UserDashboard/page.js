'use client';
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAppointmentStore } from "@/app/store/appointment";

const UserDashboard = () => {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState([]);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { setAppt } = useAppointmentStore();
  const router = useRouter();

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

  useEffect(() => {
    if (appointments.length > 0) {
      const now = new Date();
      const upcoming = appointments.find(appt => {
        const apptStart = new Date(`${appt.date}T${appt.time}`);
        const apptEnd = new Date(apptStart.getTime() + 60 * 60 * 1000); // 1 hour default
        return now < apptEnd;
      });
      setNextAppointment(upcoming || null);
    }
  }, [appointments]);

  const handleCaseDetail = (appointment) => {
    router.push(`/CaseProgress/${appointment.caseId}`);
  };

  const handleStartCall = (appointment) => {
    router.push(`/callRoom?roomId=${appointment._id}`);
  };

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

  return (
    <div className="relative w-full min-h-screen bg-[#151515] p-4 sm:p-8 text-white">
      <h1 className="text-3xl font-bold mb-6 border-b border-white/10 pb-4">
        Next Appointment
      </h1>
      {loading ? (
        <p className="text-white/70">Loading...</p>
      ) : message ? (
        <p className="text-red-400">{message}</p>
      ) : !nextAppointment ? (
        <p className="text-yellow-400">No next appointment listed.</p>
      ) : (
        <div className="bg-black border w-[80vw] sm:w-[50vw] mx-auto border-white/30 p-4 sm:p-6 rounded-xl shadow-md hover:shadow-white/40 transition-all duration-350 ease-in-out relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />

          <div className="flex justify-between items-center mb-4">
            <div className="text-left">
              <p className="text-xs uppercase text-white/60">From</p>
              <p className="text-sm font-semibold">{session?.user?.name}</p>
            </div>
            <div className="w-1/3 h-[2px] bg-white/20 mx-2" />
            <div className="text-right">
              <p className="text-xs uppercase text-white/60">To</p>
              <p className="text-sm font-semibold">{nextAppointment.lawyerName}</p>
            </div>
          </div>

          <div className="text-center -mt-2">
            <span className="px-4 py-1 text-xs tracking-wider uppercase border border-white rounded-full text-white">
              {nextAppointment.category || "Not Specified"}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm mt-4">
            <span>
              <p><span className="font-medium">Date:</span> {nextAppointment.date}</p>
              <p><span className="font-medium">Time:</span> {nextAppointment.time}</p>
            </span>
            <span className="font-medium">Duration: {nextAppointment.duration || '60 min'}</span>
          </div>

          <div className="flex justify-between items-center mt-4 mb-4 text-sm">
            <span />
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${nextAppointment.status === "confirmed"
                  ? "bg-green-600"
                  : nextAppointment.status === "pending"
                    ? "bg-yellow-600"
                    : "bg-red-600"
                }`}
            >
              {nextAppointment.status}
            </span>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => handleCaseDetail(nextAppointment)}
              className="border cursor-pointer border-white text-white px-4 py-2 rounded hover:bg-white hover:text-black transition duration-200 text-sm"
            >
              View Details
            </button>
            {isWithinCallWindow(nextAppointment.date, nextAppointment.time, nextAppointment.duration) && (
              <button
                onClick={() => handleStartCall(nextAppointment)}
                className="bg-white cursor-pointer text-black px-4 py-2 rounded hover:bg-gray-300 transition duration-200 text-sm"
              >
                Join Video Call
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
