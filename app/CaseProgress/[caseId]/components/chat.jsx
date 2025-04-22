// ~NOT IN USE YET
'use client';

import { useEffect, useState } from 'react';
import { Session, Chatbox } from '@talkjs/react';

export default function HomePage() {
    const [conversationId, setConversationId] = useState(null);

    const currentUser = {
        id: 'alice',
        name: 'Alice',
        email: 'alice@example.com',
        photoUrl: 'https://talkjs.com/images/avatar-1.jpg',
        role: 'user',
    };

    const otherUser = {
        id: 'bob',
        name: 'Bob',
        email: 'bob@example.com',
        photoUrl: 'https://talkjs.com/images/avatar-5.jpg',
        role: 'user',
    };

    // useEffect(() => {
    //     const createConversation = async () => {
    //         console.log('Rendering Chatbox with user:', currentUser);

    //         try {
    //             const res = await fetch('/api/talkjs', {
    //                 method: 'POST',
    //                 headers: { 'Content-Type': 'application/json' },
    //                 body: JSON.stringify({ currentUser, otherUser }),
    //             });

    //             if (!res.ok) {
    //                 const errText = await res.text();
    //                 throw new Error(`API Error: ${errText}`);
    //             }

    //             const data = await res.json();
    //             setConversationId(data.conversationId);
    //         } catch (err) {
    //             console.error('Conversation Error:', err);
    //         }
    //     };

    //     createConversation();
    // }, []);

    return (
        <>
            {/* <div style={{ height: '500px' }}>
                {conversationId && (
                    <Session appId="tUsjNDdJ" user={currentUser}>
                        <Chatbox conversationId={conversationId} />
                    </Session>
                )}
            </div> */}
            <div className='h-[97vh] rounded-4xl w-[30vw] bg-white text-2xl text-black'></div>
        </>
    );
}
