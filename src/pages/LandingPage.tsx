import React, { useState, useEffect } from "react";
import LoginForm from "../components/landing-page/LoginForm.tsx";
import RegisterForm from "../components/landing-page/RegisterForm.tsx";
import { motion, AnimatePresence } from "framer-motion";
import ReadMore from "../components/landing-page/ReadMore.tsx";
import { useDashboard } from "../hooks/useDashboard.ts";

const LandingPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { login, register } = useDashboard();

  useEffect(() => {
    document.title = isLogin
      ? "Login - GPA Calculator"
      : "Register - GPA Calculator";
  }, [isLogin]);

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const handleError = (error: any) => {
    if (error.response) {
      if (error.response.status === 400) {
        setError(error.response.data.detail);
      } else if (error.response.status === 422) {
        setError(error.response.data.detail[0].msg);
      } else {
        setError("An error occurred. Please try again.");
      }
    } else if (error.request) {
      setError("No response from the server. Please try again.");
    } else {
      setError("An error occurred. Please try again.");
    }
  };

  const handleLogin = async (formData: {
    email: string;
    password: string;
  }): Promise<void> => {
    try {
      await login(formData.email, formData.password);
    } catch (error: any) {
      handleError(error);
    }
  };

  const handleRegister = async (formData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }): Promise<void> => {
    try {
      await register(
        formData.first_name,
        formData.last_name,
        formData.email,
        formData.password
      );
      setIsLogin(true);
    } catch (error: any) {
      handleError(error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row font-poppins">
      {/* Left side of the landing page */}
      <div className="lg:w-7/12 w-full min-h-full bg-gradient-to-b from-[#0575E6] to-[#021B79] relative">
        <div className="w-full h-full flex flex-col items-center justify-center py-8 lg:py-0 relative z-10">
          <div className="w-4/5 max-w-2xl">
            <div className="text-white font-poppins text-3xl lg:text-4xl font-bold text-shadow-lg mb-4">
              GPA Calculator
            </div>
            <div className="text-white font-poppins text-base lg:text-lg font-medium mb-6 text-shadow-default">
              We are here to help you calculate your grades
            </div>
            <ReadMore summaryPath="/landing-page/websitesummary.md" />
          </div>
        </div>
        <div className="absolute inset-0 z-0 overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
            className="absolute bottom-0 left-0 w-64 h-64 text-blue-400 opacity-50"
          >
            <path
              d="M 50,50 A 100,100 0 0 1 50,250 A 100,100 0 0 1 50,50 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M 0 40 A 100 100 0 0 1 68 222 A 100 100 0 0 1 0 40 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>

      {/* Right side of the landing page */}
      <div className="lg:w-5/12 w-full flex min-h-screen justify-center">
        <div className="w-[80%] max-w-md relative mt-[120px]">
          <AnimatePresence>
            {isLogin ? (
              // login
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <LoginForm onSubmit={handleLogin} error={error} />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="text-center mt-2">
                  <div className="mb-2 cursor-pointer underline">
                    Forget Password?
                  </div>
                  <div className="text-xs mb-2">
                    If you just made an account, make sure you verify it using
                    your email before logging in for the first time.
                  </div>
                  <div className="text-sm text-gray-400 mb-1">
                    Don't have an account?
                  </div>
                  <button
                    onClick={handleToggleForm}
                    className="text-blue-400 hover:cursor-pointer underline transition duration-300 mb-3"
                  >
                    Register
                  </button>
                </div>
              </motion.div>
            ) : (
              // register
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <div className=" flex flex-shrink flex-col">
                  <RegisterForm onSubmit={handleRegister} error={error} />
                  {error && <p className="text-red-500 text-xs">{error}</p>}
                  <div className="text-center mt-2">
                    <div className="text-sm mb-2">
                      Please verify your account after registering to be able to
                      login.
                    </div>
                    <div className="text-sm text-gray-400 mb-1">
                      Have an Account?
                    </div>
                    <button
                      onClick={handleToggleForm}
                      className="text-blue-400 hover:cursor-pointer underline transition duration-300 mb-3"
                    >
                      Login
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
