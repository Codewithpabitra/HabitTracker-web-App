import React from 'react'

const Footer = () => {
  return (
    <div className=' flex justify-between items-center h-auto py-10 mt-20 border-t border-zinc-800'>
      <div className='flex flex-col justify-between items-start gap-6 '>
        <div className='h-3xl w-full flex flex-col gap-3 '>
            <h1 className='text-xl font-semibold text-primary'>HabitMind</h1>
            <p className='max-w-sm leading-tight '>Simple, insightful, and seamless habit tracking. HabitMind makes your habits to be happen.</p>
        </div>
        <div className='mt-5'>
        <p className='text-sm '>Created by team ofTheLosers.</p>
        <p className='text-sm'>&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>

    {/* links  */}
      <div className='flex justify-center items-start gap-10'>
        <ul className='text-sm flex flex-col gap-3 '>
            <li className='text-white'>Navigation</li>
            <li className='text-neutral-300 hover:text-neutral-100 cursor-pointer transition-all duration-200'>Why HabitMind?</li>
            <li className='text-neutral-300 hover:text-neutral-100 cursor-pointer transition-all duration-200'>features</li>
            <li className='text-neutral-300 hover:text-neutral-100 cursor-pointer transition-all duration-200'>How it works</li>
            <li className='text-neutral-300 hover:text-neutral-100 cursor-pointer transition-all duration-200'>Benefits</li>
        </ul>

        <ul className='text-sm flex flex-col gap-3 '>
            <li className='text-white'>Socials</li>
        <li className='text-neutral-300 hover:text-neutral-100 cursor-pointer transition-all duration-200'>Twitter(X)</li>
        <li className='text-neutral-300 hover:text-neutral-100 cursor-pointer transition-all duration-200'>Instagram</li>
        <li className='text-neutral-300 hover:text-neutral-100 cursor-pointer transition-all duration-200'>LinkedIn</li>
        <li className='text-neutral-300 hover:text-neutral-100 cursor-pointer transition-all duration-200'>Github</li>
        </ul>
      </div>
    </div>
  )
}

export default Footer
