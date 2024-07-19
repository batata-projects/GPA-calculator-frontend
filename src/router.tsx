import React from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes.tsx";

function Router(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
}

export default Router;
