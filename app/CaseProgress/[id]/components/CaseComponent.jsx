"use client"
import React from 'react'

const CaseComponent = ({ caseDetails }) => {
    const stageLabels = ['Initiated', 'Docs Submitted', 'Under Review', 'Resolved'];
    const statusIndex = ['Not Started', 'docs_submitted', 'under_review', 'resolved'].indexOf(caseDetails.status);

    return (
        <div className="bg-black border border-white/30 p-6 rounded-xl shadow-md hover:shadow-white/40 transition-all duration-350 ease-in-out relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none" />
            <h2 className="text-2xl font-semibold mb-4">Case Details</h2>
            <div className="flex justify-between items-center mb-4">
                <div className="text-left">
                    <p className="text-xs uppercase text-white/60">From</p>
                    <p className="text-sm font-semibold">{caseDetails.userName || "Unknown User"}</p>
                </div>

                <div className="w-1/3 h-[2px] bg-white/20 relative mx-2" />

                <div className="text-right">
                    <p className="text-xs uppercase text-white/60">To</p>
                    <p className="text-sm font-semibold">{caseDetails.lawyerName}</p>
                </div>
            </div>
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between gap-1">
                    <div><strong className="text-gray-300">Case ID:</strong> {caseDetails._id}</div>
                    <div><strong className="text-gray-300">Category:</strong> {caseDetails.category || 'N/A'}</div>
                </div>
                <div className="flex justify-between gap-4">
                    <div><strong className="text-gray-300">Date Started:</strong> {caseDetails.dateStarted ? new Date(caseDetails.dateStarted).toLocaleDateString() : 'N/A'}</div>
                    <div>
                        <strong className="text-gray-300">Status:</strong>
                        <span className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ml-2 
        ${caseDetails.status === 'Resolved' ? 'bg-green-700 text-green-300' :
                                caseDetails.status === 'Active' ? 'bg-yellow-700 text-yellow-300' :
                                    caseDetails.status === 'Rejected' ? 'bg-red-700 text-yellow-300' :
                                        'bg-gray-300 text-[#0f0e0e]'}`}>
                            {caseDetails.status}
                        </span>
                    </div>
                </div>
            </div>


            <div className="mb-6">
                <strong className="text-gray-300 block mb-2">Description:</strong>
                <span className='flex gap-3 items-center'>
                    <p className="text-gray-400">{caseDetails.desc || 'No description available.'}</p>
                    {!caseDetails.desc &&
                        <button className='px-4 py-1 cursor-pointer hover:bg-[#dcdcdc] rounded-full bg-[#FFFFFF] text-[#000000] text-sm'>Add description</button>
                    }
                </span>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4">Case Progress</h3>
                <div className="flex items-center space-x-4">
                    {stageLabels.map((label, index) => {
                        const isActive = index <= statusIndex;
                        return (
                            <React.Fragment key={label}>
                                <div className="flex flex-col items-center text-center">
                                    <div className={`w-5 h-5 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                                    <span className={`mt-2 text-sm ${isActive ? 'text-green-300' : 'text-gray-500'}`}>{label}</span>
                                </div>
                                {index < stageLabels.length - 1 && (
                                    <div className={`flex-1 h-1 ${index < statusIndex ? 'bg-green-400' : 'bg-gray-700'}`}></div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CaseComponent;
