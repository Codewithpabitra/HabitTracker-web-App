import { useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [token , setToken] = useState(localStorage.getItem("token") || null);;

 const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{user, token,setToken, logout}}>
      {children}
    </AuthContext.Provider>
  );
};
