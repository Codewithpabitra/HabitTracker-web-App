import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {

    const {token} = useContext(AuthContext);
    const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center ">
      <div className="flex justify-center items-center gap-10 ">
        <div className="logo text-primary text-xl font-semibold ">
          HabitMind
        </div>
        <div className="options flex justify-center items-center gap-5 text-secondary">
          <Link className="hover:text-white transition-colors duration-200">Features</Link>
          <Link className="hover:text-white transition-colors duration-200">AI</Link>
          <Link className="hover:text-white transition-colors duration-200">How It Works</Link>
        </div>
      </div>
      <div className="button">
        <button
        onClick={() => token ? navigate("/dashboard") : navigate("/login")}
          className="px-5 py-2 bg-primary text-black rounded-full font-medium cursor-pointer
shadow-[0_0_15px_var(--color-primary)]
transition-all duration-300 text-sm" 
        >
          Explore Now
        </button>
      </div>
    </div>
  );
};

export default Navbar;
