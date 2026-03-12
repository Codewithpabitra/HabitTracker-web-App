import React from 'react'
import { MdArrowOutward } from "react-icons/md";
import { RiStarSFill } from "react-icons/ri";
import { RiStarHalfSLine } from "react-icons/ri";

const Hero = () => {
  return (
    <div className='mt-20 flex flex-col items-center justify-center gap-10 '>
      <div className='flex flex-col items-center justify-center gap-5 '>
        <h1 className='text-7xl text-center tracking-wide leading-20 '>Take Control of <br /> Your Habits With AI</h1>
      <p className='text-lg text-muted-foreground w-130 text-center text-secondary'> Build better habits, write daily journals, and unlock powerful AI insights that help you grow into your most consistent self.</p>
      </div>
      <button className='px-5 py-3 bg-primary text-black rounded-full flex justify-center items-center gap-1 font-semibold hover:gap-2 cursor-pointer text-sm'>Get started now<MdArrowOutward size={20} /></button>

      <div className='flex flex-col gap-2 mt-10 '>
        <p className='text-sm text-center'>They trust us</p>
        <div className='ratings flex justify-center items-center '>
        {[...Array(4)].map((_, index) => (
            <div key={index}>
                <RiStarSFill />
            </div>
        ))}
        <RiStarHalfSLine />
        <p className='ml-2 '>4.9</p>
      </div>
      </div>

      <div className='mt-5 mx-auto relative '>
        <img className='rounded-xl w-full mx-auto'  src={`https://framerusercontent.com/images/6AfF1TCZ0fgDvIyRPSrmwJXP9Hc.png?scale-down-to=1024&width=2880&height=1770`} alt="dashboard_image" />
        <span className="absolute top-0 left-0 w-full h-0.5 overflow-x-hidden 
  bg-linear-to-r from-transparent via-primary to-transparent
  -translate-y-1/2"></span>

  <span className="absolute top-0 left-0 w-full h-10 bg-linear-to-r from-transparent via-primary/60 to-transparent blur-2xl -translate-y-[90%]"></span>

<span className="absolute top-0 left-0 w-full h-10 bg-linear-to-r from-transparent via-primary/30 to-transparent blur-3xl -translate-y-[90%]"></span>
      </div>
    </div>
  )
}

export default Hero
