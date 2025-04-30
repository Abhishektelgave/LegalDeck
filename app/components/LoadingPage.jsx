'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import logoimg from '@/public/images/logo.png';
import Image from 'next/image';

const LoadingPage = () => {
  const lettersRef = useRef([]);
  const dotsRef = useRef([]);

  useEffect(() => {
    gsap.to(dotsRef.current, {
      opacity: 0.3,
      yoyo: true,
      repeat: -1,
      stagger: {
        each: 0.3,
        repeat: -1,
        yoyo: true,
      },
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white font-mono">
      {/* Logo */}
      <div className="mb-6">
        <Image src={logoimg} alt="Logo" width={70} className="invert animate-pulse" />
      </div>

      {/* Animated Title */}
      <div className="flex text-xl sm:text-2xl font-bold tracking-widest">
        {'LEGALDECK'.split('').map((char, index) => (
          <span
            key={index}
            ref={(el) => (lettersRef.current[index] = el)}
            className="inline-block"
          >
            {char}
          </span>
        ))}
      </div>

      {/* Loading Dots */}
      <div className="mt-4 flex space-x-2 text-lg text-gray-400">
        <span>Loading</span>
        <span ref={(el) => (dotsRef.current[0] = el)} className="animate-bounce">
          .
        </span>
        <span ref={(el) => (dotsRef.current[1] = el)} className="animate-bounce">
          .
        </span>
        <span ref={(el) => (dotsRef.current[2] = el)} className="animate-bounce">
          .
        </span>
      </div>
    </div>
  );
};

export default LoadingPage;
