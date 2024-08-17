import React, {
  createContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
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
  userId: string | null;
  fetchDashboardData: () => Promise<void>;
  updateTokens: (
    accessToken: string,
    refreshToken: string,
    userId: string
  ) => void;
  clearTokens: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  forgetPassword: (email: string) => Promise<void>;
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
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load tokens and userId from localStorage on component mount
    const storedAccessToken = localStorage.getItem("access_token");
    const storedRefreshToken = localStorage.getItem("refresh_token");
    const storedUserId = localStorage.getItem("user_id");
    if (storedAccessToken && storedRefreshToken && storedUserId) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setUserId(storedUserId);
    }
  }, []);

  const updateTokens = useCallback(
    (newAccessToken: string, newRefreshToken: string, newUserId: string) => {
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setUserId(newUserId);
      localStorage.setItem("access_token", newAccessToken);
      localStorage.setItem("refresh_token", newRefreshToken);
      localStorage.setItem("user_id", newUserId);
    },
    []
  );

  const clearTokens = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setUserId(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
  }, []);

  const fetchDashboardData = useCallback(async () => {
    const currentAccessToken =
      accessToken || localStorage.getItem("access_token");
    const currentRefreshToken =
      refreshToken || localStorage.getItem("refresh_token");
    const currentUserId = userId || localStorage.getItem("user_id");

    try {
      if (!currentAccessToken || !currentRefreshToken || !currentUserId) {
        throw new Error("Missing authentication information");
      }

      const response = await httpClient.get(
        `/users/dashboard/${currentUserId}`,
        {
          headers: {
            Authorization: `Bearer ${currentAccessToken}`,
            "refresh-token": currentRefreshToken,
          },
        }
      );

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
  }, [accessToken, refreshToken, userId, navigate, clearTokens]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await httpClient.post("/auth/login", {
          email,
          password,
        });
        const newAccessToken = response.data.data.session.access_token;
        const newRefreshToken = response.data.data.session.refresh_token;
        const newUserId = response.data.data.user.id;
        updateTokens(newAccessToken, newRefreshToken, newUserId);
        await fetchDashboardData();
        navigate("/dashboard");
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    [updateTokens, fetchDashboardData, navigate]
  );

  const register = useCallback(
    async (
      firstName: string,
      lastName: string,
      email: string,
      password: string
    ) => {
      try {
        await httpClient.post("/auth/register", {
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        });
      } catch (error) {
        console.error("Registration error:", error);
        throw error;
      }
    },
    []
  );

  const forgetPassword = useCallback(async (email: string) => {
    try {
      await httpClient.post("/auth/forget-password", { email });
    } catch (error) {
      console.error("Forget password error:", error);
      throw error;
    }
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        user,
        terms,
        accessToken,
        refreshToken,
        userId,
        fetchDashboardData,
        updateTokens,
        clearTokens,
        login,
        register,
        forgetPassword,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
