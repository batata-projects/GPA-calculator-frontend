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
  [key: string]: {
    name: string;
    gpa: number;
    credits: number;
    courses: {
      [key: string]: {
        id: string;
        subject: string;
        course_code: string;
        term: number;
        credits: number;
        grade: number;
        graded: boolean;
      };
    };
  };
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
  const access_token = localStorage.getItem("access_token");
  const refresh_token = localStorage.getItem("refresh_token");

  const isAuthenticated = () => {
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
        if (!access_token || !refresh_token) {
          // Handle the case when tokens are missing
          console.error("Access token or refresh token is missing");
          navigate("/");
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
        console.log(response);

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
    [navigate, access_token, refresh_token]
  );

  useEffect(() => {
    if (user_id) {
      getUserInfo(user_id);
    } else {
      navigate("/");
    }
  }, [user_id, navigate, getUserInfo]);

  return (
    <div className="font-inter">
      <Navbar />
      <div className="flex flex-col items-center">
        {user ? (
          <>
            <div className="font-inter text-[25px]">
              Hello, {user.first_name}
            </div>
            <div className="flex flex-col">
              <OverallSection user={user} />
              <TermsSection
                terms={terms}
                userId={user_id}
                accessToken={access_token || ""}
                refreshToken={refresh_token || ""}
              />
              <QuerySection termsData={Object.values(terms)} />

            </div>
          </>
        ) : (
          <div className="">Loading...</div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
