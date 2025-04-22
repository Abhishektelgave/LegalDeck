"use client"
import React, { useState, useEffect } from 'react'
import { useSession, signIn, getCsrfToken } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';

// Admin Login Page
const AdminLogin = () => {

    // Error Verification States
    const [isClient, setIsClient] = useState(true);
    const [csrfToken, setCsrfToken] = useState('');
    const [errorMessage, setErrorMessage] = useState("");

    // Input Fields
    const [EmailInput, setEmailInput] = useState("");
    const [PassInput, setPassInput] = useState("");

    // get Session & redirect if session
    const { data: session } = useSession();
    const router = useRouter();


    useEffect(() => {
        if (session) {
            router.push('/Admin');
        }
    }, [session]);

    useEffect(() => {
        const setAdminData = async () => {
            try {
                const res = await fetch(`/api/admin/set_admin`);
                if (!res.ok) throw new Error(`Failed with status ${res.status}`);
            } catch (error) {
                console.error('Error loading admin data:', error);
            }
        };
        setAdminData();
    }, [session]);

    // csrf token generation
    useEffect(() => {
        const fetchCsrfToken = async () => {
            const token = await getCsrfToken();
            setCsrfToken(token);
        };
        fetchCsrfToken();
    }, []);

    // handleLogin with credentials
    const handleLogin = async (e) => {
        e.preventDefault();

        const result = await signIn('credentials', {
            redirect: false,
            email: EmailInput,
            password: PassInput,
            role: 'admin',
        });

        if (result?.error) {
            setErrorMessage(result.error);
        } else {
            router.push('/Admin'); // Redirect on success
        }
    };


    return (
        <>
            <Header />
            <div className="w-full min-h-[85vh] flex items-center justify-center bg-[#000000] text-[#F1F1F1] mt-[-20px]">
                <div className="flex flex-col items-center min-h-[70vh] p-5 gap-5 w-full sm:max-w-[500px] justify-center bg-[#000000] text-[#F1F1F1]">
                    <h1 className="font-bold text-center text-2xl sm:text-4xl">
                        'Hii, Admin'
                    </h1>
                    {/* Form */}
                    <form className="flex w-full  relative z-[9999] flex-col items-center justify-center gap-5">
                        <input
                            id="Email"
                            name="Email"
                            className="text-white w-full sm:w-[83%] bg-transparent border-2 border-white rounded-full p-2 z-10"
                            placeholder="Email"
                            type="email"
                            value={EmailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                        />
                        <input
                            id="Password"
                            name="Password"
                            className="text-white w-full sm:w-[83%] bg-transparent border-2 border-white rounded-full p-2 z-10"
                            placeholder="Password"
                            type="password"
                            value={PassInput}
                            onChange={(e) => setPassInput(e.target.value)}
                        />
                        {/* Error message */}
                        {errorMessage && (
                            <div className="p-2 font-bold text-[#FF6F61] z-20">{errorMessage}</div>
                        )}

                        {/* Submit buttons */}
                        <button onClick={handleLogin}
                            className="text-white cursor-pointer w-full sm:w-40 bg-transparent border-2 border-white rounded-full p-2 z-20"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default AdminLogin;
