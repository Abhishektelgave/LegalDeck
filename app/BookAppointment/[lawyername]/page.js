"use client";
import React, { useContext, useEffect, useState } from "react";
import { LawyerContext } from "@/app/context/page";
import { FaStar } from "react-icons/fa";
import LoadingPage from "@/app/components/LoadingPage";

const ReviewPage = () => {
    const lawyer = useContext(LawyerContext);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const res = await fetch(`/api/ratings?lawyerId=${lawyer._id}`);
                const data = await res.json();
                setReviews(data || []);
            } catch (err) {
                console.error("Error fetching ratings:", err);
            } finally {
                setLoading(false);
            }
        };

        if (lawyer?._id) {
            fetchRatings();
        }
    }, [lawyer]);

    return (
        <div className="min-w-[90vw] bg-[#121212] text-[#F1F1F1]">
            <h2 className="text-2xl font-bold text-center mb-6 text-[#FFFFFF]">User Reviews</h2>
            {loading ? (
                <span className="text-center text-[#B0B0B0]"><LoadingPage /></span>
            ) : reviews.length === 0 ? (
                <p className="text-center text-[#B0B0B0]">No reviews yet.</p>
            ) : (
                <div className="sm:grid flex flex-col sm:grid-cols-1 md:grid-cols-2 -ml-2 gap-2 sm:gap-4">
                    {reviews.map((review, idx) => (
                        <div
                            key={idx}
                            className={`border border-[#444] p-4 rounded-lg bg-[#1f1f1f] shadow-md hover:shadow-[0_0_4px_#FFFFFF] transition-shadow ${reviews.length % 2 !== 0 && idx === reviews.length - 1 ? "col-span-2 sm:w-[50vw] sm:mx-auto sm:justify-center" : ""
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-[#FFFFFF]">
                                    {review.userName || "Anonymous"}
                                </span>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                            key={star}
                                            size={16}
                                            color={star <= review.rating ? "#FFFFFF" : "#B0B0B0"}
                                        />
                                    ))}
                                </div>
                            </div>
                            <span className="text-sm uppercase font-semibold tracking-wide text-[#FFFFFF]">
                                {review.category}
                            </span>
                            {review.comment && (
                                <p className="text-sm text-[#B0B0B0] mt-1">{review.comment}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewPage;
