import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  return (
    <nav className=" sticky">
      <div className=" mx-auto px-4 py-2 flex justify-between items-center">
        <div className=" ">Home</div>
        <div className=" text-xl font-semibold">GPA Calculator</div>
        <button onClick={logout}>Logout</button>
        <div className=" ">Settings</div>
      </div>
    </nav>
  );
};

export default Navbar;
