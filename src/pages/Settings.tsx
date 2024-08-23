import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResetPasswordForm from "../components/SettingsComponents/ResetPasswordForm.tsx";

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("password");
  const navigate = useNavigate();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => handleTabChange("password")}
                  className={`${
                    activeTab === "password"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                >
                  Password
                </button>
                {/* Add more tabs here as needed */}
                <button
                  onClick={() => handleTabChange("profile")}
                  className={`${
                    activeTab === "profile"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                >
                  Profile
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "password" && <ResetPasswordForm />}
              {activeTab === "profile" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Profile Settings
                  </h2>
                  <p>Profile settings content goes here.</p>
                  {/* Add profile settings form or content here */}
                </div>
              )}
              {/* Add more tab content sections as needed */}
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
