// ~NOT IN USE YET
'use client';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useAppointmentStore } from '@/app/store/appointment';
import { useSession } from 'next-auth/react';
import Chat from './components/chat'

const CaseProcessing = () => {
    const { data: session } = useSession();
    const appt = useAppointmentStore((state) => state.appt);
    const [caseData, setCaseData] = useState(null);
    const [chatBox, setChatBox] = useState(false);

    // useEffect(() => {
    //     const checkOrCreateCase = async () => {
    //         if (!appt) return;
    //         const res = await fetch(`/api/case/${appt._id}`);
    //         const data = await res.json();

    //         if (!data.exists) {
    //             await fetch('/api/case', {
    //                 method: 'POST',
    //                 headers: { 'Content-Type': 'application/json' },
    //                 body: JSON.stringify({ appointmentId: appt._id, ...appt }),
    //             });
    //         }
    //         setCaseData(data.case || data.createdCase);
    //     };
    //     checkOrCreateCase();
    // }, [appt]);

    // if (!session || !appt) return null;  

    return (
        <>
            {/* <Header /> */}
            <div className='min-h-[100vh] bg-black text-white px-10 py-10'>
                <div className="relative border-l-[2px] border-gray-700 pl-6 space-y-6">
                    <div className="relative">
                        <div className="absolute -left-[13px] top-[3px] w-3 h-3 bg-white rounded-full"></div>
                        <p className='text-sm text-gray-400'>Case ID</p>
                        <p className='text-base font-medium text-white'>123456</p>
                    </div>

                    <div className="relative">
                        <div className="absolute -left-[13px] top-[3px] w-3 h-3 bg-white rounded-full"></div>
                        <p className='text-sm text-gray-400'>Title</p>
                        <p className='text-base font-medium text-white'>Murder Case</p>
                    </div>

                    <div className="relative">
                        <div className="absolute -left-[13px] top-[3px] w-3 h-3 bg-white rounded-full"></div>
                        <p className='text-sm text-gray-400'>Filed By</p>
                        <p className='text-base font-medium text-white'>UserName</p>
                    </div>

                    <div className="relative">
                        <div className="absolute -left-[13px] top-[3px] w-3 h-3 bg-white rounded-full"></div>
                        <p className='text-sm text-gray-400'>Description</p>
                        <p className='text-base text-gray-300 text-justify max-w-[80%]'>
                            loram abisbc iubaibc uibuaib bbabbai iubaiudba buiaabwda ubia wdd abijiuab iubaw da d ad aiudka uia j abda kjd ia dja di ad ai da d
                        </p>
                    </div>
                </div>

                {
                    chatBox ?
                        <div className='absolute right-5 top-2'>
                            < div onClick={() => setChatBox(false)} className='absolute cursor-pointer right-1 top-4 text-red-700 z-10 font-bold -mt-3 -ml-2 text-xl' >
                                <lord-icon
                                    src="https://cdn.lordicon.com/zxvuvcnc.json"
                                    trigger="hover"
                                    style={{ "width": "50px", "height": "50px" }}>
                                </lord-icon>
                            </div >
                            <Chat />
                        </div >
                        :
                        <div onClick={() => setChatBox(true)} className='absolute flex items-center justify-center flex-col invert right-10 cursor-pointer bottom-5'>
                            <lord-icon
                                src="https://cdn.lordicon.com/ayhtotha.json"
                                trigger="hover"
                                style={{ "width": '60px', "height": '60px' }}>
                            </lord-icon>
                            <span className='text-white font-bold -mt-3 -ml-2 text-xl'>Chat</span>
                        </div>
                }
            </div>
        </>
    );
};

export default CaseProcessing;
