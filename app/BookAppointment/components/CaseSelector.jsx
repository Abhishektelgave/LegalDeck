'use client';
import { useEffect, useState } from 'react';

const CaseSelector = ({ userId, lawyerId, onSelect }) => {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await fetch(`/api/case/cases`, {
          method: 'POST',
          body: JSON.stringify({ userId, lawyerId }),
        });
        const data = await res.json();
        if (res.ok) {
          setCases(data || []);
        }
      } catch (err) {
        console.error('Failed to fetch cases', err);
      }
    };

    if (userId && lawyerId) fetchCases();
  }, [userId, lawyerId]);

  return (
    <select
      onChange={(e) => onSelect(e.target.value)}
      className="w-full bg-[#2c2c2c] text-white border border-gray-600 rounded p-2"
      required
    >
      <option value="">-- Select a Case --</option>
      {cases.map((c) => (
        <option key={c._id} value={c._id}>
          {c.category} - {new Date(c.dateStarted).toLocaleDateString()}
        </option>
      ))}
    </select>
  );
};

export default CaseSelector;
