'use client';
import React, { useEffect, useState } from 'react';
import Header from '@/app/components/Header';
import { useAppointmentStore } from '@/app/store/appointment';
import { useSession } from 'next-auth/react';
import Chat from '@/app/CaseProgress/[id]/components/chat';
import { useParams } from 'next/navigation';

const CaseProcessing = () => {
    const { data: session } = useSession();
    const appt = useAppointmentStore((state) => state.appt);
    const [caseDetails, setCaseDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chatBox, setChatBox] = useState(false);
    const params = useParams();
    const id = params?.id;

    useEffect(() => {
        const fetchCaseDetails = async () => {
            try {
                const res = await fetch(`/api/case/getCaseDetails?id=${id}`);
                const data = await res.json();
                setCaseDetails(data);
            } catch (err) {
                console.error('Unable to fetch data', err);
            } finally {
                setLoading(false);
            }
        };

        if (session && id) {
            fetchCaseDetails();
        }
    }, [session, id]);

    if (!session || !appt) return null;
    if (loading) return <div className="text-center py-20 text-white">Loading case details...</div>;
    if (!caseDetails) return <div className="text-center py-20 text-white">No case found.</div>;

    const stageLabels = ['Initiated', 'Docs Submitted', 'Under Review', 'Resolved'];
    const statusIndex = ['initiated', 'docs_submitted', 'under_review', 'resolved'].indexOf(caseDetails.status);

    return (
        <>
            <Header />
            <div className="flex flex-col md:flex-row min-h-[88vh] bg-[#000000] text-white p-6 gap-6 relative">
                {/* Case Details Section */}
                <div className="w-full md:w-3/5 transition-all duration-300">
                    <div className="bg-black border border-white/30 p-6 rounded-xl shadow-md hover:shadow-white/40 transition-all duration-350 ease-in-out relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />
                        <h2 className="text-2xl font-semibold mb-4">Case Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div><strong className="text-gray-300">Case ID:</strong> {caseDetails._id}</div>
                            <div><strong className="text-gray-300">Category:</strong> {caseDetails.category || 'N/A'}</div>
                            <div><strong className="text-gray-300">Date Started:</strong> {caseDetails.dateStarted ? new Date(caseDetails.dateStarted).toLocaleDateString() : 'N/A'}</div>
                            <div>
                                <strong className="text-gray-300">Status:</strong>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ml-2 ${caseDetails.status === 'resolved' ? 'bg-green-700 text-green-300' : caseDetails.status === 'under_review' ? 'bg-yellow-700 text-yellow-300' : 'bg-gray-700 text-gray-300'}`}>
                                    {caseDetails.status || 'N/A'}
                                </span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <strong className="text-gray-300 block mb-2">Description:</strong>
                            <p className="text-gray-400">{caseDetails.desc || 'No description available.'}</p>
                        </div>

                        {/* Progress */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Case Progress</h3>
                            <div className="flex items-center space-x-4">
                                {stageLabels.map((label, index) => {
                                    const isActive = index <= statusIndex;
                                    return (
                                        <React.Fragment key={label}>
                                            <div className="flex flex-col items-center text-center">
                                                <div className={`w-5 h-5 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                                                <span className={`mt-2 text-sm ${isActive ? 'text-green-300' : 'text-gray-500'}`}>{label}</span>
                                            </div>
                                            {index < stageLabels.length - 1 && (
                                                <div className={`flex-1 h-1 ${index < statusIndex ? 'bg-green-400' : 'bg-gray-700'}`}></div>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {chatBox ? (
                    <div className='absolute right-5 top-2 z-50'>
                        <div onClick={() => setChatBox(false)} className='absolute cursor-pointer right-1 top-4 text-red-700 font-bold -mt-3 -ml-2 text-xl'>
                            <lord-icon
                                src="https://cdn.lordicon.com/zxvuvcnc.json"
                                trigger="hover"
                                style={{ width: "50px", height: "50px" }}>
                            </lord-icon>
                        </div>
                        <Chat />
                    </div>
                ) : (
                    <div onClick={() => setChatBox(true)} className='absolute flex items-center justify-center flex-col invert right-10 cursor-pointer bottom-5 z-50'>
                        <lord-icon
                            src="https://cdn.lordicon.com/ayhtotha.json"
                            trigger="hover"
                            style={{ width: '60px', height: '60px' }}>
                        </lord-icon>
                        <span className='text-black font-bold -mt-3 -ml-2 text-xl'>Chat</span>
                    </div>
                )}
            </div>
        </>
    );
};

export default CaseProcessing;
    