// components/LandingPage.js
'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import logoimg from '@/public/images/logo.png';
import Image from 'next/image';

const LandingPage = () => {
  const containerRef = useRef(null);
  const subtitleRef = useRef(null);
  const lettersRef = useRef([]);
  const logoRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8 });

    tl.fromTo(
      logoRef.current,
      { scale: 0, rotation: 360 },
      { scale: 1, rotation: 0, duration: 1 },
      '-=0.5'
    );

    tl.fromTo(
      lettersRef.current,
      { y: 40, opacity: 0, rotateX: 90 },
      { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.07 },
      '-=0.4'
    );

    tl.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1 },
      '-=0.4'
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="landing-page bg-black flex flex-col items-center justify-center min-h-screen w-full fixed top-0 left-0 z-50 text-white"
    >
      {/* Animated Logo */}
      <div ref={logoRef} className="mb-4">
        <Image src={logoimg} alt="Logo-Image" width={70} className="invert" />
      </div>

      {/* Animated Text */}
      <div className="flex flex-col items-center mt-10 text-center">
        <div
          className="text-4xl sm:text-6xl font-bold flex gap-[3px] mb-2"
          style={{ fontFamily: 'var(--font-tektur)' }}
        >
          {'LEGALDECK'.split('').map((char, index) => (
            <span
              key={index}
              ref={(el) => (lettersRef.current[index] = el)}
              className="text-[#ffffff] inline-block"
            >
              {char}
            </span>
          ))}
        </div>

        <p
          ref={subtitleRef}
          className="text-sm sm:text-lg text-gray-400 tracking-wide"
        >
          Online Legal Consultation Platform Loading...
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
