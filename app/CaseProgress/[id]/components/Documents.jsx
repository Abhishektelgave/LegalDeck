'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import LawyerDocumentComponent from '@/app/CaseProgress/[id]/components/LawyerDocumentComponent';
import UserDocumentComponent from '@/app/CaseProgress/[id]/components/UserDocumentComponent';

export default function Documents({ caseDetails }) {
  const { data: session } = useSession();
  return (
    <>
      {session?.user?.role === 'lawyer' ? (
        <LawyerDocumentComponent caseDetails={caseDetails} />
      ) : (
        <UserDocumentComponent caseDetails={caseDetails} />
      )}
    </>
  );
}
