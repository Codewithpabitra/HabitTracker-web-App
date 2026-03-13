import React from 'react'
import {motion} from "motion/react"

const WorkCard = ({key, title, desc , icon}) => {
  return (
    <motion.div 
    initial={{
      y : 10,
      opacity : 0
    }}
    whileInView={{
      y : 0,
      opacity : 1
    }}
    viewport={{once : true, amount : 0.5}}
    transition={{
      delay : key * 1.2,
      duration : 0.6
    }}
    className='flex flex-col gap-2 w-80 h-40 p-5 relative overflow-hidden'>
      <div>
        {icon}
      </div>
      <h4 className='text-lg text-primary'>{title}</h4>
      <p className='text-sm'>{desc}</p>
      <div className='h-10 w-20 bg-primary rounded-full blur-2xl absolute -bottom-2 left-1/2'></div>
    </motion.div>
  )
}

export default WorkCard
