import React from 'react'
import { motion } from "motion/react"

const Footer = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-between items-start gap-10 sm:gap-6 h-auto py-10 mt-20 px-4 sm:px-6 border-t border-zinc-800 overflow-x-hidden relative'>
      <div className='h-px w-full bg-linear-to-r from-transparent via-primary to-transparent absolute top-0 left-0' />

      {/* Brand + copyright */}
      <div className='flex flex-col justify-between items-start gap-6'>
        <div className='flex flex-col gap-3'>
          <motion.h1
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className='text-xl font-semibold text-primary'
          >
            HabitMind
          </motion.h1>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className='max-w-xs leading-relaxed text-sm text-zinc-400'
          >
            Simple, insightful, and seamless habit tracking. HabitMind makes your habits to be happen.
          </motion.p>
        </div>
        <div className='mt-2'>
          <p className='text-xs text-zinc-500'>Created with curiocity :)</p>
          <p className='text-xs text-zinc-500'>&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>

      {/* Links */}
      <div className='flex justify-start items-start gap-10 sm:gap-16'>
        <ul className='text-sm flex flex-col gap-3'>
          <li className='text-white font-medium'>Navigation</li>
          <li className='text-neutral-400 hover:text-neutral-100 cursor-pointer transition-all duration-200'>Why HabitMind?</li>
          <li className='text-neutral-400 hover:text-neutral-100 cursor-pointer transition-all duration-200'>Features</li>
          <li className='text-neutral-400 hover:text-neutral-100 cursor-pointer transition-all duration-200'>How it works</li>
          <li className='text-neutral-400 hover:text-neutral-100 cursor-pointer transition-all duration-200'>Benefits</li>
        </ul>

        <ul className='text-sm flex flex-col gap-3'>
          <li className='text-white font-medium'>Socials</li>
          <li className='text-neutral-400 hover:text-neutral-100 cursor-pointer transition-all duration-200'>Twitter (X)</li>
          <li className='text-neutral-400 hover:text-neutral-100 cursor-pointer transition-all duration-200'>Instagram</li>
          <li className='text-neutral-400 hover:text-neutral-100 cursor-pointer transition-all duration-200'>LinkedIn</li>
          <li className='text-neutral-400 hover:text-neutral-100 cursor-pointer transition-all duration-200'>Github</li>
        </ul>
      </div>
    </div>
  )
}

export default Footer