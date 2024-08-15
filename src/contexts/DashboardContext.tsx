import React, { createContext, useState, useCallback, ReactNode } from "react";
import httpClient from "../httpClient.tsx";
import { useNavigate } from "react-router-dom";

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

interface DashboardContextType {
  user: User | null;
  terms: Terms;
  accessToken: string | null;
  refreshToken: string | null;
  fetchDashboardData: () => Promise<void>;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
}

export const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [terms, setTerms] = useState<Terms>({});
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("access_token")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refresh_token")
  );
  const navigate = useNavigate();

  const updateTokens = useCallback(
    (newAccessToken: string, newRefreshToken: string) => {
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      localStorage.setItem("access_token", newAccessToken);
      localStorage.setItem("refresh_token", newRefreshToken);
    },
    []
  );

  const clearTokens = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId || !accessToken || !refreshToken) {
        throw new Error("Missing authentication information");
      }

      const response = await httpClient.get(`/users/dashboard/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "refresh-token": refreshToken,
        },
      });

      if (response.data.data && response.data.data.user) {
        setUser(response.data.data.user);
        setTerms(response.data.data.terms);
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      clearTokens();
      navigate("/");
    }
  }, [accessToken, refreshToken, navigate, clearTokens]);

  return (
    <DashboardContext.Provider
      value={{
        user,
        terms,
        accessToken,
        refreshToken,
        fetchDashboardData,
        updateTokens,
        clearTokens,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
