import React, { useEffect, useState } from "react";
import {
  Routes as ReactRouterRoutes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import SettingsPage from "./pages/Settings.tsx";

function Routes(): JSX.Element {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");
    const user_id = localStorage.getItem("user_id");
    setIsAuthenticated(!!access_token && !!refresh_token && !!user_id);

    const getPageTitle = () => {
      switch (location.pathname) {
        case "/":
          return "Login - GPA Calculator";
        case "/dashboard":
          return "Dashboard - GPA Calculator";
        case "/settings":
          return "Settings - GPA Calculator";
        default:
          return "Not Found";
      }
    };
    document.title = getPageTitle();
  }, [location, isAuthenticated]);

  return (
    <ReactRouterRoutes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />
        }
      />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <DashboardPage /> : <Navigate to="/" />}
      />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </ReactRouterRoutes>
  );
}

export default Routes;
