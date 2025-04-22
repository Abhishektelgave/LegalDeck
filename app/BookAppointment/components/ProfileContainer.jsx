import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import defaultImg from '@/public/images/defaultprofile.png'

// Each Profile Display Component
const ProfileContainer = ({ lawyer }) => {
  return (
    <Link href={{ pathname: `/BookAppointment/${lawyer.name}` }} className="profileContain z-[999] relative flex items-center p-2 border border-[#FF6F61] rounded-lg w-fit">
      <div className="pp flex gap-2">
        <Image src={defaultImg} width={50} height={50} className='rounded-full' alt="Profile Picture" />
        <div className="content">
          <div className="lawyername">{lawyer.name}</div>
          {/* Need To Add Rating Section*/}
          <div>rating tags</div>
        </div>
      </div>
    </Link>
  );
};

export default ProfileContainer
