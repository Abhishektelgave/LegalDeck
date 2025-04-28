"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import defaultimg from "@/public/images/defaultprofile.png";
import Loading from "@/app/components/LoadingPage";

const UserDashboard = ({ children }) => {

    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/Auth/Login");
        }
    }, [status, router]);

    if (status === "loading") {
        return <Loading />;
    }

    const SpannedText = ({ text = "" }) => {
        return (
            <>
                {text.split(" ").map((char, index) => (
                    <span key={index} className="hover:text-[#FF6F61] transition-all duration-200">
                        {char + " "}
                    </span>
                ))}
            </>
        );
    };

    if (session) {
        return (
            <>
                <div className="w-full min-h-screen relative bg-[#151515] text-[#F1F1F1]">
                    {/* Profile Header */}
                    <div className="profile relative flex flex-wrap items-center px-4 md:px-10 lg:px-20 py-6 gap-6">
                        <Image
                            className="rounded-full"
                            src={session.user.image || defaultimg}
                            alt="Profile"
                            width={80}
                            height={80}
                            unoptimized={session.user.image ? false : true}
                        />
                        <div className="profileData flex flex-col items-start relative z-[999]">
                            <Link href={"/UserDashboard"} className="text-2xl md:text-3xl font-bold">
                                <SpannedText text={session?.user?.name} />
                            </Link>
                            <p className="text-sm">{session.user.email}</p>
                        </div>
                        <div className="ml-auto flex items-center gap-4">
                            {/* Notification Button */}
                            <button
                                className="relative flex items-center justify-center cursor-pointer hover:-translate-y-1 hover:text-[#000000] bg-[#dcdcdc] text-[#121212] font-semibold px-4 py-1 rounded-full shadow-md hover:bg-[#ffffff] transition-all ease-in-out duration-150"
                            >
                                <div className="relative">
                                    <lord-icon
                                        src="https://cdn.lordicon.com/aksvbzmu.json"
                                        trigger="loop"
                                        stroke="bold"
                                        style={{ width: "30px", height: "30px" }}
                                    />
                                    <span className="absolute -top-2 -right-5 bg-red-600 text-white text-[10px] min-w-[18px] h-[18px] px-[6px] flex items-center justify-center rounded-full shadow-md">
                                        0
                                    </span>
                                </div>
                            </button>

                            {/* Sign Out Button */}
                            <button
                                className="flex items-center justify-center cursor-pointer hover:-translate-y-1 hover:text-[#000000] bg-[#dcdcdc] text-[#121212] font-semibold px-5 py-2 rounded-full shadow-md hover:bg-[#ffffff] transition-all ease-in-out duration-150"
                                onClick={() => signOut({ callbackUrl: "/Auth/Login" })}
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="bg-white opacity-25 mx-auto h-[1px] w-full"></div>

                    {/* Navigation Bar (touching divider) */}
                    <div className="flex gap-0 mx-15 items-center justify-start ">
                        <Link
                            href="/UserDashboard/Cases"
                            className={`px-6 py-3 text-sm md:text-base font-medium ${pathname === "/UserDashboard/Cases"
                                    ? "bg-white text-black border-t-2 border-x-2 border-white"
                                    : "text-gray-400 hover:text-white transition-all"
                                }`}
                        >
                            Cases
                        </Link>

                        <Link
                            href="/UserDashboard/Appointments"
                            className={`px-6 py-3 text-sm md:text-base font-medium ${pathname === "/UserDashboard/Appointments"
                                    ? "bg-white text-black border-t-2 border-x-2 border-white"
                                    : "text-gray-400 hover:text-white transition-all"
                                }`}
                        >
                            Appointments
                        </Link>
                    </div>

                    {/* Back Button
                    {pathname !== "/UserDashboard" && (
                        <Link href={"/UserDashboard"} className="back z-[9999] absolute top-5 left-10">
                            <Image src={backImg} width={30} alt="back_image" className="invert" />
                        </Link>
                    )} */}

                    {/* Page Content */}
                    <div className="content flex flex-col items-center justify-center w-full py-5 px-4">
                        {children}
                    </div>
                </div>

                {/* Footer Divider */}
                <div className="bg-[#191919] h-1 w-full"></div>

                {/* Floating Book Appointment Button */}
                <Link
                    href="/BookAppointment"
                    className="fixed z-[10000] bottom-6 right-6 bg-[#e0e0e0] hover:bg-[#ffffff] hover:text-[#000000] text-[#181818] px-6 py-3 rounded-full shadow-lg flex items-center gap-2 text-sm md:text-base transition-all ease-in-out duration-200"
                    style={{ fontFamily: "var(--font-tektur)" }}
                >
                    <span>Book Appointment</span>
                </Link>
            </>
        );
    }

    return null;
};

export default UserDashboard;
