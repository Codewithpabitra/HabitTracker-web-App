import React from 'react'
import { motion } from "motion/react"
import { GoPlus } from "react-icons/go";

const InsightCard = ({ title, icon }) => {
  return (
    <motion.div
      className="w-64 sm:w-72 cursor-pointer bg-linear-to-b from-zinc-800 to-transparent rounded-xl flex flex-col gap-5 p-5 sm:p-7 border border-zinc-700"
      whileHover="hovered"
    >
      <div className="w-full flex items-center justify-center h-40 sm:h-48">
        <div className="relative w-28 h-28 sm:w-36 sm:h-36">
          <motion.div
            className="w-full h-full bg-primary/30 border border-primary rounded-xl absolute inset-0 rotate-10"
            variants={{ hovered: { rotate: 5 } }}
          />
          <motion.div
            className="w-full h-full bg-zinc-900 rounded-xl absolute inset-0 flex justify-center items-center"
            variants={{ hovered: { rotate: 3 } }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <div className="bg-primary/50 w-fit p-3 rounded-lg flex justify-center items-center">
              {icon}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm sm:text-base font-medium">{title}</p>
        <div className="w-9 h-9 bg-zinc-800 rounded-full flex justify-center items-center shrink-0">
          <GoPlus size={16} />
        </div>
      </div>
    </motion.div>
  );
};

export default InsightCard;