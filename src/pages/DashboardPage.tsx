import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar.tsx";
import OverallSection from "../components/OverallSection.tsx";
import TermsSection from "../components/TermsSection.tsx";
import QuerySection from "../components/QuerySection.tsx";
import httpClient from "../httpClient.tsx";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  credits: number;
  grade: number;
  gpa: number;
}

interface Terms {
  [key: string]: Course[];
}

interface Course {
  name: string;
}

interface ApiResponse {
  status: number;
  message: string;
  data: {
    user: User;
    terms: Terms;
  };
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [terms, setTerms] = useState<Terms>({});
  const [user, setUser] = useState<User | null>(null);
  const user_id = localStorage.getItem("user_id");

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

  const getUserInfo = useCallback(
    async (user_id: string) => {
      try {
        const access_token = localStorage.getItem("access_token");
        const refresh_token = localStorage.getItem("refresh_token");

        if (!access_token || !refresh_token) {
          // Handle the case when tokens are missing
          console.error("Access token or refresh token is missing");
          navigate("/login");
          return;
        }

        const response = await httpClient.get<ApiResponse>(
          `/users/dashboard/${user_id}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "refresh-token": refresh_token,
            },
          }
        );

        if (response.data.data && response.data.data.user) {
          setUser(response.data.data.user);
          setTerms(response.data.data.terms);
        } else {
          console.error("Invalid API response format");
          // Handle the case when the response format is unexpected
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        // Handle error, show error message, etc.
        navigate("/");
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (user_id) {
      getUserInfo(user_id);
    } else {
      navigate("/");
    }
  }, [user_id, navigate, getUserInfo]);

  if (!user) {
    return <div className="">Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      {user.first_name}
      <div className=" flex flex-col justify-center items-center flex-shrink flex-grow">
        <OverallSection />
        <TermsSection />
        <QuerySection />
      </div>
    </div>
  );
};

export default DashboardPage;
