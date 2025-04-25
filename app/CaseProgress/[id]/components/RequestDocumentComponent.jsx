// components/RequestDocumentComponent.jsx
'use client';
import React, { useState } from 'react';

export default function RequestDocumentComponent({ caseId, onRequested }) {
  const [name, setName]       = useState('');
  const [needsESign, setNeeds] = useState(false);

  const sendRequest = async () => {
    if (!name) return alert('Enter document name');
    const res = await fetch(`/api/case/requests?id=${caseId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, needsESign })
    });
    if (res.ok) {
      setName(''); setNeeds(false);
      onRequested();
    } else {
      alert('Failed to request');
    }
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Document name"
        className="px-2 py-1 border rounded"
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={needsESign}
          onChange={e => setNeeds(e.target.checked)}
        />
        Request E-Signature
      </label>
      <button
        onClick={sendRequest}
        className="px-3 py-1 bg-white text-black rounded hover:bg-gray-200"
      >Send Request</button>
    </div>
  );
}
