'use client';
import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import LawyerCard from '@/app/Admin/components/lawyerCard';
import LawyerCardPending from '@/app/Admin/components/lawyerCardPending';
import LoadingPage from '../components/LoadingPage';

// Admin Page
const Admin = () => {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('all');
  const [newLawyers, setNewLawyers] = useState([]);
  const [rejectedLawyers, setRejectedLawyers] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [message, setMessage] = useState('');

  const router = useRouter();

  useEffect(() => setHasMounted(true), []);

  // Redirect non-admin users
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/Auth/Admin');
    else if (session.user.role === 'user') router.push('/UserDashboard');
    else if (session.user.role === 'lawyer') router.push('/LawyerDashboard');
  }, [session, status, router]);

  // Fetch all lawyers
  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const res = await fetch(`/api/lawyers`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch Lawyers.');
        setLawyers(data.lawyers || []);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (status === 'authenticated' && session?.user?.id) fetchLawyers();
  }, [session, status]);

  // Fetch new applicants
  useEffect(() => {
    const fetchNewLawyers = async () => {
      try {
        const res = await fetch(`/api/lawyers/newLawyers`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch Lawyers.');
        setNewLawyers(data.lawyers || []);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (status === 'authenticated' && session?.user?.id) fetchNewLawyers();
  }, [session, status]);

  // Fetch rejected lawyers
  useEffect(() => {
    const fetchRejectedLawyers = async () => {
      try {
        const res = await fetch(`/api/lawyers/rejectedLawyers`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch Lawyers.');
        setRejectedLawyers(data.lawyers || []);
      } catch (err) {
        setMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (status === 'authenticated' && session?.user?.id) fetchRejectedLawyers();
  }, [session, status]);

  if (!session || session.user.role !== 'admin' || !hasMounted) return null;

  // Component to render approved lawyers
  const LawyerGrid = ({ data }) => (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-6">
      {data.map((lawyer) => (
        <LawyerCard key={lawyer._id} lawyer={lawyer} />
      ))}
    </div>
  );

  // Component to render new applicants
  const LawyerGridPending = ({ data }) => (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-6">
      {data.map((lawyer) => (
        <LawyerCardPending key={lawyer._id} lawyer={lawyer} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-white/10">
        <div className="flex items-center gap-4 flex-wrap">
          <Header />
          <span className="bg-[#ff5050] px-3 py-1 text-sm rounded-full">Admin</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/Auth/Admin' })}
          className="px-4 py-2 bg-white cursor-pointer text-black rounded-full font-semibold hover:bg-gray-200 transition text-sm md:text-base"
        >
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center mt-6 gap-3 px-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-2 cursor-pointer rounded-full text-sm sm:text-lg font-semibold ${activeTab === 'all'
            ? 'bg-white text-black'
            : 'bg-white/10 text-white hover:bg-white/20'
            }`}
        >
          All Lawyers
        </button>
        <button
          onClick={() => setActiveTab('new')}
          className={`px-6 py-2 cursor-pointer rounded-full text-sm sm:text-lg font-semibold ${activeTab === 'new'
            ? 'bg-white text-black'
            : 'bg-white/10 text-white hover:bg-white/20'
            }`}
        >
          New Applicants
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`px-6 py-2 cursor-pointer rounded-full text-sm sm:text-lg font-semibold ${activeTab === 'rejected'
            ? 'bg-white text-black'
            : 'bg-white/10 text-white hover:bg-white/20'
            }`}
        >
          Rejected Applicants
        </button>
      </div>

      {/* Content */}
      <main className="p-4 sm:p-6 md:p-8">
        {loading ? (
          <LoadingPage />
        ) : message ? (
          <p className="text-center text-red-400">{message}</p>
        ) : activeTab === 'all' ? (
          lawyers.length > 0 ? (
            <LawyerGrid data={lawyers} />
          ) : (
            <p className="text-yellow-400 text-center">No Lawyers yet.</p>
          )
        ) : activeTab === 'new' ? (
          newLawyers.length > 0 ? (
            <LawyerGridPending data={newLawyers} />
          ) : (
            <p className="text-yellow-400 text-center">No New Lawyers.</p>
          )
        ) : rejectedLawyers.length > 0 ? (
          <LawyerGrid data={rejectedLawyers} />
        ) : (
          <p className="text-yellow-400 text-center">No Rejected Lawyers.</p>
        )}
      </main>
    </div>
  );
};

export default Admin;
