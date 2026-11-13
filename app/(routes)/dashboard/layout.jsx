"use client"
import React, { useEffect } from 'react'
import SideNav from './_components/SideNav'
import DashboardHeader from './_components/DashboardHeader'
import { hasBudgets } from '@/utils/actions'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

function DashboardLayout({children}) {

  const {user}=useUser();
  const router=useRouter();
  useEffect(()=>{
    user&&checkUserBudgets();
  },[user])

  const checkUserBudgets=async()=>{
    const exists=await hasBudgets();
    if(!exists)
    {
      router.replace('/dashboard/budgets')
    }
  }
  return (
    <div>
        <div className='fixed md:w-64 hidden md:block '>
            <SideNav/>
        </div>
        <div className='md:ml-64 '>
          <DashboardHeader/>
        {children}
        </div>
        </div>
  )
}

export default DashboardLayout