'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import UploadRequestedDocs from '@/app/CaseProgress/[id]/components/UploadRequestedDocs'
import getIframeUrl from '@/app/helpers/googleForm';



export default function LawyerDocumentComponent({ caseDetails }) {
    const { data: session } = useSession();
    const [lawyerdocs, setLawyerDocs] = useState([]);
    const [lawyerEsignrequestdocs, setLawyerEsignrequestdocs] = useState([]);
    const [userdocs, setUserDocs] = useState([]);
    const [lawyerEsigndocs, setLawyerEsigndocs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentUrl, setCurrentUrl] = useState('');

    const fetchDocs = async () => {
        try {
            const res = await fetch(`/api/case/documents/getDocs?id=${caseDetails._id}`);
            if (res.ok) {
                const data = await res.json();
                setLawyerDocs(data.lawyerDocs || []);
                setUserDocs(data.userDocs || []);
                setLawyerEsignrequestdocs(data.lawyerEsignRequestDocs || []);
                setLawyerEsigndocs(data.lawyerEsigndocs || []);
            } else {
                console.error("Failed to fetch documents");
            }
        } catch (err) {
            console.error("Error fetching documents:", err);
        }
    };

    useEffect(() => {
        if (caseDetails._id) {
            fetchDocs();
        }
    }, [caseDetails._id]);

    const renderDocTags = (docs, fallbackText) => (
        docs.length > 0 ? docs.map((d) => (
            <span
                key={d.fileName}
                onClick={() => { setCurrentUrl(d.path); setShowModal(true); }}
                className="bg-white text-black px-3 py-1 border rounded-2xl cursor-pointer hover:bg-gray-100"
            >
                {d.fileName}{d.needsESign ? ' 🔖' : ''}
            </span>
        )) : (
            <span className="bg-white text-black px-3 py-1 border rounded-2xl">
                {fallbackText}
            </span>
        )
    );
    const renderEsignDocRequestTags = (docs, fallbackText) => (
        docs.length > 0 ? docs.map((d) => (
            <span
                key={d.fileName}
                onClick={() => { setCurrentUrl(d.path); setShowModal(true); }}
                className="bg-white text-black px-3 py-1 border rounded-2xl cursor-pointer hover:bg-gray-100"
            >
                {d.fileName}{d.needsESign ? ' 🔖' : ''}
            </span>
        )) : (
            <span className="bg-white text-black px-3 py-1 border rounded-2xl">
                {fallbackText}
            </span>
        )
    );

    const renderRequestedDocTags = (docs, fallbackText) => (
        docs.length > 0 ? docs.map((d) => (
            <div
                key={d.fileName}
                className="bg-[#000000] flex items-center justify-between w-[100vw] text-[#FFFFFF] px-3 py-1 border rounded-2xl cursor-default"
            >
                <UploadRequestedDocs doc={d} caseId={caseDetails._id} refreshDocs={fetchDocs} />
            </div>
        )) : (
            <span className="bg-white text-black px-3 py-1 border rounded-2xl">
                {fallbackText}
            </span>
        )
    );

    if (session && session.user.role === 'user') {
        return (
            <div className="bg-black border border-white/30 p-4 rounded-xl shadow-md hover:shadow-white/40 transition-all duration-300 ease-in-out">
                <h2 className="text-2xl font-semibold text-white mb-6">Documents</h2>
                <div className="flex flex-col sm:flex-row gap-4 p-2 mb-2">
                    <div className="space-y-2 sm:w-[48vw]">
                        <p className="text-white"><strong>recived:</strong></p>
                        <div className="flex flex-wrap items-center gap-2">
                            {renderDocTags(lawyerdocs, "No documents sent by lawyer yet.")}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white"><strong>Sent :</strong></p>
                        <div className="flex flex-wrap items-center gap-2">
                            {renderDocTags(userdocs, "No documents sent yet.")}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4  mb-2">
                    {/* Requested Docs Upload */}
                    <div className="bg-black/80 h-full sm:w-[48vw] border border-white/20 p-4 rounded-xl">
                        <p className="text-white mb-2"><strong>Requested Documents for E-sing</strong></p>
                        <div className="flex flex-wrap items-center gap-2">
                            {renderEsignDocRequestTags(lawyerEsignrequestdocs, "No documents sent yet.")}
                        </div>
                    </div>

                    <div className="bg-black/80 h-full  sm:w-[48vw] border border-white/20 p-4 rounded-xl">
                        <p className="text-white mb-2"><strong>Request Document</strong></p>
                        <div className="flex flex-wrap items-center gap-2">
                            {renderRequestedDocTags(lawyerEsigndocs, "No Requested documents yet.")}
                        </div>
                    </div>
                </div>
                {/* Preview Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
                        <div className="bg-white rounded-xl w-4/5 h-[90vh] p-4 relative">
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full px-3 py-1"
                            >
                                ✕
                            </button>

                            <iframe
                                src={getIframeUrl(currentUrl)}
                                className="w-full h-full rounded-md"
                                frameBorder="0"
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}