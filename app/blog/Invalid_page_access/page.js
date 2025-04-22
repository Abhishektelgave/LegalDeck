// ~NOT IN USE YET
"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const InvalidPageAccess = () => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/"); // go back to blog home or anywhere
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white text-center p-4">
            <h1 className="text-4xl font-bold mb-4">🚫 Invalid Access</h1>
            <p className="text-lg mb-2">
                You are not authorized to access this page.
            </p>
            <p className="text-sm text-gray-400">
                Redirecting you shortly or{' '}
                <button
                    className="underline text-blue-400"
                    onClick={() => router.push("/")}
                >
                    click here
                </button>{' '}
                to return.
            </p>
        </div>
    );
};

export default InvalidPageAccess;
