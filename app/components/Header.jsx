"use client";
import React, { useState, useEffect } from "react";
import logoimg from '@/public/images/logo.png'
import Image from "next/image";
// import Link from "next/link";

// Basic Header
const Header = () => {

  return (
    <>
      <header className="w-full h-[12vh] flex items-center justify-center p-4">
        <div className="logo flex items-center gap-2">
          <div className="logoimg">
            <Image src={logoimg} className="invert" alt="Logo-Image" width={40}></Image>
          </div>
          <div className="logoname text-5xl" style={{ fontFamily: "var(--font-tektur)" }}>
            <span>L</span>
            <span>E</span>
            <span>G</span>
            <span>A</span>
            <span>L</span>
            <span>D</span>
            <span>E</span>
            <span>C</span>
            <span>K</span>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;