'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import LoadingPage from '@/app/components/LoadingPage';

const Cases = () => {
    const { data: session } = useSession();
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!session?.user) return;

        const fetchCases = async () => {
            try {
                const body = session.user.role === 'lawyer'
                    ? { lawyerId: session.user.id, role: session.user.role }
                    : { userId: session.user.id, role: session.user.role };

                const res = await fetch('/api/case/allCases', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body),
                });

                const data = await res.json();

                if (!res.ok) throw new Error(data.message || 'Failed to fetch cases.');

                setCases(data || []);
            } catch (err) {
                setMessage(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCases();
    }, [session]);

    return (
        <div className="relative w-full min-h-screen bg-[#151515] p-8 text-white">
            <h1 className="text-3xl font-bold mb-6 border-b border-white/10 pb-4">
                Your Cases
            </h1>

            {loading ? (
                <span className="text-white/70"><LoadingPage /></span>
            ) : message ? (
                <p className="text-red-400">{message}</p>
            ) : cases.length === 0 ? (
                <p className="text-yellow-400">No cases found.</p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                    {cases.map((caseItem) => (
                        <div
                            key={caseItem._id}
                            className="bg-black border border-white/30 p-6 rounded-xl shadow-md hover:shadow-white/40 transition-all duration-350 ease-in-out relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />

                            <div className="flex justify-between items-center mb-4">
                                <div className="text-left">
                                    <p className="text-xs uppercase text-white/60">Category</p>
                                    <p className="text-sm font-semibold">{caseItem.category || 'General'}</p>
                                </div>
                                <div className="w-1/3 h-[2px] bg-white/20 mx-2" />
                                <div className="text-right">
                                    <p className="text-xs uppercase text-white/60">Status</p>
                                    <p className="text-sm font-semibold">{caseItem.status}</p>
                                </div>
                            </div>

                            <div className="text-center -mt-2 mb-2">
                                <span className="px-4 py-1 text-xs tracking-wider uppercase border border-white rounded-full text-white">
                                    {caseItem.caseProgress}
                                </span>
                            </div>

                            <div className="text-sm mb-4 space-y-1">
                                <p>
                                    <span className="font-medium">Start Date:</span>{' '}
                                    {caseItem.dateStarted ? new Date(caseItem.dateStarted).toLocaleDateString() : 'N/A'}
                                </p>
                                <p>
                                    <span className="font-medium">Documents:</span> {caseItem.documents.length}
                                </p>
                                <p>
                                    <span className="font-medium">Requested Docs:</span> {caseItem.requestedDocuments.length}
                                </p>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Link href={`/CaseProgress/${caseItem._id}`}
                                    className="border cursor-pointer border-white text-white px-4 py-2 rounded hover:bg-white hover:text-black transition duration-200 text-sm"
                                >
                                    View Case
                                </Link>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Cases;
