import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar.tsx";
import Overall from "../components/Overall.tsx";
import Terms from "../components/Terms.tsx";
import Query from "../components/Query.tsx";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  const isAuthenticated = () => {
    const access_token = localStorage.getItem("access_token");
    console.log(!!access_token);
    return !!access_token;
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  return (
    <div>
      <Navbar />
      {user.username}
      <button onClick={logout}>Logout</button>
      <div className=" flex flex-col justify-center items-center">
        <Overall />
        <Terms />
        <Query />
      </div>
    </div>
  );
};

export default DashboardPage;
