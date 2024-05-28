"use client"
import React from 'react'
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { useUser, UserButton } from "@clerk/nextjs";
import Link from 'next/link';

function Header() {
  const { user, isSignedIn } = useUser();
  
  let getStartedLink = '/sign-in';
  if (isSignedIn) {
    getStartedLink = '/dashboard';
  }
  
  return (
    <div className='p-3 flex justify-between items-center border shadow-sm'>
      <Image src={'./budget-tracker.png'}
             alt='logo'
             width={95}
             height={50}
      />
      <div className='flex gap-3 items-center'>
        <Link href={'/dashboard'}>
          <Button variant="outline" name="dashboard">Dashboard</Button>
        </Link>
        <Link href={getStartedLink}>
          <Button id='getStartedBtnHeader'>Get Started</Button>
        </Link>
        {isSignedIn && <UserButton afterSignOutUrl='/'/>}
      </div>
    </div>
  )
}

export default Header
