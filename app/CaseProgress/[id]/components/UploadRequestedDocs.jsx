'use client';
import React, { useEffect, useState } from 'react';

export default function UploadRequestedDocs({ doc, caseId, refreshDocs }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [docPresent, setDocPresent] = useState(false);
    

    useEffect(() => {
        if (doc?.path && doc.path !== '') {
            setDocPresent(true);
        } else {
            setDocPresent(false);
        }
    }, [doc]);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('caseId', caseId);
            formData.append('docId', doc._id);

            const res = await fetch('/api/case/documents/uploadRequestedDoc', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                await refreshDocs();
            } else {
                console.error('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setLoading(false);
        }
    };

    const sendDoc = async (doc) => {
        if (!doc) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/case/documents/send?id=${caseId}`, {
                method: 'POST',
                body: JSON.stringify(doc),
            })

            if (res.ok) {
                await refreshDocs();
            } else {
                console.error('Send failed');
            }
        } catch (err) {
            console.error('Error in sending file', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-between gap-2 w-full">
            <span className="cursor-default w-[10vw] truncate">
                {doc.fileName}{doc.needsESign ? ' 🔖' : ''}
            </span>

            {!docPresent ? (
                <>
                    <input
                        type="file"
                        className="cursor-pointer"
                        onChange={handleFileChange}
                    />
                    <button
                        className="bg-blue-500 text-white hover:bg-blue-700 cursor-pointer px-4 py-1 rounded-md"
                        onClick={handleUpload}
                        disabled={!selectedFile || loading}
                    >
                        {loading ? "Uploading..." : "Upload"}
                    </button>
                </>
            ) : doc.needsESign ? (
                <a
                    href={`/eSign?docId=${doc._id}`} // Better to pass _id not fileName
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-md"
                >
                    Go to E-Sign
                </a>
            ) : (
                <button
                    onClick={() => sendDoc(doc)}
                    className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-4 py-1 rounded-md"
                >
                    Send
                </button>
            )}
        </div>
    );
}
