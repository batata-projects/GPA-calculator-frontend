import React, {
  createContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import httpClient from "../httpClient.tsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
  isLoading: boolean;
  error: string | null;
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
  requestOTP: (email: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  clearError: () => void;
  resetPassword: (newPassword: string) => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      clearTokens();
      navigate("/");
    }
  }, [accessToken, refreshToken, userId, navigate, clearTokens]);

  const handleError = useCallback((error: any) => {
    if (error.response) {
      if (error.response.status === 400) {
        setError(error.response.data.detail);
      } else if (error.response.status === 422) {
        setError(error.response.data.detail[0].msg);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } else if (error.request) {
      setError(
        "No response from the server. Please check your connection and try again."
      );
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

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
      } catch (error: any) {
        clearError();
        handleError(error);
      }
    },
    [updateTokens, fetchDashboardData, navigate, handleError, clearError]
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
      } catch (error: any) {
        clearError();
        handleError(error);
      }
    },
    [handleError, clearError]
  );

  const requestOTP = useCallback(
    async (email: string) => {
      setIsLoading(true);
      clearError();
      try {
        await httpClient.post("/auth/request-otp", { email });
      } catch (error: any) {
        handleError(error); // Set the error state if there's an error
      } finally {
        setIsLoading(false);
      }
    },
    [clearError, handleError]
  );

  const verifyOTP = useCallback(
    async (email: string, otp: string) => {
      setIsLoading(true);
      clearError();
      try {
        const response = await httpClient.post("/auth/verify-otp", {
          email,
          otp,
        });

        if (response.data && response.data.data) {
          const { user, session } = response.data.data;

          if (user && session) {
            const { id: newUserId } = user;
            const {
              access_token: newAccessToken,
              refresh_token: newRefreshToken,
            } = session;

            // Update tokens and user ID
            updateTokens(newAccessToken, newRefreshToken, newUserId);

            // Set user data
            setUser(user);

            // Fetch dashboard data
            await fetchDashboardData();

            // Navigate to dashboard
            navigate("/dashboard");
          } else {
            throw new Error("Invalid response structure from OTP verification");
          }
        } else {
          throw new Error("Invalid response structure from OTP verification");
        }
      } catch (error: any) {
        clearError();
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [clearError, handleError, updateTokens, fetchDashboardData, navigate]
  );

  const resetPassword = useCallback(
    async (newPassword: string) => {
      setIsLoading(true);
      clearError();
      try {
        const currentAccessToken =
          accessToken || localStorage.getItem("access_token");
        const currentRefreshToken =
          refreshToken || localStorage.getItem("refresh_token");

        if (!currentAccessToken || !currentRefreshToken) {
          throw new Error("Missing authentication information");
        }

        await httpClient.post(
          "/auth/reset-password",
          { password: newPassword }, // Make sure this matches your API expectation
          {
            headers: {
              Authorization: `Bearer ${currentAccessToken}`,
              "refresh-token": currentRefreshToken,
            },
          }
        );
      } catch (error: any) {
        clearError();
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken, refreshToken, clearError, handleError]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((error: any) => {
    if (error.response) {
      if (error.response.status === 400 || error.response.status === 422) {
        setError(error.response.data.detail);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } else if (error.request) {
      setError(
        "No response from the server. Please check your connection and try again."
      );
    } else {
      setError("An unexpected error occurred. Please try again.");
    }
    console.error("Error:", error);
  }, []);

  const requestOTP = useCallback(
    async (email: string) => {
      setIsLoading(true);
      clearError();
      try {
        await httpClient.post("/auth/request-otp", { email });
      } catch (error) {
        handleError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [clearError, handleError]
  );

  const verifyOTP = useCallback(
    async (email: string, otp: string) => {
      setIsLoading(true);
      clearError();
      try {
        const response = await httpClient.post("/auth/verify-otp", {
          email,
          otp,
        });

        if (response.data && response.data.data) {
          const { user, session } = response.data.data;

          if (user && session) {
            const { id: newUserId } = user;
            const {
              access_token: newAccessToken,
              refresh_token: newRefreshToken,
            } = session;

            // Update tokens and user ID
            updateTokens(newAccessToken, newRefreshToken, newUserId);

            // Set user data
            setUser(user);

            // Fetch dashboard data
            await fetchDashboardData();

            // Navigate to dashboard
            navigate("/dashboard");
          } else {
            throw new Error("Invalid response structure from OTP verification");
          }
        } else {
          throw new Error("Invalid response structure from OTP verification");
        }
      } catch (error) {
        handleError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [clearError, handleError, updateTokens, fetchDashboardData, navigate]
  );

  const resetPassword = useCallback(
    async (newPassword: string) => {
      setIsLoading(true);
      clearError();
      try {
        const currentAccessToken =
          accessToken || localStorage.getItem("access_token");
        const currentRefreshToken =
          refreshToken || localStorage.getItem("refresh_token");

        if (!currentAccessToken || !currentRefreshToken) {
          throw new Error("Missing authentication information");
        }

        const response = await httpClient.post(
          "/auth/reset-password",
          { password: newPassword }, // Make sure this matches your API expectation
          {
            headers: {
              Authorization: `Bearer ${currentAccessToken}`,
              "refresh-token": currentRefreshToken,
            },
          }
        );

        console.log("Password reset successful", response);
        // You might want to handle successful reset here (e.g., show a success message)
      } catch (error) {
        let errorMessage = "An unexpected error occurred. Please try again.";

        if (axios.isAxiosError(error)) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (
              typeof error.response.data === "object" &&
              error.response.data !== null
            ) {
              if (
                "detail" in error.response.data &&
                typeof error.response.data.detail === "string"
              ) {
                errorMessage = error.response.data.detail;
              } else {
                errorMessage = JSON.stringify(error.response.data);
              }
            } else {
              errorMessage = `An error occurred: ${error.response.status}`;
            }
          } else if (error.request) {
            // The request was made but no response was received
            errorMessage =
              "No response from the server. Please try again later.";
          } else {
            // Something happened in setting up the request that triggered an Error
            errorMessage = `Error: ${error.message}`;
          }
        }

        setError(errorMessage);
        console.error("Failed to reset password", error);
        throw error; // Re-throw the error so the component can handle it if needed
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken, refreshToken, clearError]
  );

  return (
    <DashboardContext.Provider
      value={{
        user,
        terms,
        accessToken,
        refreshToken,
        userId,
        isLoading,
        error,
        fetchDashboardData,
        updateTokens,
        clearTokens,
        login,
        register,
        requestOTP,
        verifyOTP,
        clearError,
        resetPassword,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
