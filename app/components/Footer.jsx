'use client'
import React from 'react';

// Footer Component
const Footer = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center p-4 text-center gap-1 sm:gap-2 text-sm sm:text-base">
      <p>Get Me A Chai - Next JS Project by Abhishek Telgave -</p>
      <p> Developed by &copy;</p>
      <a href="/" className="hover:underline hover:text-[#FF6F61]">
        Abhishektelgave
      </a>
    </div>
  );
};

export default Footer;
