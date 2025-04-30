'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import geminiImg from '@/public/images/gemini.webp';

const ChatBox = ({ caseDetails, senderId, senderRole }) => {
  const [messages, setMessages] = useState(caseDetails.messages || []);
  const [input, setInput] = useState('');
  const [geminiMessages, setGeminiMessages] = useState([]);
  const [geminiActive, setGeminiActive] = useState(false);
  const [geminiDirection, setGeminiDirection] = useState('');
  const messagesContainerRef = useRef(null);

  const role = senderRole === 'lawyer' ? 'Lawyer' : 'User';
  const caseId = caseDetails._id;

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(scrollToBottom, [messages, geminiMessages]);

  useEffect(() => {
    const storedGeminiMessages = localStorage.getItem('geminiMessages');
    if (storedGeminiMessages) {
      setGeminiMessages(JSON.parse(storedGeminiMessages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('geminiMessages', JSON.stringify(geminiMessages));
  }, [geminiMessages]);

  useEffect(() => {
    if (!geminiActive) {
      setGeminiDirection('out');
      const timeout = setTimeout(() => setGeminiDirection(''), 500);
      return () => clearTimeout(timeout);
    } else {
      setGeminiDirection('in');
    }
  }, [geminiActive]);

  const sendMessage = async () => {
    if (!input.trim() || geminiActive) return;

    const userMessage = { senderId, senderRole: role, message: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    await fetch('/api/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseId, senderId, senderRole: role, message: input }),
    });
  };

  const sendPromptToGemini = async () => {
    if (!input.trim() || !geminiActive) return;

    const prompt = input;
    setInput('');

    // Save user prompt to geminiMessages
    const userPrompt = {
      senderId,
      senderRole: 'User',
      message: prompt,
    };
    setGeminiMessages(prev => [...prev, userPrompt]);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          messageHistory: messages.slice(-5),
          caseDetails,
        }),
      });

      const data = await res.json();
      if (data.response) {
        const geminiResponse = {
          senderId: 'gemini',
          senderRole: 'AI',
          message: data.response,
        };
        setGeminiMessages(prev => [...prev, geminiResponse]);
      }
    } catch (error) {
      console.error('Gemini Error:', error);
    }
  };

  return (
    <div className="h-[85vh] w-full md:w-[30vw] sm:w-full bg-black rounded-4xl flex flex-col shadow-lg overflow-hidden border-2 border-white">
      {/* Message Display */}
      <div
        ref={messagesContainerRef}
        className="h-[calc(85vh-70px)] mt-12 overflow-y-auto flex flex-col-reverse p-4 space-y-3 space-y-reverse bg-black text-white scrollbar-hide"
      >
        {geminiActive ? (
          geminiMessages.length === 0 ? (
            <div className="flex-1 w-full flex items-center justify-center text-gray-500 text-sm">
              No Gemini messages yet. Start a conversation!
            </div>
          ) : (
            geminiMessages
              .slice()
              .reverse()
              .map((msg, index) => (
                <div
                  key={index}
                  className={`relative max-w-[80%] p-4 rounded-2xl text-sm flex items-start gap-2 ${msg.senderRole === 'AI'
                      ? 'bg-blue-600 text-white self-start'
                      : 'bg-gray-800 text-white self-end'
                    }`}
                >
                  {msg.senderRole === 'AI' && (
                    <Image
                      src={geminiImg}
                      alt="Gemini"
                      width={24}
                      height={24}
                      className="rounded-full invert mt-1"
                    />
                  )}
                  <span>{msg.message}</span>
                </div>
              ))
          )
        ) : messages.length === 0 ? (
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

      {/* Input Area */}
      <div className="h-[70px] p-3 bg-[#121212] border-t border-gray-700 flex gap-2 items-center">
        {geminiActive ? (
          <div className="flex-1 relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 overflow-visible">
              {(geminiActive || geminiDirection === 'out') && (
                <Image
                  src={geminiImg}
                  alt="Gemini"
                  width={40}
                  height={30}
                  className={`invert z-10 transition-all duration-500 ease-in-out transform
                    ${geminiActive && geminiDirection === 'in'
                      ? 'translate-x-0 opacity-100'
                      : 'translate-x-10 opacity-0'}`}
                />
              )}
            </div>

            <input
              type="text"
              className="flex-1 w-[18.5vw] border bg-transparent border-gray-600 text-white rounded-full px-3 pl-10 py-2 text-sm outline-none"
              placeholder="Ask Gemini..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendPromptToGemini()}
            />
          </div>
        ) : (
          <input
            type="text"
            className="flex-1 border border-gray-600 bg-[#1e1e1e] text-white rounded-full px-3 py-2 text-sm outline-none"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
        )}

        {/* Toggle Gemini */}
        <button
          className="flex items-center justify-center"
          onClick={() => setGeminiActive(prev => !prev)}
        >
          {geminiActive ? (
            <span className="invert mt-2">
              <lord-icon
                src="https://cdn.lordicon.com/zxvuvcnc.json"
                trigger="hover"
                colors="primary:#000000,secondary:#ffffff"
                style={{ width: '60px', height: '40px' }}
              />
            </span>
          ) : (
            <Image src={geminiImg} className="cursor-pointer" width={60} height={30} alt="Gemini" />
          )}
        </button>

        {/* Send Button */}
        {geminiActive ? (
          <button
            onClick={sendPromptToGemini}
            className="px-[20.8px] cursor-pointer py-2 bg-[#61bada] hover:bg-[#88dfff] text-[#000000] text-sm rounded-full"
          >
            Ask
          </button>
        ) : (
          <button
            onClick={sendMessage}
            className="px-4 cursor-pointer py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-full"
          >
            Send
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
