'use client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';


export default function LawyerUploadComponent({ caseDetails, onUploaded }) {
  const { data: session } = useSession();
  const [file, setFile] = useState(null);
  const [needsESign, setNeedsESign] = useState(false);

  const upload = async () => {
    if (!file) return alert('Select a file');
    const form = new FormData();
    form.append('id', caseDetails._id);
    form.append('file', file);
    form.append('from', session.user.role);
    form.append('needsESign', needsESign);
    const res = await fetch(`/api/case/documents`, {
      method: 'POST',
      body: form
    });
    if (res.ok) {
      setFile(null);
      onUploaded();
    } else {
      alert('Upload failed');
    }
  };

  if (session) {

    return (
      <div className="flex flex-col items-center justify-center border-2 border-white border-dotted p-4 gap-2">
        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={needsESign}
            onChange={e => setNeedsESign(e.target.checked)}
          />
          Request E-Signature
        </label>
        <button
          onClick={upload}
          className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
        >Upload Document</button>
      </div>
    );
  }

}