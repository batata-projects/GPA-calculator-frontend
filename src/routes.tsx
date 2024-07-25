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

function Routes(): JSX.Element {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");
    setIsAuthenticated(!!access_token && !!refresh_token);

    const getPageTitle = () => {
      switch (location.pathname) {
        case "/":
          return "Login - GPA Calculator";
        case "/dashboard":
          return "Dashboard - GPA Calculator";
        default:
          return "Not Found";
      }
    };
    document.title = getPageTitle();
  }, [location]);

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
    </ReactRouterRoutes>
  );
}

export default Routes;
