"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut, update, getSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import defaultimg from "@/public/images/defaultprofile.png";
import Loading from "@/app/components/LoadingPage";

// Lawyer Dashboard Layout
const LawyerDashboard = ({ children }) => {

  // Basic States
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Basic data
  const [closeApp, setCloseApp] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Check for authentication
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/Auth/Login");
    }
  }, [status, router]);

  // Fetch all pending Appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`/api/book/pendingApp/lawyerApp?lawyerId=${session.user.id}`);
        const data = await res.json();
        if (res.ok) {
          setAppointments(data.appointments || []);
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    if (status === "authenticated" && session?.user?.id && pathname === "/LawyerDashboard") {
      fetchAppointments();
      setCloseApp(session.user.close_appoitment);
    }
  }, [pathname, session, status]);

  // Basic Function
  const SpannedText = ({ text = "" }) => (
    <>
      {text.split(" ").map((char, index) => (
        <span key={index} className="hover:text-[#FF6F61]">{char + " "}</span>
      ))}
    </>
  );

  // on Click Shut Down Appointments
  const handleAction = async (action) => {
    const res = await fetch(`/api/book/appointment/closeAppointment?lawyerId=${session.user.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ close_appoitment: action }),
    });
    if (res.ok) {
      setCloseApp(!closeApp)
      await getSession();
      router.push("/LawyerDashboard");
      router.refresh();

    }
  };

  if (status === "loading") return <Loading />;
  if (!session) return null;

  if (session) {
    return (
      <>
        <div className="w-[100vw] min-h-screen relative bg-[#151515] text-[#F1F1F1]">
          <div className="profile relative flex flex-wrap items-center px-2 md:px-10 lg:px-20 py-4 gap-6">
            <Image
              className="rounded-full"
              src={defaultimg}
              alt="Profile"
              width={80}
              height={80}
              unoptimized={!defaultimg}
            />
            <div className="profileData flex flex-col items-start relative z-[999]">
              <Link href={"/LawyerDashboard"} className="text-2xl md:text-3xl font-bold">
                <SpannedText text={session?.user?.name} />
              </Link>
              <p className="text-sm">{session.user.email}</p>

              {/* 👇 Approval Status UI */}
              {session.user.isApproved && (
                <span
                  className={`text-xs font-semibold mt-1 px-3 py-1 rounded-full shadow-sm ${session.user.isApproved === "Approved"
                    ? "bg-green-600 text-white"
                    : session.user.isApproved === "Rejected"
                      ? "bg-red-600 text-white"
                      : "bg-yellow-400 text-black"
                    }`}
                  style={{ fontFamily: "var(--font-tektur)" }}
                >
                  {session.user.isApproved === "Approved"
                    ? "Approved"
                    : session.user.isApproved === "Rejected"
                      ? "Rejected"
                      : "Pending Approval"
                  }
                </span>
              )}
            </div>

            <div className="flex gap-3 flex-wrap w-[330px]">
              {session.user.categories && (
                <div className="flex gap-3 flex-wrap w-full md:w-auto mt-2">
                  {Object.entries(session.user.categories).map(([key, value], index) =>
                    value?.name && (
                      <span
                        key={index}
                        className="px-3 py-1 cursor-pointer border-2 border-[#fefefe] hover:text-[#161616] hover:bg-[#ebebeb] text-[#ebebeb] flex items-center justify-center rounded-lg text-sm font-medium hover:scale-105 transition-all"
                        style={{ fontFamily: "var(--font-tektur)" }}
                      >
                        {value.name}
                      </span>
                    )
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-4 flex-wrap">
              <Link
                href={"/LawyerDashboard/Edit"}
                className="flex items-center z-[9999] border border-[#dcdcdc] hover:border-[#ffffff] px-2 py-0.5 rounded-lg bg-[#dcdcdc] text-xl hover:-translate-y-1 transition-all ease-in-out duration-150 hover:bg-[#ffffff] text-[#121212]"
                style={{ fontFamily: "var(--font-tektur)" }}
              >
                <span>{session.user.isApproved === 'Approved' && !session.user.upi ? "Add UPI" : "Edit"}</span>
                <div className="cursor-pointer mt-1 px-2 editInc rounded-lg">
                  <lord-icon
                    src="https://cdn.lordicon.com/gwlusjdu.json"
                    trigger="hover"
                    style={{ width: "25px", height: "25px" }}
                  />
                </div>
              </Link>
            </div>

            <div className="ml-auto flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="relative flex items-center z-[9999] justify-center cursor-pointer hover:-translate-y-1 hover:text-[#000000] bg-[#dcdcdc] text-[#121212] font-semibold px-4 py-0.5 rounded-full shadow-md hover:bg-[#ffffff] transition-all ease-in-out duration-150"
                >
                  <lord-icon
                    src="https://cdn.lordicon.com/aksvbzmu.json"
                    trigger="loop"
                    stroke="bold"
                    style={{ width: "30px", height: "30px" }}
                  />
                  <span className="absolute -top-2 -right-2  bg-red-600 text-white text-[10px] min-w-[18px] h-[18px] px-[6px] flex items-center justify-center rounded-full shadow-md">
                    {appointments.length}
                  </span>
                </button>

                {showDropdown && (
                  <div className="absolute top-12 -right-25 sm:-right-0 w-80 max-h-[300px] overflow-y-auto bg-white text-black rounded-lg shadow-lg z-[9999] p-2">
                    {appointments.length === 0 ? (
                      <p className="text-sm p-2">No pending appointments</p>
                    ) : (
                      appointments.map((appt) => (
                        <Link
                          href={`/LawyerDashboard/${appt._id}`}
                          key={appt._id}
                          className="block px-3 py-2 hover:bg-gray-100 rounded-md"
                        >
                          <div className="font-medium">{appt.userName}</div>
                          <div className="text-xs text-gray-500">Date: {appt.date} Time: {appt.time}  </div>
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => signOut({ callbackUrl: "/Auth/Login/Lawyer" })}
                className="ml-auto flex items-center z-[9999] justify-center cursor-pointer hover:-translate-y-1 hover:text-[#000000] bg-[#dcdcdc] text-[#121212] font-semibold px-5 py-2 rounded-full shadow-md hover:bg-[#ffffff] transition-all ease-in-out duration-150"
              >
                Sign Out
              </button>
            </div>
          </div>

          <div className="bg-white opacity-25 mx-auto h-[1px] w-[95vw]"></div>

          {/* Navigation Bar (touching divider) */}
          <div className="flex gap-0 mx-15 items-center justify-start ">
            <Link
              href="/LawyerDashboard/Cases"
              className={`px-6 py-3 text-sm md:text-base font-medium ${pathname === "/LawyerDashboard/Cases"
                ? "bg-white text-black border-t-2 border-x-2 border-white"
                : "text-gray-400 hover:text-white transition-all"
                }`}
            >
              Cases
            </Link>

            <Link
              href="/LawyerDashboard/Appointments"
              className={`px-6 py-3 text-sm md:text-base font-medium ${pathname === "/LawyerDashboard/Appointments"
                ? "bg-white text-black border-t-2 border-x-2 border-white"
                : "text-gray-400 hover:text-white transition-all"
                }`}
            >
              Appointments
            </Link>
          </div>

          <div className="content flex items-center justify-center gap-5 w-full py-5 px-4">
            {children}
          </div>
        </div>

        <div className="bg-[#191919] h-1 w-full"></div>

        {closeApp ? (
          <button
            onClick={() => handleAction("false")}
            className="fixed z-[10000] cursor-pointer bottom-6 right-6 bg-[#e0e0e0] hover:bg-[#ffffff] hover:text-[#000000] text-[#181818] px-6 py-3 rounded-full shadow-lg flex items-center gap-2 text-sm md:text-base transition-all ease-in-out duration-200"
            style={{ fontFamily: "var(--font-tektur)" }}
          >
            <span>Open Appointment</span>
          </button>
        ) : (
          <button
            onClick={() => handleAction("true")}
            className="fixed z-[10000] cursor-pointer bottom-6 right-6 bg-[#e0e0e0] hover:bg-[#ffffff] hover:text-[#000000] text-[#181818] px-6 py-3 rounded-full shadow-lg flex items-center gap-2 text-sm md:text-base transition-all ease-in-out duration-200"
            style={{ fontFamily: "var(--font-tektur)" }}
          >
            <span>Close Appointment</span>
          </button>
        )}
      </>
    );
  }
};

export default LawyerDashboard;
