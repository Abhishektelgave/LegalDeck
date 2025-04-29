"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loading from '@/app/components/LoadingPage';
import CategorySelector from '@/app/Auth/[method]/components/CategorySelector';

// Edit Lawyer Details Page
const Edit = () => {

    // Basic data
    const { data: session } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        categories: [],
        upi: '',
        email: '',
    });

    // set Form to Session data
    useEffect(() => {
        if (session) {
            setFormData({
                email: session.user.email,
                name: session.user.name || '',
                categories: session.user.categories || [],
                upi: session.user.upi || '',
            });
            console.log("session data" + formData.categories);
        }
    }, [session]);

    // Handle Chnage to form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Catageory change 
    const handleCategoryChange = (updatedCategories) => {
        setFormData((prev) => ({ ...prev, categories: updatedCategories }));
    };

    // Update details of lawyer
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            console.log(formData.categories);
            if (!res.ok) throw new Error(`Failed with status ${res.status}`);

            const data = await res.json();
            if (session) {
                session.user = data.user; // Update session locally
            }
            router.push('/LawyerDashboard');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (!session) return <Loading />;

    if (session) {
        return (
            <div className="min-w-[31vw] flex items-center justify-center border-1 border-[#FFFFFF] -mt-3.5 p-10 rounded-2xl bg-[#121212] text-[#F1F1F1]">
                <form
                    onSubmit={handleSubmit}
                    className="flex relative z-[9999] flex-col items-center gap-5 w-full justify-center"
                >
                    <h1 className="font-bold text-center text-2xl">Edit Profile</h1>
                    <input
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="text-white w-[83%] bg-transparent border border-white rounded-full pl-8 pr-10 p-2"
                    />
                    <CategorySelector
                        value={formData.categories}
                        onChange={handleCategoryChange}
                    />

                    {session.user.isApproved === 'Approved' ? <input
                        name="upi"
                        placeholder="UPI ID"
                        value={formData.upi}
                        onChange={handleChange}
                        className="text-white w-[83%] bg-transparent border border-white rounded-full pl-8 pr-10 p-2"
                    /> : ''}

                    <button
                        type="submit"
                        className="text-[#000000] cursor-pointer w-[83%] hover:bg-[#ffffff] bg-[#e6e5e5] border border-white rounded-full p-2"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        );
    };
};

export default Edit;
