// ~NOT IN USE YET
'use client';
import React, { useEffect, useState, use } from 'react';
import Header from '@/app/components/Header';
import { useAppointmentStore } from '@/app/store/appointment';
import { useSession } from 'next-auth/react';
import Chat from '@/app/CaseProgress/[caseId]/components/chat'

const CaseProcessing = ({params}) => {
    const { data: session } = useSession();
    const appt = useAppointmentStore((state) => state.appt);
    const [chatBox, setChatBox] = useState(false);

   

    if (!session || !appt) return null;  

    return (
        <>
            <Header />
            <div className='min-h-[100vh] bg-black text-white px-10 py-10'>
                <div className="">
                    case detail UI
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
                            <span className='text-black font-bold -mt-3 -ml-2 text-xl'>Chat</span>
                        </div>
                }
            </div>
        </>
    );
};

export default CaseProcessing;
