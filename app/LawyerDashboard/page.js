"use client"
import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

// Lawyer Dashboard Page ~~~~~~~~~~~~~~~~
const LawyerDashboard = () => {

  const { data: session, status } = useSession();

  return (
    <div>
      Welcome to dashbord lawyer , {session?.user?.name}
      <button
        id="login-button"
        className="ml-auto flex items-center z-[9999] justify-center bg-[#FF6F61] text-[#121212] font-semibold px-5 py-2 rounded-full shadow-md hover:bg-[#e45a50] transition-all"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        Sign Out
      </button>
    </div>
  )
}

export default LawyerDashboard;
