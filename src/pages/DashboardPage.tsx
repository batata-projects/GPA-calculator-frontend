import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  const isAuthenticated = () => {
    const access_token = localStorage.getItem("access_token");
    return !!access_token;
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  // const fetchUserData = () => {
  //   try {
  //     const access_token = localStorage.getItem('access_token')
  //     const response = httpClient.get('/')

  //   } catch
  // };

  return <div>{user.username}</div>;
};

export default DashboardPage;
