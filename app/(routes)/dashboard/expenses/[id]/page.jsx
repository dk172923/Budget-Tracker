"use client"
import { useUser } from '@clerk/nextjs';
import { getBudgetInfo as fetchBudgetInfo, getExpensesList as fetchExpensesList, deleteBudget as removeBudget } from '@/utils/actions';
import React, { useEffect, useState } from 'react'
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from '../_components/AddExpense';
import ExpenseListTable from '../_components/ExpenseListTable';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pen, PenBox, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner';
import { useRouter, useParams } from 'next/navigation';
import EditBudget from '../_components/EditBudget';

function ExpensesScreen() {
    const params=useParams();
    const {user}=useUser();
    const [budgetInfo,setbudgetInfo]=useState();
    const [expensesList,setExpensesList]=useState([]);
    const route=useRouter();
    useEffect(()=>{

        user&&getBudgetInfo();

    },[user]);

    /**
     * Get Budget Information
     */
    const getBudgetInfo=async()=>{
        const result = await fetchBudgetInfo(params.id);
          if(!result)
          {
            route.replace('/dashboard/budgets');
            return;
          }
          setbudgetInfo(result);
          getExpensesList();
    }

    /**
     * Get Latest Expenses
     */
    const getExpensesList=async()=>{
      const result=await fetchExpensesList(params.id);
      setExpensesList(result);
    }

    /**
     * Used to Delete budget
     */
    const deleteBudget=async()=>{

      await removeBudget(params.id);
      toast('Budget Deleted !');
      route.replace('/dashboard/budgets');



    }

  return (
    <div className='p-10'>
        <h2 className='text-2xl font-bold gap-2 flex justify-between items-center'>
        <span className='flex gap-2 items-center'>
        <ArrowLeft onClick={()=>route.back()} className='cursor-pointer'/>
          My Expenses
          </span>
        <div className='flex gap-2 items-center'>
         <EditBudget budgetInfo={budgetInfo}
         refreshData={()=>getBudgetInfo()}  />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="flex gap-2" variant="destructive" name="delete_budget">
            <Trash/> Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your current budget along with expenses
                  and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={()=>deleteBudget()} name="delete_budget_confirmation_btn">Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          </div>

       </h2>
        <div className='grid grid-cols-1
        md:grid-cols-2 mt-6 gap-5'>
           {budgetInfo? <BudgetItem
            budget={budgetInfo}
            />:
            <div className='h-[150px] w-full bg-slate-200
            rounded-lg animate-pulse'>
            </div>}
            <AddExpense budgetId={params.id}
            user={user}
            refreshData={()=>getBudgetInfo()}
            />
        </div>
        <div className='mt-4'>

          <ExpenseListTable expensesList={expensesList}
          refreshData={()=>getBudgetInfo()} />
        </div>
    </div>
  )
}

export default ExpensesScreen