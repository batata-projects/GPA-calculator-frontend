import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import OverallSection from "../components/OverallSection.tsx";
import TermsSection from "../components/TermsSection.tsx";
import QuerySection from "../components/QuerySection.tsx";
import httpClient from "../httpClient.tsx";
import Sidebar from "../components/Sidebar.tsx";
import Loader from "../components/Loader.tsx";

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

interface RefreshTokenResponse {
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
    };
    session: {
      access_token: string;
      refresh_token: string;
      expires_in: number;
    };
  };
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [terms, setTerms] = useState<Terms>({});
  const [user, setUser] = useState<User | null>(null);
  const user_id = localStorage.getItem("user_id");
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("access_token")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refresh_token")
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isAuthenticated = () => {
    return !!accessToken;
  };

  const refreshAccessToken = async () => {
    try {
      if (!accessToken || !refreshToken) {
        throw new Error("Access token or refresh token is missing");
      }

      const response = await httpClient.post<RefreshTokenResponse>(
        "/auth/refresh",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "refresh-token": refreshToken,
          },
        }
      );

      const { access_token, refresh_token } = response.data.data.session;
      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      return access_token;
    } catch (error) {
      console.error("Error refreshing token:", error);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_id");
      navigate("/");
      throw error;
    }
  };

  const getUserInfo = useCallback(
    async (user_id: string) => {
      try {
        if (!accessToken || !refreshToken) {
          console.error("Access token or refresh token is missing");
          navigate("/");
          return;
        }

        const makeRequest = async (token: string) => {
          return httpClient.get<ApiResponse>(`/users/dashboard/${user_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "refresh-token": refreshToken,
            },
          });
        };

        try {
          const response = await makeRequest(accessToken);
          if (response.data.data && response.data.data.user) {
            setUser(response.data.data.user);
            setTerms(response.data.data.terms);
          } else {
            console.error("Invalid API response format");
            navigate("/");
          }
        } catch (error: any) {
          if (error.response && error.response.status === 401) {
            const newToken = await refreshAccessToken();
            const retryResponse = await makeRequest(newToken);
            if (retryResponse.data.data && retryResponse.data.data.user) {
              setUser(retryResponse.data.data.user);
              setTerms(retryResponse.data.data.terms);
            } else {
              console.error("Invalid API response format after token refresh");
              navigate("/");
            }
          } else {
            throw error;
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        navigate("/");
      }
    },
    [navigate, accessToken, refreshToken]
  );

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (user_id) {
      getUserInfo(user_id);
    } else {
      navigate("/");
    }
  }, [user_id, navigate, getUserInfo]);

  return (
    <div className="font-inter">
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 text-gray-700 hover:text-gray-900 focus:outline-none transition duration-300 ease-in-out transform hover:scale-110"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-7"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>
      <div ref={sidebarRef}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      <div className="flex flex-col items-center">
        <h1 className="text-[50px] font-bold text-center my-8">
          GPA Calculator
        </h1>
        {user ? (
          <>
            <div className="font-inter text-[35px] font-semibold">
              Hello, {user.first_name}
            </div>
            <div className="flex flex-col">
              <OverallSection user={user} />
              <TermsSection
                terms={terms}
                userId={user_id}
                accessToken={accessToken || ""}
                refreshToken={refreshToken || ""}
              />
              <QuerySection
                terms={terms}
                user_id={user_id}
                accessToken={accessToken || ""}
                refreshToken={refreshToken || ""}
              />
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
