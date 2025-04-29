"use client"
import React, { useState, useEffect } from 'react'
import { useSession, signIn, getCsrfToken } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/Header';

const AdminLogin = () => {
    const [isClient, setIsClient] = useState(true);
    const [csrfToken, setCsrfToken] = useState('');
    const [errorMessage, setErrorMessage] = useState("");

    const [EmailInput, setEmailInput] = useState("");
    const [PassInput, setPassInput] = useState("");

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

    useEffect(() => {
        const fetchCsrfToken = async () => {
            const token = await getCsrfToken();
            setCsrfToken(token);
        };
        fetchCsrfToken();
    }, []);

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
            router.push('/Admin');
        }
    };

    return (
        <>
            <Header />
            <div className="w-full min-h-[85vh] flex items-center justify-center bg-black text-white px-4">
                <div className="flex flex-col items-center w-full max-w-md bg-black text-white p-5 gap-6">
                    <h1 className="font-bold text-center text-2xl sm:text-4xl">Hii, Admin</h1>

                    <form
                        className="flex flex-col w-full items-center gap-5"
                        onSubmit={handleLogin}
                    >
                        <input
                            id="Email"
                            name="Email"
                            className="w-full bg-transparent border-2 border-white rounded-full p-2 placeholder-white"
                            placeholder="Email"
                            type="email"
                            value={EmailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                        />
                        <input
                            id="Password"
                            name="Password"
                            className="w-full bg-transparent border-2 border-white rounded-full p-2 placeholder-white"
                            placeholder="Password"
                            type="password"
                            value={PassInput}
                            onChange={(e) => setPassInput(e.target.value)}
                        />

                        {errorMessage && (
                            <div className="text-sm font-semibold text-[#FF6F61]">{errorMessage}</div>
                        )}

                        <button
                            type="submit"
                            className="w-full sm:w-40 bg-transparent border-2 border-white rounded-full p-2 hover:bg-white hover:text-black transition"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AdminLogin;
