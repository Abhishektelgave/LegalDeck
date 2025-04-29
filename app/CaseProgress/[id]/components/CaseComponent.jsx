"use client"
import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSession } from 'next-auth/react';

const CaseComponent = ({ caseDetails }) => {
    const { data: session } = useSession();
    const stageLabels = [
        { label: 'Initiated', desc: 'Case creation initiated' },
        { label: 'Pre-filing', desc: 'Consultation & evidence collection' },
        { label: 'Filing of the Plaint', desc: 'Formal complaint filed in court' },
        { label: 'Admission of the Case by the Court', desc: 'Court accepts the case' },
        { label: 'Notice to Defendant', desc: 'Defendant is notified' },
        { label: 'Reply by the Defendant', desc: 'Defendant responds to case' },
        { label: 'Framing of Issues', desc: 'Court identifies main issues' },
        { label: 'Evidence Stage', desc: 'Evidence presented & cross-examined' },
        { label: 'Final Arguments', desc: 'Final statements from lawyers' },
        { label: 'Judgment', desc: 'Court delivers its verdict' },
        { label: 'Post-Judgment Procedures', desc: 'Execution or appeal process' },
        { label: 'Resolved', desc: 'Case is concluded' },
    ];
    
    const initialProgress = stageLabels.findIndex(s => s.label === caseDetails.caseProgress);
    const [activeIndex, setActiveIndex] = useState(initialProgress >= 0 ? initialProgress : 0);
    const [progressIndex, setProgressIndex] = useState(initialProgress >= 0 ? initialProgress : 0);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [caseStatus, setCaseStatus] = useState(caseDetails.status);
    const scrollRef = useRef();
    const nextStageIndex = progressIndex + 1;
    
    useEffect(() => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const cardWidth = 240;
        const offset = cardWidth * activeIndex - (container.offsetWidth - cardWidth) / 2;
        container.scrollTo({ left: offset, behavior: 'smooth' });
    }, [activeIndex]);

    const handleScroll = (dir) => {
        setActiveIndex(prev => {
            const next = dir === 'left' ? prev - 1 : prev + 1;
            return Math.min(Math.max(next, 0), stageLabels.length - 1);
        });
    };

    const UpdateCaseProgress = async (index) => {
        const stage = stageLabels[index].label;
        const res = await fetch('/api/case/updateProgress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: caseDetails._id,
                caseProgress: stage,
            }),
        });
        if (res.ok) {
            if (stage === 'Resolved') {
                setCaseStatus('Resolved');
            }
            setProgressIndex(index);
        }
    };

    if (session) {
        return (
            <div className="bg-black border border-white/30 p-6 rounded-xl shadow-md hover:shadow-white/40 transition-all duration-350 ease-in-out relative mx-auto">
                <h2 className="text-2xl font-semibold mb-4 text-center text-white">Case Details</h2>

                <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="text-xs uppercase text-white/60">From</p>
                        <p className="text-sm font-semibold text-white">{caseDetails.userName || 'Unknown User'}</p>
                    </div>
                    <div className="w-12 h-[2px] bg-white/40 rounded-full" />
                    <div>
                        <p className="text-xs uppercase text-white/60">To</p>
                        <p className="text-sm font-semibold text-white">{caseDetails.lawyerName}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 mb-6 text-white text-sm">
                    <div className="flex justify-between">
                        <div><strong className="text-gray-300">Case ID:</strong> {caseDetails._id}</div>
                        <div><strong className="text-gray-300">Category:</strong> {caseDetails.category || 'N/A'}</div>
                    </div>
                    <div className="flex justify-between">
                        <div><strong className="text-gray-300">Date Started:</strong> {caseDetails.dateStarted ? new Date(caseDetails.dateStarted).toLocaleDateString() : 'N/A'}</div>
                        <div>
                            <strong className="text-gray-300">Status:</strong>
                            <span className={`inline-block ml-2 px-2 py-1 rounded-full font-semibold
              ${caseStatus === 'Resolved' ? 'bg-green-700 text-green-300' : ''}
              ${caseStatus === 'Active' ? 'bg-yellow-700 text-yellow-300' : ''}
              ${caseStatus === 'Rejected' ? 'bg-red-700 text-yellow-300' : ''}
              ${!['Resolved', 'Active', 'Rejected'].includes(caseStatus) ? 'bg-gray-300 text-black' : ''}`}
                            >{caseStatus}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-center text-white">Case Progress</h3>
                    <div className="relative flex -mx-5 items-center overflow-hidden">
                        <button
                            className="absolute cursor-pointer left-0 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full z-10 ml-2"
                            onClick={() => handleScroll('left')}
                        >
                            <ChevronLeft className="text-white" />
                        </button>
                        <button
                            className="absolute cursor-pointer right-0 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full z-10 mr-2"
                            onClick={() => handleScroll('right')}
                        >
                            <ChevronRight className="text-white" />
                        </button>

                        <div
                            ref={scrollRef}
                            className="flex items-center min-h-[30vh] mx-15 overflow-x-auto gap-0 py-6 scroll-smooth custom-scrollbar"
                            style={{ scrollSnapType: 'x mandatory' }}
                        >
                            {stageLabels.map((stage, index) => {
                                const isReached = index <= progressIndex;
                                const isCenter = index === activeIndex;
                                const showSet = hoverIndex === index && index === nextStageIndex;
                                const isLast = index === stageLabels.length - 1;

                                return (
                                    <div
                                        key={stage.label}
                                        className="flex items-center"
                                        onMouseEnter={() => setHoverIndex(index)}
                                        onMouseLeave={() => setHoverIndex(null)}
                                    >
                                        <div
                                            onClick={() => setActiveIndex(index)}
                                            className={`relative flex flex-col items-center px-2 transition-all duration-300 ease-in-out cursor-pointer ${isCenter ? 'scale-110' : ''}`}
                                        >
                                            {showSet && session.user.role !== 'user' && (
                                                <button
                                                    className="absolute -top-4 cursor-pointer bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1 rounded-full shadow-md z-20"
                                                    onMouseDown={e => e.stopPropagation()}
                                                    onClick={() => UpdateCaseProgress(index)}
                                                >Set Stage</button>
                                            )}
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border-4 transition-colors duration-300
                      ${isReached ? 'bg-green-400 border-green-400' : 'bg-gray-700 border-gray-500'}`}
                                            >
                                                <span className={`${isReached ? 'text-green-900' : 'text-gray-300'} font-bold`}>{index + 1}</span>
                                            </div>
                                            <p className={`${isReached ? 'text-green-200' : 'text-gray-400'} text-sm font-medium text-center`}>{stage.label}</p>
                                            {isCenter && <p className="text-xs text-gray-300 text-center mt-1">{stage.desc}</p>}
                                        </div>

                                        {!isLast && (
                                            <div className={`h-[2px] w-40 mx-2 rounded-full transition-colors duration-300
                      ${index < progressIndex ? 'bg-green-400' : 'bg-gray-600'}`}
                                            />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { height: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.2); border-radius: 10px; }
            `}</style>
            </div>
        );
    };
};

export default CaseComponent;
