import React from 'react'
import Link from 'next/link'
import Header from '@/app/components/Header'

const LoginSwitch = () => {
    return (
        <div>
            <Header />
            <section className='flex items-center p-6 pl-10 pr-10 justify-center gap-20'>
                <main className='w-[30vw] relative flex items-center justify-center gap-20'>
                    <Link href={"/Auth/Login"} className='text-xl pl-4 pr-4 pt-1 pb-1 rounded-2xl bg-transparent text-black flex justify-center' style={{ fontFamily: "var(--font-tektur)" }}>User</Link>
                    <div className='absolute text-xl pl-4 ml-24 pr-4 pt-1 pb-1 left-0 rounded-2xl -z-10 bg-amber-50 text-amber-50 flex justify-center' style={{ fontFamily: "var(--font-tektur)" }}>User</div>
                    <Link href={"/Auth/Login/Lawyer"} className='text-xl pl-4 pr-4 pt-1 pb-1 rounded-2xl flex justify-center' style={{ fontFamily: "var(--font-tektur)" }}>Lawyer</Link>
                </main>
            </section>
        </div>
    )
}

export default LoginSwitch
