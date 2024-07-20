import React, { useEffect } from "react";
import {
  Routes as ReactRouterRoutes,
  Route,
  useLocation,
} from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import LandingPage from "./pages/LandingPage.tsx";

function Routes(): JSX.Element {
  const location = useLocation();

  useEffect(() => {
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
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </ReactRouterRoutes>
  );
}

export default Routes;
