"use client";
import React, { useState } from "react";

// Lawyer Card Content component
const LawyerCard = ({ lawyer }) => {

  // Basic data
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(lawyer.lawyer_verified || "Pending");

  // Get File Name
  const handleOpenCertificate = () => {
    if (lawyer.fileName) {
      setShowModal(true);
    } else {
      alert("Certificate not uploaded.");
    }
  };

  return (
    <>
      <div className="relative bg-neutral-900 border border-neutral-700 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 space-y-6 pb-20">
        <div className="text-white space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-white/50 uppercase">Name</p>
              <p className="text-lg font-semibold">{lawyer.name || "Unknown User"}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${status === "Approved"
                ? "bg-green-500"
                : status === "Rejected"
                  ? "bg-red-500"
                  : "bg-yellow-500 text-black"
                }`}
            >
              {status === "Approved"
                ? "Approved"
                : status === "Rejected"
                  ? "Rejected"
                  : "Pending"}
            </span>
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase">Email</p>
            <p className="text-sm break-words">{lawyer.email}</p>
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase">Joined</p>
            <p className="text-sm">
              {new Date(lawyer.createdDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase">UPI</p>
            <p className="text-sm">{lawyer.upi || "Not Added"}</p>
          </div>
          {lawyer.categories && Object.keys(lawyer.categories).length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-white/50 uppercase">Categories</p>
              <div className="flex flex-wrap gap-2">
                {Object.values(lawyer.categories).map((cat, index) => (
                  <span
                    key={index}
                    className="bg-white/90 hover:bg-white/100 cursor-pointer text-black text-xs px-3 py-1 rounded-full font-medium"
                  >
                    {cat.name} - ₹{cat.fee}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="absolute bottom-4 inset-x-4 flex justify-between items-center backdrop-blur-sm pt-3 border-t border-white/10">
          <div> </div>
          {/* View Certificate */}
          <button
            onClick={handleOpenCertificate}
            className="text-sm cursor-pointer text-white border border-white/30 px-4 py-2 rounded-lg hover:bg-white/10 transition"
          >
            View Certificate
          </button>
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white rounded-xl w-4/5 h-[80vh] p-4 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute cursor-pointer top-2 right-2 text-black bg-gray-200 hover:bg-gray-300 rounded-full px-3 py-1"
            >
              ✕
            </button>
            <iframe
              src={`/assets/files/${encodeURIComponent(lawyer.name)}/${encodeURIComponent(
                lawyer.fileName
              )}`}
              title="pdf"
              className="w-full h-full rounded-md"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default LawyerCard;
