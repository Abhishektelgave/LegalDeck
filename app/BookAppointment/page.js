"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from '@/app/components/Header'
import Link from "next/link";
import ProfileContainer from "@/app/BookAppointment/components/ProfileContainer";

// Book Appointment page
const BookAppointment = () => {

    // Basic data
    const { data: session, status } = useSession();
    const router = useRouter();

    // Data stores
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [allLawyers, setAllLawyers] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    // Check for Authentication
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/Auth/Login");
        }
    }, [status, router]);

    // Search Lawyer function
    const handleSearch = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (searchQuery) {
            try {
                const res = await fetch(`/api/search?search=${searchQuery}`);
                const data = await res.json();

                if (res.status === 404) {
                    setErrorMessage("No Lawyer found");
                    setSearchResults([]);
                } else if (!res.ok) {
                    throw new Error(`Failed with status ${res.status}`);
                } else {
                    setSearchResults(data);
                }
            } catch (error) {
                setErrorMessage("Error fetching search results");
            }
        } else {
            setErrorMessage("Please enter a search query.");
        }
    };

    // get all Lawyers for recomendation
    useEffect(() => {
        const fetchAllLawyers = async () => {
            try {
                const res = await fetch(`/api/search/lawyers`);
                if (!res.ok) throw new Error(`Failed with status ${res.status}`);
                const data = await res.json();
                setAllLawyers(data);
            } catch (error) {
                setErrorMessage("Error fetching all users:", error);
            }
        };

        fetchAllLawyers();
    }, []);

    if (session) {
        return (
            <>
                <div className="flex items-center justify-between ">
                    <Header />
                    <Link
                        href={'/UserDashboard'}
                        className="flex items-center z-[9999] justify-center cursor-pointer hover:-translate-y-1 hover:text-[#000000] bg-[#dcdcdc] text-[#121212] font-semibold px-5 py-2 mr-10 rounded-full shadow-md hover:bg-[#ffffff] transition-all ease-in-out duration-150"
                    >
                        Dashboard
                    </Link>
                </div>
                <div className="w-full min-h-[81.7vh] bg-[#000000] text-[#F1F1F1]">
                    <div className="searchBar w-[80vw] mx-auto">
                        <form onSubmit={handleSearch} method="GET" className=" relative z-[9999] mx-auto p-7 flex items-center justify-center gap-5">
                            <input
                                className="searchInput z-[999] w-[83%] bg-transparent border-2 border-white rounded-full p-2"
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for a Lawyer"
                            />
                            <button type="GET" className="cursor-pointer searchButton z-[999] bg-white text-black rounded-full px-4 py-2">
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Search Results */}
                    {errorMessage ? (
                        <div className="p-2 z-[999] mx-10 font-bold text-[#FF6F61]">{errorMessage}</div>
                    ) : (<>
                        {searchResults.length > 0 ? (<>
                            <div className="mx-10 font-bold text-[#e7e7e7]">Search Results</div>
                            <div className="bg-[#cbcbcb] opacity-50 my-1 mx-auto h-[1px] w-[95vw]"></div>
                            <div className="mx-10 p-2  relative z-[9999] flex flex-wrap  gap-4">
                                {searchResults.length > 0 && searchResults.map((lawyer) => <span key={lawyer.email}> <ProfileContainer key={lawyer._id} lawyer={lawyer} /></span>)}
                            </div>
                        </>) : ""}
                    </>
                    )}

                    {/* All recomended lawyers */}
                    <div className="mx-10 font-bold text-[#ededed] mt-8">Recomended</div>
                    <div className="bg-[#cfcfcf] opacity-50 my-1 mx-auto h-[1px] w-[95vw]"></div>

                    <div className="mx-10 p-2  relative z-[9999] min-h-[30vh] flex flex-wrap  gap-4">
                        {allLawyers.length > 0 ? (
                            allLawyers.map((lawyer) => <span key={lawyer.email}>
                                <ProfileContainer key={lawyer._id} lawyer={lawyer} />
                            </span>)
                        ) : (
                            <div className="p-2 z-[999]">No Lawyer found</div>
                        )}
                    </div>
                </div>
            </>
        );
    }

    return null;
};

export default BookAppointment;
