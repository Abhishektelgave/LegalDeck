// components/UserUploadComponent.jsx
'use client';
import React, { useEffect, useState } from 'react';

export default function UserUploadEsignComponent({ caseDetails, onFulfilled }) {
  const [requests, setRequests] = useState([]);
  const [files, setFiles]       = useState({}); 

  useEffect(() => {
    fetch(`/api/case/requests?id=${caseDetails._id}`)
      .then(r => r.json())
      .then(setRequests);
  }, [caseDetails._id]);

  const upload = async (name) => {
    const file = files[name];
    if (!file) return alert('Choose a file');
    const form = new FormData();
    form.append('file', file);
    form.append('id',caseDetails._id);
    form.append('fileName',fileName);
    const res = await fetch(
      `/api/case/requests/upload`,
      { method:'POST', body: form }
    );
    if (res.ok) {
      setFiles(prev => ({ ...prev, [name]: null }));
      onFulfilled();
      setRequests(rs =>
        rs.map(r => r.name === name ? { ...r, fulfilled:true } : r)
      );
    } else {
      alert('Upload failed');
    }
  };

  return (
    <div className="flex flex-col gap-4 p-2">
      {requests.length === 0 && <p>No requested docs.</p>}
      {requests.map(r => (
        <div key={r.name} className="flex items-center gap-2">
          <span className="flex-1">
            {r.fileName}
            {r.needsESign && <em> (e-sign)</em>}
            {r.fulfilled && <strong> – received</strong>}
          </span>

          {!r.fulfilled && (
            <>
              <input
                type="file"
                onChange={e => setFiles(prev => ({
                  ...prev, [r.name]: e.target.files?.[0] || null
                }))}
              />
              <button
                onClick={() => upload(r.name)}
                className="px-3 py-1 bg-white text-black rounded hover:bg-gray-200"
              >Upload</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
