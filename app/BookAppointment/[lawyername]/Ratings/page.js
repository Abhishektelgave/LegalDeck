"use client";
import React, { useContext, useState } from "react";
import { LawyerContext } from "@/app/context/page";
import { useSession } from "next-auth/react";
import { FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";

const GiveRating = () => {
  const lawyer = useContext(LawyerContext);
  const { data: session } = useSession();
  const router = useRouter();

  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(null);
  const [comment, setComment] = useState("");
  const [submitMsg, setSubmitMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category) {
      setSubmitMsg("Please select a category.");
      return;
    }

    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lawyerId: lawyer._id,
          userId: session.user.id,
          category,
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitMsg("Rating submitted successfully!");
        setComment("");
        setCategory("");
        setRating(5);
        router.push('/UserDashboard')
      } else {
        setSubmitMsg(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setSubmitMsg("Failed to submit rating.");
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-6 items-center">
      <h2 className="text-2xl font-bold text-[#ffffff]">Give a Rating</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <div className="flex flex-col">
          <label className="mb-1">Select Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-[#1f1f1f] text-white border border-[#444] p-2 rounded-lg"
          >
            <option value="">-- Choose a category --</option>
            {Object.entries(lawyer.categories).map(([key, value]) => (
              <option key={key} value={value.name}>
                {value.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-1">Your Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className="cursor-pointer transition-all"
                size={28}
                color={(hoverRating || rating) >= star ? "#FFFFFF" : "#444"}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <label className="mb-1">Comment (optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="bg-[#1f1f1f] text-white border border-[#444] p-2 rounded-lg resize-none"
            placeholder="Write something..."
          />
        </div>

        <button
          type="submit"
          className="bg-[#e7e7e7] text-[#000000] py-2 rounded-lg hover:bg-[#ffffff] transition-all"
        >
          Submit Rating
        </button>
        {submitMsg && (
          <p className="text-sm mt-2 text-center text-[#FF6F61]">{submitMsg}</p>
        )}
      </form>
    </div>
  );
};

export default GiveRating;
