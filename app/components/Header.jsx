"use client";
import React from "react";
import logoimg from "@/public/images/logo.png";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header className="h-auto sm:h-[12vh] flex items-center justify-center p-2 sm:p-4">
      <Link
        href="/"
        className="logo cursor-pointer flex flex-row items-center gap-2 sm:gap-3"
      >
        {/* Logo Image */}
        <div className="logoimg transition-transform duration-500 hover:rotate-360 ease-in-out hover:scale-110">
          <Image
            src={logoimg}
            alt="Logo-Image"
            width={40}
            className="invert"
          />
        </div>

        {/* Logo Name with Letter Animations */}
        <div
          className="logoname text-2xl sm:text-5xl flex  justify-center sm:justify-start gap-[1px]"
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
  );
};

export default Header;
