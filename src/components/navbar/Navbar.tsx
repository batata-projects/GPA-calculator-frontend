import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className=" sticky">
      <div className=" container mx-auto px-4 py-2 flex justify-between items-center">
        <div>Home</div>
        <div className=" text-xl font-semibold">GPA Calculator</div>
        <div>Settings</div>
      </div>
    </nav>
  );
};

export default Navbar;
