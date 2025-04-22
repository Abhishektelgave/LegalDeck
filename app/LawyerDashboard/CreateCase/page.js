// ~NOT IN USE YET
"use client"
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAppointmentStore } from '@/app/store/appointment';
import { useRouter } from 'next/navigation';
import Loading from '@/app/components/LoadingPage';

const CreateCase = () => {

    const { data: session } = useSession();
    const appt = useAppointmentStore((state) => state.appt);

    const router = useRouter();
    const [formData, setFormData] = useState({
        lawyerId:'',
        userId:'',
        category:'',
        dateStarted:'',
        status:'',
        Desc:'',
    });

    useEffect(() => {
        if (session) {
            setFormData({
                lawyerId: session.user.id,
            });
        }
    }, [session]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/case/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            console.log(formData.categories);
            if (!res.ok) throw new Error(`Failed with status ${res.status}`);

            router.push('/LawyerDashboard');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (!session) return <Loading />;

    if (session) {
        return (
            <div className="min-w-[31vw] flex items-center justify-center bg-[#121212] text-[#F1F1F1]">
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

                    <input
                        name="upi"
                        placeholder="UPI ID"
                        value={formData.upi}
                        onChange={handleChange}
                        className="text-white w-[83%] bg-transparent border border-white rounded-full pl-8 pr-10 p-2"
                    />
                    <button
                        type="submit"
                        className="text-white w-[83%] bg-[#FF6F61] border border-white rounded-full p-2"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        )
    }
}

export default CreateCase
