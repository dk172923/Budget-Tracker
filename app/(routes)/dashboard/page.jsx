"use client"
import React, { useEffect, useState } from 'react'
import { UserButton, useUser } from "@clerk/nextjs";
import CardInfo from './_components/CardInfo';
import { getBudgetList as fetchBudgetList, getAllExpenses as fetchAllExpenses } from '@/utils/actions';
import BarChartDashboard from './_components/BarChartDashboard';
import BudgetItem from './budgets/_components/BudgetItem';
import ExpenseListTable from './expenses/_components/ExpenseListTable';
function Dashboard() {
  const {user}=useUser();

  const [budgetList,setBudgetList]=useState([]);
  const [expensesList,setExpensesList]=useState([]);
  useEffect(()=>{
    user&&getBudgetList();
  },[user])
  /**
   * used to get budget List
   */
  const getBudgetList=async()=>{
    const result=await fetchBudgetList();

    setBudgetList(result);
    getAllExpenses();

  }

  /**
   * Used to get All expenses belong to users
   */
  const getAllExpenses=async()=>{
    const result=await fetchAllExpenses();
    setExpensesList(result);

  }

  return (
    <div className='p-8'>
        <h2 className='font-bold text-4xl'>Hi, {user?.fullName} ✌️</h2>
        <p className='text-gray-500'>Here's what happenning with your money, Lets Manage your expense</p>

        <CardInfo budgetList={budgetList} />
        <div className='grid grid-cols-1 lg:grid-cols-3 mt-6 gap-5'>
          <div className='lg:col-span-2'>
            <BarChartDashboard
              budgetList={budgetList}
            />

          <ExpenseListTable
          expensesList={expensesList}
          refreshData={()=>getBudgetList()}
          />

          </div>
          <div className='grid gap-5'>
            <h2 className='font-bold text-lg'>Latest Budgets</h2>
              {budgetList?.length>0?budgetList.map((budget,index)=>(
                <BudgetItem budget={budget} key={index} />
              ))
            :
              [1,2,3,4].map((item,index)=>(
                <div className='h-[180xp] w-full
                 bg-slate-200 rounded-lg animate-pulse'>
                </div>
              ))

            }
          </div>
        </div>
    </div>
  )
}

export default Dashboard