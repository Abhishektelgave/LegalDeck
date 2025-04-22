"use client";
import React, { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LawyerContext } from "@/app/context/page";
import defaultimg from "@/public/images/defaultprofile.png";
import backImg from "@/public/images/back.png";

// Lawyer Page for booking
const lawyername = ({ children, params }) => {

    // Session data
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const { lawyername } = use(params);

    // Basic data
    const [errorMessage, setErrorMessage] = useState("");
    const [searchResult, setSearchResult] = useState(null);

    // get Lawyer detail profilw
    useEffect(() => {
        const fetchSearchResult = async () => {
            if (lawyername && session) {
                try {
                    const res = await fetch(`/api/search/lawyer?lawyer=${lawyername}`);
                    const lawyer = await res.json();

                    if (lawyer.status === 404) {
                        setErrorMessage("no Lawyer Found")
                        setSearchResult([]);
                    } else if (!res.ok) {
                        setErrorMessage("faild to load data")
                    } else {
                        setSearchResult(lawyer);
                    }

                } catch (error) {
                    setErrorMessage("Error fetching search results");
                }
            }
        };

        if (status === "authenticated") {
            fetchSearchResult();
        }
    }, [lawyername, session, status]);

    // Check for Authentication
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/Auth/Login");
        }
    }, [status, router]);

    // Basic split function
    const SpannedText = ({ text = "" }) => {
        return (
            <>
                {text.split(" ").map((char, index) => (
                    <span key={index} className="hover:text-[#FF6F61]">
                        {char + " "}
                    </span>
                ))}
            </>
        );
    };

    // Set loading of still getting results
    useEffect(() => {
        if (!searchResult) {
            const timer = setTimeout(() => {
                window.location.reload();
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [searchResult]);


    if (session && searchResult) {
        return (
            <LawyerContext.Provider value={searchResult}>
                <div className="w-full min-h-screen relative bg-[#121212] text-[#F1F1F1]">
                    <div className="flex items-center justify-between ">
                        {/* Profile Section */}
                        <div className="profile relative flex flex-wrap items-center px-2 md:px-10 lg:px-20 py-4 gap-6">
                            <Image
                                className="rounded-full"
                                src={defaultimg}
                                alt="Profile"
                                width={80}
                                height={80}
                                unoptimized={defaultimg ? false : true}
                            />
                            <div className="profileData flex flex-col items-start relative z-[9999]">
                                <Link href={`/BookAppointment/${lawyername}`} className="text-2xl md:text-3xl font-bold">
                                    <SpannedText text={searchResult.name} />
                                </Link>
                                <p className="text-sm">{searchResult.email}</p>
                            </div>
                            <div className="flex gap-3 flex-wrap w-[300px]">
                                {searchResult.categories && (
                                    <div className="flex gap-3 flex-wrap w-full md:w-auto mt-2">
                                        {Object.entries(searchResult.categories).map(([key, value], index) => (
                                            value?.name && (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 cursor-pointer border-2 border-[#fefefe] hover:text-[#161616] hover:bg-[#ebebeb] text-[#ebebeb] flex items-center justify-center rounded-lg text-sm font-medium hover:scale-105 transition-all"
                                                    style={{ fontFamily: "var(--font-tektur)" }}
                                                >
                                                    {value.name}
                                                </span>
                                            )
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4 flex-wrap">
                                <Link
                                    href={`/BookAppointment/${lawyername}/BookingForm`}
                                    className="flex items-center cursor-pointer z-[9999] border border-[#dcdcdc] hover:border-[#ffffff] px-2 py-0.5     rounded-lg bg-[#dcdcdc] text-xl hover:-translate-y-1 transition-all ease-in-out duration-150 hover:bg-[#ffffff]  text-[#121212] "
                                    style={{ fontFamily: "var(--font-tektur)" }}>
                                    <span>BookAppointment</span>
                                </Link>
                            </div>
                        </div>
                        <Link
                            href={'/UserDashboard'}
                            className="flex items-center z-[9999] justify-center cursor-pointer hover:-translate-y-1 hover:text-[#000000] bg-[#dcdcdc] text-[#121212] font-semibold px-5 py-2 mr-10 rounded-full shadow-md hover:bg-[#ffffff] transition-all ease-in-out duration-150"
                        >
                            Dashboard
                        </Link>
                    </div>

                    <div className="bg-[#FF6F61] opacity-25 mx-auto h-[1px] w-[95vw]"></div>

                    {/* Back Button */}
                    {pathname !== `/BookAppointment/${lawyername}` && (
                        <Link href={`/BookAppointment/${lawyername}`} className="back absolute left-10 z-[999]">
                            <Image src={backImg} width={30} alt="Back" className="backImg invert" />
                        </Link>
                    )}

                    {/* Main Content */}
                    <div className="tea flex flex-col items-center justify-center gap-5 w-full pt-5 pb-5 px-10">
                        {children}
                    </div>
                </div>

                <div className="bg-[#191919] opacity-100 h-1 w-full"></div>
            </LawyerContext.Provider>
        );
    }

    return null;
};

export default lawyername;
