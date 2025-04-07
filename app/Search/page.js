"use client"
import React from 'react'
import { useSession, signOut } from 'next-auth/react';

// Searching lawyer page for Users ~~~~~~~~~~~~~~~~~~~~~~
const Search = () => {

  const { data: session } = useSession();

  return (
    <div>
      This is page to search Lawyer
      {session?.user?.name}
      <button
        id="login-button"
        className="ml-auto flex items-center z-[9999] justify-center bg-[#FF6F61] text-[#121212] font-semibold px-5 py-2 rounded-full shadow-md hover:bg-[#e45a50] transition-all"
        onClick={() => signOut({ callbackUrl: "/Auth/login" })}
      >
        Sign Out
      </button>
    </div>
  )
}

export default Search
