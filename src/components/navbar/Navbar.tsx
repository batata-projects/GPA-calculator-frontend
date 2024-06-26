import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-scroll";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  const handleSettings = () => {
    navigate("/dashboard");
  };

  return (
    <nav className="sticky">
      <div className="mx-auto px-4 py-2 grid grid-cols-3 items-center font-inter">
        <div className="flex items-center">
          <Link
            to="overall"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}
            className="cursor-pointer text-[18px]"
          >
            Home
          </Link>
        </div>
        <div className="text-[45px] font-in text-center">GPA Calculator</div>
        <div className="flex items-center justify-end">
          <button onClick={handleSettings} className="mr-4">
            Settings
          </button>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 w-px bg-gray-300"></div>
            <button onClick={logout} className="ml-4">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
