"use client";
import { useEffect, useState } from "react";
import Footer from "./Footer.jsx";
import LandingPage from "./LandingPage";
import { SessionProvider } from 'next-auth/react';


export default function ClientLayout({ children }) {
    const [isClient, setIsClient] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Landing page timeout
    useEffect(() => {
        setIsClient(true);
        const timer = setTimeout(() => setIsLoading(false), 4000);
        return () => clearTimeout(timer);
    }, []);

    if (!isClient) return null;

    return (
        <>
            {isLoading ? (
                <LandingPage />
            ) : (
                <>
                    <SessionProvider>
                        {children}
                    </SessionProvider>
                    <Footer />
                </>
            )}
        </>
    );
}
