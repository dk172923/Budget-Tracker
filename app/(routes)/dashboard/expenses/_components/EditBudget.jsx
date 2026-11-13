"use client"
import { Button } from '@/components/ui/button'
import { PenBox } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import EmojiPicker from 'emoji-picker-react'
import { Input } from '@/components/ui/input'
import { updateBudget } from '@/utils/actions'
import { toast } from 'sonner'
function EditBudget({budgetInfo,refreshData}) {
    const [emojiIcon,setEmojiIcon]=useState(budgetInfo?.icon);
    const [openEmojiPicker,setOpenEmojiPicker]=useState(false);

    const [name,setName]=useState();
    const [amount,setAmount]=useState();

    useEffect(()=>{
        if(budgetInfo)
        {
            setEmojiIcon(budgetInfo?.icon)
            setAmount(budgetInfo.amount);
            setName(budgetInfo.name)

        }
    },[budgetInfo])
    const onUpdateBudget=async()=>{
        const result=await updateBudget(budgetInfo.id,{name,amount,icon:emojiIcon});

        if(result)
        {
            refreshData()
            toast('Budget Updated!')
        }
    }
  return (
    <div>
         <Dialog>
            <DialogTrigger asChild>
         <Button className="flex gap-2" name="edit_budget"> <PenBox/> Edit</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Update Budget</DialogTitle>
                <DialogDescription>
                    <div className='mt-5'>
                        <Button variant="outline" id="emoji_picker_btn"

                        className="text-lg"
                        onClick={()=>setOpenEmojiPicker(!openEmojiPicker)}
                        >{emojiIcon}</Button>
                        <div className='absolute z-20'>
                            <EmojiPicker
                            open={openEmojiPicker}
                            onEmojiClick={(e)=>{
                                setEmojiIcon(e.emoji)
                                setOpenEmojiPicker(false)
                            }}
                            />
                        </div>
                        <div className='mt-2'>
                            <h2 className='text-black font-medium my-1'>Budget Name</h2>
                            <Input placeholder="e.g. Home Decor" id="budget_name"
                            defaultValue={budgetInfo?.name}
                            onChange={(e)=>setName(e.target.value)} />
                        </div>
                        <div className='mt-2'>
                            <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                            <Input
                            type="number"
                            defaultValue={budgetInfo?.amount}
                            placeholder="e.g. ₹5000" id="budget_amount"
                            onChange={(e)=>setAmount(e.target.value)} />
                        </div>


                    </div>
                </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                    <Button
                            disabled={!(name&&amount)}
                            onClick={()=>onUpdateBudget()}
                        className="mt-5 w-full" name="update-budget-btn">Update Budget</Button>
                    </DialogClose>
                    </DialogFooter>
            </DialogContent>
            </Dialog>
   </div>
  )
}

export default EditBudget