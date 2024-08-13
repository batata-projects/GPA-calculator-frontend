import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import OverallSection from "../components/OverallSection.tsx";
import TermsSection from "../components/TermsSection.tsx";
import QuerySection from "../components/QuerySection.tsx";
import httpClient from "../httpClient.tsx";
import Sidebar from "../components/Sidebar.tsx";
import Loader from "../components/Loader.tsx";
import GradingScaleButton from "../components/GradeScale.tsx";

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
  const [showToTop, setShowToTop] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isButtonLeaving, setIsButtonLeaving] = useState(false);

  const isAuthenticated = useCallback(() => {
    return !!accessToken;
  }, [accessToken]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      if (scrollPosition > 100 && !showToTop) {
        setShowToTop(true);
        setIsButtonLeaving(false);
      } else if (scrollPosition <= 100 && showToTop) {
        setIsButtonLeaving(true);
        setTimeout(() => setShowToTop(false), 300);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showToTop]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const refreshAccessToken = useCallback(async (): Promise<string> => {
    try {
      if (!refreshToken) {
        throw new Error("Refresh token is missing");
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
  }, [accessToken, refreshToken, navigate]);

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
    [navigate, accessToken, refreshToken, refreshAccessToken]
  );

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

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
    <div className="font-inter mx-auto px-4 sm:px-6 lg:px-8">
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
          className="w-6 h-6"
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
        <div className="relative w-full flex flex-col items-center mt-6 mb-8">
          <h1 className="text-4xl font-bold text-center">GPA Calculator</h1>
          <div className="absolute top-0 right-0">
            <GradingScaleButton />
          </div>
        </div>
        {user ? (
          <>
            <div className="text-2xl font-semibold mb-4">
              Hello, {user.first_name}
            </div>
            <div className="w-full max-w-4xl">
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

            <div
              id="additional-info"
              className="mt-16 pb-16 flex flex-col items-center text-center"
            >
              <div className="max-w-2xl">
                <h2 className="text-2xl font-semibold mb-4">
                  Additional Information
                </h2>
                <p className="mb-4">
                  This GPA Calculator helps you track your academic progress and
                  plan for future terms. Remember that your GPA is just one
                  aspect of your academic journey. Keep striving for knowledge
                  and personal growth!
                </p>
                <p className="mb-4">
                  If you have any questions or need assistance with using this
                  calculator, please don't hesitate to contact our support team
                  at support@gpacalculator.com.
                </p>
                <p className="mb-8">
                  Thank you for using our GPA Calculator. We wish you the best
                  in your academic endeavors!
                </p>
              </div>
              {/* Horizontal line */}
              <hr className="border-t border-gray-300 my-8 w-full max-w-2xl" />
              <p className="text-sm text-gray-500">
                © 2024 GPA Calculator. All rights reserved.
              </p>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        )}
      </div>
      {showToTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 p-2 bg-[#055AC5] text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 ease-in-out z-50 ${
            isButtonLeaving ? "animate-slide-down" : "animate-slide-up"
          }`}
          aria-label="Scroll to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.53 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v5.69a.75.75 0 0 0 1.5 0v-5.69l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default DashboardPage;
