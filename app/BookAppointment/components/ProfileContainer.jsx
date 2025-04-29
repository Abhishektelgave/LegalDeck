import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import defaultImg from '@/public/images/defaultprofile.png'
import { FaStar } from "react-icons/fa";

// Each Profile Display Component
const ProfileContainer = ({ lawyer }) => {

  const avg = lawyer.ratings.length
    ? lawyer.ratings.reduce((a, b) => a + b, 0) / lawyer.ratings.length
    : 0;

  return (
    <Link href={{ pathname: `/BookAppointment/${lawyer.name}` }} className="profileContain z-[999] relative flex items-center p-2 border border-[#FF6F61] rounded-lg w-fit">
      <div className="pp flex gap-2">
        <Image src={defaultImg} width={50} height={50} className='rounded-full' alt="Profile Picture" />
        <div className="content">
          <div className="lawyername">{lawyer.name}</div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className="cursor-pointer w-4.5 transition-all"
                size={28}
                color={(avg) >= star ? "#FFFFFF" : "#444"}
              />
            ))}
            {'(' + lawyer.ratings.length + ') '}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProfileContainer
