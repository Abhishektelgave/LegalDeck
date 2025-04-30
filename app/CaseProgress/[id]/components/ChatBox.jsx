'use client';
import React, { useEffect, useRef, useState } from 'react';

const ChatBox = ({ caseDetails, senderId, senderRole }) => {
  const [messages, setMessages] = useState(caseDetails.messages || []);
  const [input, setInput] = useState('');
  const messagesContainerRef = useRef(null);
  const role = senderRole === 'lawyer' ? 'Lawyer' : 'User';

  const caseId = caseDetails._id;

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const res = await fetch('/api/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        caseId,
        senderId,
        senderRole: role,
        message: input,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setMessages(data.messages);
      setInput('');
    }
  };

  return (
    <div className="h-[85vh] w-full md:w-[30vw] sm:w-full bg-[#000000] rounded-4xl flex flex-col shadow-lg overflow-hidden border-2 border-[#FFFFFF]">

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="h-[calc(85vh-70px)] overflow-y-auto flex flex-col-reverse p-4 space-y-3 space-y-reverse bg-[#000000] text-white scrollbar-hide"
      >

        {messages.length === 0 ? (
          <div className="flex-1 w-full flex items-center justify-center text-gray-500 text-sm">
            No messages yet
          </div>
        ) : (
          messages
            .slice()
            .reverse()
            .map((msg, index) => (
              <div
                key={index}
                className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.senderRole === role
                  ? 'bg-white text-black self-end'
                  : 'bg-gray-800 text-white self-start'
                  }`}
              >
                {msg.message}
              </div>
            ))
        )}
      </div>

      {/* Input Box */}
      <div className="h-[70px] p-3 bg-[#121212] border-t border-gray-700 flex gap-2 items-center">
        <input
          type="text"
          className="flex-1 border border-gray-600 bg-[#1e1e1e] text-white rounded-full px-4 py-2 text-sm outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 cursor-pointer py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
