import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { DashboardProvider } from "./contexts/DashboardContext.tsx";
import Routes from "./routes.tsx";
import "../src/styles/index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Router>
      <DashboardProvider>
        <Routes />
      </DashboardProvider>
    </Router>
  </React.StrictMode>
);
