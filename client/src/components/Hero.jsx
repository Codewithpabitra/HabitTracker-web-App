import React, { useContext } from 'react'
import { MdArrowOutward } from "react-icons/md";
import { RiStarSFill, RiStarHalfSLine } from "react-icons/ri";
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Dashboard from "../assets/Dashboard.png";
import { motion } from "motion/react";

const Hero = () => {
  const { token } = useContext(AuthContext);
  const navigate  = useNavigate();

  return (
    <div className="mt-16 sm:mt-20 flex flex-col items-center justify-center gap-8 sm:gap-10 px-4 sm:px-6">

      {/* Heading + subtext */}
      <div className="flex flex-col items-center justify-center gap-4 sm:gap-5 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center tracking-wide leading-tight sm:leading-tight"
        >
          Take Control of <br className="hidden sm:block" /> Your Habits With AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-sm sm:text-base lg:text-lg text-center text-secondary max-w-xs sm:max-w-md lg:max-w-lg"
        >
          Build better habits, write daily journals, and unlock powerful AI insights
          that help you grow into your most consistent self.
        </motion.p>
      </div>

      {/* CTA button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => token ? navigate("/dashboard") : navigate("/login")}
        className="px-6 py-3 bg-primary text-black rounded-full flex items-center gap-1.5 font-semibold hover:gap-2.5 cursor-pointer shadow-[0_0_15px_var(--color-primary)] text-sm transition-all duration-200"
      >
        {token ? "Dashboard" : "Get started now"}
        <MdArrowOutward size={18} />
      </motion.button>

      {/* Ratings */}
      <div className="flex flex-col gap-1.5 items-center mt-2 sm:mt-4">
        <p className="text-xs sm:text-sm text-center text-secondary">They trust us</p>
        <div className="flex items-center gap-0.5">
          {[...Array(4)].map((_, i) => <RiStarSFill key={i} className="text-primary text-base sm:text-lg" />)}
          <RiStarHalfSLine className="text-primary text-base sm:text-lg" />
          <p className="ml-1.5 text-sm font-medium">4.5</p>
        </div>
      </div>

      {/* Dashboard image */}
      <motion.div
        initial={{ rotate: 0 }}
        whileHover={{ rotate: -3 }}
        transition={{ duration: 0.3 }}
        className="mt-4 sm:mt-6 w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto relative cursor-pointer px-2 sm:px-0"
      >
        <img
          className="rounded-xl w-full mx-auto shadow-2xl"
          src={Dashboard}
          alt="dashboard_image"
        />

        {/* glow lines */}
        <span className="absolute top-0 left-0 w-full h-0.5 overflow-x-hidden bg-linear-to-r from-transparent via-primary to-transparent -translate-y-1/2" />
        <span className="absolute top-0 left-0 w-full h-10 bg-linear-to-r from-transparent via-primary/60 to-transparent blur-2xl -translate-y-[90%]" />
        <span className="absolute top-0 left-0 w-full h-10 bg-linear-to-r from-transparent via-primary/30 to-transparent blur-3xl -translate-y-[90%]" />
      </motion.div>

    </div>
  );
};

export default Hero;