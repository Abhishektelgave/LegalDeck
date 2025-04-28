'use client';
import React, { useEffect, useState } from 'react';
import Header from '@/app/components/Header';
import { useSession } from 'next-auth/react';
import ChatBox from '@/app/CaseProgress/[id]/components/ChatBox';
import { useParams } from 'next/navigation';
import CaseComponent from '@/app/CaseProgress/[id]/components/CaseComponent';
import Documents from '@/app/CaseProgress/[id]/components/Documents';
import defaultimg from '@/public/images/defaultprofile.png';
import Image from 'next/image';

const CaseProcessing = ({ params }) => {
    const { data: session } = useSession();
    const id = React.use(params).id;  // Get the id from URL params
    const [caseDetails, setCaseDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chatBox, setChatBox] = useState(false);
    const [showCase, setShowCase] = useState(true);

    // Fetch case details when the component mounts or session/id changes
    useEffect(() => {
        const fetchCaseDetails = async () => {
            try {
                const res = await fetch(`/api/case/getCaseDetails?id=${id}`);
                const data = await res.json();
                console.log('Fetched Case Details:', data); // Log the response for debugging
                if (res.ok) {
                    setCaseDetails(data);
                } else {
                    console.error('Error fetching case details:', data.message);
                }
            } catch (err) {
                console.error('Unable to fetch data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (session && id) {
            fetchCaseDetails();
        }
    }, [session, id]);

    const changeCaseStatus = async (action) => {
        try {
            const res = await fetch(`/api/case/updateCase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, status: action }),
            });

            const data = await res.json();

            if (res.ok) {
                setCaseDetails(data.case);
            } else {
                console.error('Error updating case:', data.message);
            }

        } catch (err) {
            console.error('Unable to fetch data', err);
        }
    };

    if (!session || loading) {
        return <div className="text-center py-20 text-white">Loading case details...</div>;
    }

    if (!caseDetails) {
        return <div className="text-center py-20 text-white">No case found.</div>;
    }

    return (
        <div className='relative min-h-[98.3vh] cursor-default bg-black text-white'>
            <Header />

            {caseDetails.status === "Not Started" && (
                <div className='flex items-center justify-center gap-5 py-4'>
                    <button
                        onClick={() => changeCaseStatus('Active')}
                        className='px-4 cursor-pointer py-1 hover:bg-[#dcdcdc] rounded-full bg-white text-black text-xl'>
                        Activate Case
                    </button>
                    <button
                        onClick={() => changeCaseStatus('Rejected')}
                        className='px-4 cursor-pointer py-1 hover:bg-[#dcdcdc] rounded-full bg-white text-black text-xl'>
                        Reject Case
                    </button>
                </div>
            )}

            <div className="flex flex-col md:flex-row mt-5 p-6 gap-6">
                <div className={`w-full transition-all duration-300 relative ${chatBox ? 'md:w-34/50' : 'md:w-47/50 '}`}>
                    <div className="absolute right-6 top-7 z-10">
                        <button
                            onClick={() => setShowCase(prev => !prev)}
                            className='px-4 py-1 mb-4 cursor-pointer rounded-full bg-blue-500 text-white hover:bg-blue-700 text-sm'>
                            {showCase ? 'View Documents' : 'View Case Details'}
                        </button>
                    </div>

                    {showCase
                        ? <CaseComponent caseDetails={caseDetails} />
                        : <Documents caseDetails={caseDetails} />}
                </div>
            </div>

            {chatBox ? (
                <div className='absolute right-5 top-18 z-50'>
                    <div className='absolute top-4 bg-white w-full h-12 font-bold -mt-4 rounded-t-4xl text-xl'>
                        <div className='text-black flex items-center gap-2 ml-5 mt-2'>
                            <Image
                                className="rounded-full"
                                src={defaultimg}
                                alt="Profile"
                                width={30}
                                height={30}
                                unoptimized={!defaultimg}
                            />
                            {session.user.role === 'User' ? caseDetails.lawyerName : caseDetails.userName}
                        </div>
                    </div>
                    <div onClick={() => setChatBox(false)} className='absolute cursor-pointer right-1 top-4 text-red-700 font-bold -mt-2 mr-2 text-xl'>
                        <lord-icon
                            src="https://cdn.lordicon.com/zxvuvcnc.json"
                            trigger="hover"
                            colors="primary:#000000,secondary:#ffffff"
                            style={{ 'width': '35px', 'height': '35px' }} />
                    </div>
                    <ChatBox
                        caseDetails={caseDetails}
                        senderId={session.user.id}
                        senderRole={session.user.role}
                    />
                </div>
            ) : (
                <div onClick={() => setChatBox(true)} className='absolute flex items-center justify-center flex-col invert right-10 cursor-pointer bottom-16 z-50'>
                    <lord-icon
                        src="https://cdn.lordicon.com/ayhtotha.json"
                        trigger="hover"
                        style={{ width: '60px', height: '60px' }} />
                    <span className='text-black font-bold -mt-3 -ml-2 text-xl'>Chat</span>
                </div>
            )}
        </div>
    );
};

export default CaseProcessing;
