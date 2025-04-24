'use client';
import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import LawyerCard from '@/app/Admin/components/lawyerCard';
import LawyerCardPending from '@/app/Admin/components/lawyerCardPending';

// Admin Page
const Admin = () => {

  // Basic Data
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('all');
  const [newLawyers, setNewLawyers] = useState([]);
  const [rejectedLawyers, setRejectedLawyers] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [message, setMessage] = useState('');

  const router = useRouter();
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Check for Session
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/Auth/Admin');
    else if (session.user.role === 'user') router.push('/UserDashboard');
    else if (session.user.role === 'lawyer') router.push('/LawyerDashboard');
  }, [session, status, router]);

  // Fetch All Lawyers
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

  // Fetch New Lawyers
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

  // Fetch Rejected Lawyers
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

  // Access for only Admin
  if (!session || session.user.role !== 'admin') return null;
  if (!hasMounted) return null;


  // Card Map for Grid
  const LawyerGrid = ({ data }) => (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-6">
      {data.map((lawyer) => (
        <LawyerCard key={lawyer._id} lawyer={lawyer} />
      ))}
    </div>
  );

  // Card Map for pending Lawyers
  const LawyerGridPending = ({ data }) => (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-6">
      {data.map((lawyer) => (
        <LawyerCardPending key={lawyer._id} lawyer={lawyer} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex items-center justify-start p-4 border-b border-white/10">
        <Header />
        <span className='bg-[#ff5050] px-2.5 py-0.5 rounded-full'>
          Admin
        </span>
        {/* <div className="flex items-center gap-4"> */}
          {/* Notification Button */}
          {/* <button className="relative">
            <lord-icon
              src="https://cdn.lordicon.com/aksvbzmu.json"
              trigger="loop"
              stroke="bold"
              style={{ width: '30px', height: '30px' }}
            />
            <span className="absolute -top-2 -right-3 bg-red-600 text-white text-[10px] w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-md">
              0
            </span>
          </button> */}
          <button
            onClick={() => signOut({ callbackUrl: '/Auth/Admin' })}
            className="absolute right-10 px-4 py-2 cursor-pointer bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition"
          >
            Sign Out
          </button>
        {/* </div> */}
      </div>

      {/* Active Tabs selection */}
      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-2 rounded-full cursor-pointer font-semibold ${activeTab === 'all' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          All Lawyers
        </button>
        <button
          onClick={() => setActiveTab('new')}
          className={`px-6 py-2 rounded-full cursor-pointer font-semibold ${activeTab === 'new' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          New Applicants
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`px-6 py-2 rounded-full cursor-pointer font-semibold ${activeTab === 'rejected' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          Rejected Applicants
        </button>
      </div>

      {/* Lawyers cards */}
      <main className="p-6">
        {loading ? (
          <p className="text-center text-white/60">Loading...</p>
        ) : message ? (
          <p className="text-center text-red-400">{message}</p>
        ) : activeTab === 'all' ? (
          lawyers.length > 0 ? <LawyerGrid data={lawyers} /> : <p className="text-yellow-400 text-center">No Lawyers yet.</p>
        ) : activeTab == 'new' ? (
          newLawyers.length > 0 ? <LawyerGridPending data={newLawyers} /> : <p className="text-yellow-400 text-center">No New Lawyers.</p>
        ) :
          (
            newLawyers.length > 0 ? <LawyerGrid data={rejectedLawyers} /> : <p className="text-yellow-400 text-center">No rejected Lawyers.</p>
          )}
      </main>
    </div>
  );
};

export default Admin;