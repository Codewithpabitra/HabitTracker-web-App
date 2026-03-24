import React from 'react';
import { motion } from 'motion/react';
import { Compass } from 'lucide-react';
import Logo from "../assets/Logo.png"



export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-12 h-12  mb-3"
          >
            <img className="w-10 h-10" src={Logo}/>
          </motion.div>
          <h1 className="text-2xl text-white font-bold tracking-tight mb-2 font-serif italic">{title}</h1>
          <p className="text-white/50 font-light text-sm ">{subtitle}</p>
        </div>

        <div className="glass rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
          {children}
        </div>
      </motion.div>
    </div>
  );
}