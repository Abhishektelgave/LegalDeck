'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Header from '@/app/components/Header'
import { usePathname } from 'next/navigation';

const LoginSwitch = () => {
    const pathname = usePathname();
    const method = pathname === '/Auth/Login/Lawyer' || pathname === '/Auth/signup/Lawyer' ? 'lawyer' : 'user';
    const [selected, setSelected] = useState(method);

    return (
        <div>
            <Header />
            <section className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 p-6 px-4 md:px-10">
                <main className="w-full md:w-[30vw] relative flex items-center justify-center gap-10 md:gap-20">
                    {/* Background slider */}
                    <div
                        className='absolute transition-all ease-in-out duration-300 rounded-2xl -z-10 bg-amber-50 h-10 w-[90px] md:w-[110px]'
                        style={{
                            left: selected === 'user' ? '30%' : '67%',
                            width: selected === 'user' ? '100px' : '120px',
                            transform: 'translateX(-50%)',
                        }}
                    ></div>

                    {/* User Button */}
                    <Link
                        href="/Auth/Login"
                        onClick={() => setSelected('user')}
                        className={`text-base md:text-xl px-4 py-1 rounded-2xl bg-transparent flex justify-center ${selected === 'user' ? 'text-black' : 'text-white'}`}
                        style={{ fontFamily: "var(--font-tektur)" }}
                    >
                        User
                    </Link>

                    {/* Lawyer Button */}
                    <Link
                        href="/Auth/Login/Lawyer"
                        onClick={() => setSelected('lawyer')}
                        className={`text-base md:text-xl px-4 py-1 rounded-2xl bg-transparent flex justify-center ${selected === 'lawyer' ? 'text-black' : 'text-white'}`}
                        style={{ fontFamily: "var(--font-tektur)" }}
                    >
                        Lawyer
                    </Link>
                </main>
            </section>
        </div>
    )
}

export default LoginSwitch
