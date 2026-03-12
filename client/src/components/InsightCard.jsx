import React from 'react'
// import { motion } from "motion/react"
import { GoPlus } from "react-icons/go";


const InsightCard = ({title, icon}) => {
  return (
    <div className='w-80 h-90 bg-linear-to-b from-zinc-800 to-transparent rounded-xl flex flex-col gap-5 p-7 border border-zinc-700'>
       <div className='w-full h-[90%] relative'>
        <div className='w-40 h-40 bg-primary/30 border border-primary rounded-xl absolute top-10 left-10 rotate-10 '></div>
        <div className='w-40 h-40 bg-zinc-900 rounded-xl absolute top-10 left-10  flex justify-center items-center '>
            <div className='bg-primary/50 w-fit p-3 rounded-lg flex justify-center items-center '>
                {icon}
            </div>
        </div>
       </div>
       <div className='flex justify-between items-center '>
        <p className='text-lg'>{title}</p>
        <div className='w-10 h-10 bg-zinc-800 p-3 rounded-full flex justify-center items-center'>
            <GoPlus />
        </div>
       </div>
      
    </div>
  )
}

export default InsightCard
