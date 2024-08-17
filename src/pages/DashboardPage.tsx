import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import OverallSection from "../components/OverallSection.tsx";
import TermsSection from "../components/TermsSection.tsx";
import QuerySection from "../components/QuerySection.tsx";
import Sidebar from "../components/Sidebar.tsx";
import Loader from "../components/Loader.tsx";
import { useDashboard } from "../hooks/useDashboard.ts";

const DashboardPage: React.FC = () => {
  const { user, fetchDashboardData, accessToken, refreshToken } =
    useDashboard();
  const navigate = useNavigate();
  const [showToTop, setShowToTop] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isButtonLeaving, setIsButtonLeaving] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!accessToken || !refreshToken) {
      navigate("/");
    } else {
      fetchDashboardData();
    }
  }, [fetchDashboardData, accessToken, refreshToken, navigate]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

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

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

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
        <div className="font-inter text-[35px] font-semibold">
          Hello, {user.first_name}
        </div>
        <div className="flex flex-col">
          <OverallSection />
          <TermsSection />
          <QuerySection />
        </div>
      </div>
      {showToTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-10 right-10 p-3 bg-[#055AC5] text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 ease-in-out z-50 ${
            isButtonLeaving ? "animate-slide-down" : "animate-slide-up"
          }`}
          aria-label="Scroll to top"
          style={{ zIndex: 9999 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-10 h-10"
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
