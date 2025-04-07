import React from 'react'
import Navbar from '../components/Header'

// Admin Login Page ~~~~~~~~~~~~~~~~~~~~~~~
const Admin = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-[81vh] bg-[#000000] p-4">
        <p className="text-center text-4xl" style={{ fontFamily: "Dancing Script ,--font-lobster,cursive" }}>Admin page</p>
      </main>
    </>
  )
}

export default Admin
