'use client'
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const page = () => {
  const { data: session } = useSession();
  const [counter, setCounter] = useState(5);
  const router = useRouter()

  useEffect(() => {
    if (session.user.role === 'user' ) {
      const timeoutId = setTimeout(() => {
        router.push(`/UserDashBoard`);
      }, 5000);

      const intervalId = setInterval(() => {
        setCounter(prev => prev - 1);
      }, 1000);

      // Clean up both on unmount or re-run
      return () => {
        clearTimeout(timeoutId);
        clearInterval(intervalId);
      };
    }
  }, [router]);

  return (
    <div className='flex w-screen h-screen items-center justify-between'>
      Payment Already Completed
      {session.user.role === 'user' && (
        <div className='flex flex-col items-center justify-center gap-5 py-4'>
          <p>You will be redirected in
            <span className='text-red-500'>
              {' ' + counter + ' '}
            </span>
            seconds</p>
        </div>
      )}
    </div>
  )
}

export default page
