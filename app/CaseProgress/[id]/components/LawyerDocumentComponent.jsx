'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import LawyerUploadComponent from '@/app/CaseProgress/[id]/components/LawyerUploadComponent';
import RequestDocumentComponent from '@/app/CaseProgress/[id]/components/RequestDocumentComponent';

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

    const renderRequestedDocTags = (docs, fallbackText) => (
        docs.length > 0 ? docs.map((d) => (
            <span
                key={d.fileName}
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

    if (session && session.user.role === 'lawyer') {
        return (
            <div className="bg-black border border-white/30 p-6 rounded-xl shadow-md hover:shadow-white/40 transition-all duration-300 ease-in-out">
                <h2 className="text-2xl font-semibold text-white mb-6">Documents</h2>
                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                        <p className="text-white"><strong>Sent Docs:</strong></p>
                        <div className="flex flex-wrap items-center gap-2">
                            {renderDocTags(lawyerdocs, "No documents sent yet.")}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white"><strong>Recived Docs:</strong></p>
                        <div className="flex flex-wrap items-center gap-2">
                            {renderDocTags(userdocs, "No documents sent by user yet.")}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white"><strong>Requested Docs for e-sign:</strong></p>
                        <div className="flex flex-wrap items-centerRequested gap-2">
                            {renderDocTags(lawyerEsignrequestdocs, "No documents Requested for E-sign.")}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-white"><strong>Requested Docs:</strong></p>
                        <div className="flex flex-wrap items-center gap-2">
                            {renderRequestedDocTags(lawyerEsigndocs, "No documents Requested.")}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    {/* Upload */}
                    <div className="bg-black/80 border border-white/20 p-4 rounded-xl">
                        <p className="text-white mb-2"><strong>Upload Document</strong></p>
                        <LawyerUploadComponent
                            caseDetails={caseDetails}
                            onUploaded={fetchDocs}
                        />
                    </div>

                    {/* Request */}
                    <div className="bg-black/80 border border-white/20 p-4 rounded-xl">
                        <p className="text-white mb-2"><strong>Request Document</strong></p>
                        <RequestDocumentComponent
                            caseId={caseDetails._id}
                            onRequested={fetchDocs}
                        />
                    </div>
                </div>
                {/* Preview Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
                        <div className="bg-white rounded-xl w-4/5 h-[90vh] p-4 relative">
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full px-3 py-1"
                            >✕</button>
                            <iframe src={currentUrl} className="w-full h-full rounded-md" />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}