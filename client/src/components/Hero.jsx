import React, { useContext } from 'react'
import { MdArrowOutward } from "react-icons/md";
import { RiStarSFill } from "react-icons/ri";
import { RiStarHalfSLine } from "react-icons/ri";
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Dashboard from "../assets/Dashboard.png"

import {motion} from "motion/react"

const Hero = () => {

    const {token} = useContext(AuthContext);
    const navigate = useNavigate();

  return (
    <div className='mt-20 flex flex-col items-center justify-center gap-10 '>
      <div className='flex flex-col items-center justify-center gap-5 '>
        <motion.h1
        initial={{
          opacity : 0, y : 10,
        }}
        animate={{
          opacity : 1, y : 0,
        }}
        transition={{
          duration : 0.8
        }}
        className='text-7xl text-center tracking-wide leading-20'>Take Control of <br /> Your Habits With AI</motion.h1>
      <motion.p 
      initial={{
          opacity : 0, y : 10,
        }}
        animate={{
          opacity : 1, y : 0,
        }}
        transition={{
          duration : 1
        }}
      className='text-lg text-muted-foreground w-130 text-center text-secondary'> Build better habits, write daily journals, and unlock powerful AI insights that help you grow into your most consistent self.</motion.p>
      </div>
      <motion.button 
      initial={{
          opacity : 0, y : 10,
        }}
        animate={{
          opacity : 1, y : 0,
        }}
        transition={{
          duration : 1.2
        }}

      onClick={() => token ? navigate("/dashboard") : navigate("/login")}
      className='px-5 py-3 bg-primary text-black rounded-full flex justify-center items-center gap-1 font-semibold hover:gap-2 cursor-pointer shadow-[0_0_15px_var(--color-primary)] text-sm'>{token ? "Dashboard" : "Get started now"}<MdArrowOutward size={20} /></motion.button>

      <div className='flex flex-col gap-2 mt-10 '>
        <p className='text-sm text-center'>They trust us</p>
        <div className='ratings flex justify-center items-center '>
        {[...Array(4)].map((_, index) => (
            <div key={index}>
                <RiStarSFill />
            </div>
        ))}
        <RiStarHalfSLine />
        <p className='ml-2 '>4.5</p>
      </div>
      </div>

      <motion.div
      initial={{
        rotate : 0
      }}
      whileHover={{
        rotate : -5
      }}
      transition={{
        duration : 0.3
      }}
      className='mt-5 mx-auto relative cursor-pointer'>
        <img className='rounded-xl w-full mx-auto'  src={Dashboard} alt="dashboard_image" />
        <span className="absolute top-0 left-0 w-full h-0.5 overflow-x-hidden 
  bg-linear-to-r from-transparent via-primary to-transparent
  -translate-y-1/2"></span>

  <span className="absolute top-0 left-0 w-full h-10 bg-linear-to-r from-transparent via-primary/60 to-transparent blur-2xl -translate-y-[90%]"></span>

<span className="absolute top-0 left-0 w-full h-10 bg-linear-to-r from-transparent via-primary/30 to-transparent blur-3xl -translate-y-[90%]"></span>
      </motion.div>
    </div>
  )
}

export default Hero
