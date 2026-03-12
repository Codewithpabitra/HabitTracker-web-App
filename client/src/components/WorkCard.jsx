import React from 'react'


const WorkCard = ({title, desc , icon}) => {
  return (
    <div className='flex flex-col gap-2 w-80 h-40 p-5 relative overflow-hidden'>
      <div>
        {icon}
      </div>
      <h4 className='text-lg text-primary'>{title}</h4>
      <p className='text-sm'>{desc}</p>
      <div className='h-10 w-20 bg-primary rounded-full blur-2xl absolute -bottom-2 left-1/2'></div>
    </div>
  )
}

export default WorkCard
