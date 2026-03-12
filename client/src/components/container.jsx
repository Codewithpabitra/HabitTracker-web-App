import React from 'react'

const Container = ({ children }) => {
  return (
    <div className="sm:max-w-5xl mx-auto relative px-3 sm:px-5 pt-7 ">
      {children}

      {/* <div className="w-100 h-100 bg-green-700 blur-2xl absolute -top-70 left-1/2 -translate-x-1/2 rounded-full opacity-50 animate-pulse z-0"></div> */}
    </div>
  )
}

export default Container