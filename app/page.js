"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/app/components/Header";

// Home Page
export default function Home() {

  return (
    <>
      {/* Header */}
      <header className="w-full h-[12vh] flex items-center justify-between p-4">
        <Header />
        <div className="panel flex items-center text-xl gap-8 pr-2 justify-center">
          <Link href={"/Auth/Admin"} className="hover:text-[#FF6F61] pl-2 pt-1 pb-1 pr-2  rounded-xl">Admin</Link>
          <Link href={"/Auth/Login"} className="hover:text-[#FF6F61] pl-2 pt-1 pb-1 pr-2 rounded-xl">Login</Link>
        </div>
      </header>

      {/* About Us Content */}
      <main className="min-h-[81vh] w-[95vw] flex flex-col justify-center items-center bg-[#000000] p-4">
        <section className="w-full max-w-6xl text-center mb-12" style={{ fontFamily: "Dancing Script, --font-lobster, cursive" }}>
          <motion.h1
            className="text-5xl font-bold mb-4 text-[#FF6F61]"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About Us
          </motion.h1>
          <motion.p
            className="text-lg max-w-3xl mx-auto opacity-80"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            At LegalDeck, we empower individuals and businesses with cutting-edge legal solutions. Our mission is to make legal processes seamless, accessible, and efficient for everyone.
          </motion.p>
        </section>
        <section className="w-full max-w-6xl text-center mb-12">
          <motion.h2
            className="text-3xl font-semibold text-[#FF6F61] mb-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Mission
          </motion.h2>
          <motion.p
            className="text-lg opacity-80 max-w-3xl mx-auto"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            We strive to bridge the gap between legal complexities and user-friendly solutions. Our team of legal experts and tech innovators work together to bring clarity, accuracy, and convenience to your legal needs.
          </motion.p>
        </section>
      </main>
      <div className="relative w-full flex items-center ">
        <div className="bg-[#FF6F61] h-[2px] w-full"></div>
      </div>
    </>
  );
}
