import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm.tsx";
import RegisterForm from "../components/RegisterForm.tsx";
import httpClient from "../httpClient.tsx";
import { motion, AnimatePresence } from "framer-motion";

const LandingPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const handleLogin = async (formData: { email: string; password: string }) => {
    try {
      const response = await httpClient.post("/auth/login", formData);

      const access_token = response.data.data.session.access_token;
      const refresh_token = response.data.data.session.refresh_token;

      const user = response.data.data.user;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      navigate("/dashboard", { state: { user } });
    } catch (error: any) {
      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 400) {
          setError(error.response.data.detail);
        } else if (error.response.status === 422) {
          setError(error.response.data.detail[0].msg);
        } else {
          setError("An error occurred. Please try again.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response from the server. Please try again.");
      } else {
        // Something else happened in making the request
        setError("An error occurred. Please try again.");
      }
    }
  };

  const handleRegister = async (formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await httpClient.post("/auth/register", formData);

      const access_token = response.data["session"]["access_token"];
      const refresh_token = response.data["session"]["refresh_token"];

      console.log(access_token);
      console.log(refresh_token);
      navigate("/");
    } catch (error: any) {
      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 400) {
          setError(error.response.data.detail);
        } else if (error.response.status === 422) {
          setError(error.response.data.detail[0].msg);
        } else {
          setError("An error occurred. Please try again.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response from the server. Please try again.");
      } else {
        // Something else happened in making the request
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row font-poppins">
      {/* Left side of the landing page */}
      <div className="lg:w-7/12 w-full min-h-screen bg-gradient-to-b from-[#0575E6] to-[#021B79] relative">
        <div className="w-full h-full flex flex-col items-center justify-center py-8 lg:py-0 relative z-10">
          <div className="w-4/5 max-w-2xl">
            <div className="text-white font-poppins text-4xl lg:text-5xl font-bold text-shadow-lg mb-4">
              GPA Calculator
            </div>
            <div className="text-white font-poppins text-lg lg:text-xl font-medium mb-8 text-shadow-default">
              We are here to help you calculate your grades
            </div>
            <button className="bg-blue-500 text-white font-poppins text-base font-normal px-8 py-3 rounded-full shadow-lg hover:bg-blue-400 transition duration-300">
              Read More
            </button>
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
        <div className="w-[70%] max-w-md relative mt-[140px]">
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
