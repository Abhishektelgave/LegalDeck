"use client";
import React from "react";
import logoimg from '@/public/images/logo.png'
import Image from "next/image";
import Link from "next/link";

// Basic Header Component
const Header = () => {

  return (
    <>
      <header className="h-[12vh] flex items-center justify-center p-4">
        <Link href="/" className="logo cursor-pointer flex items-center gap-3">
          {/* Logo Image */}
          <div className="logoimg cursor-pointer transition-transform duration-500 hover:rotate-360 ease-in-out hover:scale-110">
            <Image
              src={logoimg}
              alt="Logo-Image"
              width={40}
              className="invert"
            />
          </div>

          {/* Logo Name with Letter Animations */}
          <div
            className="logoname text-5xl flex gap-[1px]"
            style={{ fontFamily: "var(--font-tektur)" }}
          >
            {["L", "E", "G", "A", "L", "D", "E", "C", "K"].map((char, index) => (
              <span
                key={index}
                className="hover:rotate-360 hover:text-green-400 cursor-pointer transition-transform ease-in-out hover:scale-110 duration-500"
              >
                {char}
              </span>
            ))}
          </div>
        </Link>
      </header>
    </>
  );
};

export default Header;