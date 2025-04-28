'use client'
import React, { useState } from 'react';

export default function UploadRequestedDocs({ doc, caseId, refreshDocs }) {
    const [uploadDone, setUploadDone] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

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
                setUploadDone(true);
                refreshDocs();
            } else {
                console.error('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-between gap-1 w-full">
            <span className="cursor-default w-[10vw] truncate">{doc.fileName}{doc.needsESign ? ' 🔖' : ''}</span>

            {!uploadDone ? (
                <>
                    <input 
                        type="file" 
                        className="cursor-pointer"
                        onChange={handleFileChange}
                    />
                    <button 
                        className=" bg-blue-500 text-white hover:bg-blue-700 cursor-pointer px-4 py-1 rounded-md"
                        onClick={handleUpload}
                        disabled={!selectedFile || loading}
                    >
                        {loading ? "Uploading..." : "Upload"}
                    </button>
                </>
            ) : (
                <a 
                    href={`/eSign?docId=${doc.fileName}`} 
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-md"
                >
                    Go to E-Sign
                </a>
            )}
        </div>
    );
}
