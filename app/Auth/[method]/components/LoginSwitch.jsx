'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Header from '@/app/components/Header'
import { usePathname } from 'next/navigation';

// Login Switch Component
const LoginSwitch = () => {

    // basic data
    const pathname = usePathname();
    
    // dafine path
    const method = pathname === '/Auth/Login/Lawyer' || pathname === '/Auth/signup/Lawyer' ? 'lawyer' : 'user';
    const [selected, setSelected] = useState(method)

    return (
        <div>
            <Header />
            <section className='flex items-center p-6 pl-10 pr-10 justify-center gap-20'>
                <main className='w-[30vw] relative flex items-center justify-center gap-20'>
                    {/* Background slider */}
                    <div
                        className="absolute transition-all ease-in-out duration-300 rounded-2xl -z-10 bg-amber-50 w-[100px] h-[40px]"
                        style={{
                            left: selected === 'user' ? '87px' : '252px',
                            width: selected === 'user' ? '100px' : '110px',
                        }}
                    ></div>
                    {selected === 'user' ?
                        <Link
                            href="/Auth/Login"
                            onClick={() => setSelected('user')}
                            className='text-xl pl-4 pr-4 pt-1 pb-1 rounded-2xl bg-transparent text-black flex justify-center'
                            style={{ fontFamily: "var(--font-tektur)" }}
                        >
                            User
                        </Link>
                        :
                        <Link
                            href="/Auth/Login"
                            onClick={() => setSelected('user')}
                            className='text-xl pl-4 pr-4 pt-1 pb-1 rounded-2xl bg-transparent text-white flex justify-center'
                            style={{ fontFamily: "var(--font-tektur)" }}
                        >
                            User
                        </Link>
                    }

                    {selected === 'lawyer' ?
                        <Link
                            href="/Auth/Login/Lawyer"
                            onClick={() => setSelected('lawyer')}
                            className='text-xl pl-4 pr-4 pt-1 pb-1 rounded-2xl bg-transparent text-black flex justify-center'
                            style={{ fontFamily: "var(--font-tektur)" }}
                        >
                            Lawyer
                        </Link>
                        :
                        <Link
                            href="/Auth/Login/Lawyer"
                            onClick={() => setSelected('lawyer')}
                            className='text-xl pl-4 pr-4 pt-1 pb-1 rounded-2xl bg-transparent text-white flex justify-center'
                            style={{ fontFamily: "var(--font-tektur)" }}
                        >
                            Lawyer
                        </Link>
                    }
                </main>
            </section>
        </div>
    )
}

export default LoginSwitch
