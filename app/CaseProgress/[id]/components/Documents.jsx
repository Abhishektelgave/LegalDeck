"use client"
import React from 'react';

const Documents = ({ caseDetails }) => {
    return (
        <div className="bg-black border border-white/30 p-6 rounded-xl shadow-md hover:shadow-white/40 transition-all duration-350 ease-in-out relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />
            <h2 className="text-2xl font-semibold mb-4">Documents</h2>
            <div>
                {/* You can map documents here */}
                <p className="text-gray-300">Document list for case ID: {caseDetails._id}</p>
            </div>
        </div>
    );
};

export default Documents;
