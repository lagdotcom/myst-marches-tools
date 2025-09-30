import "./main.scss";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import HomePage from "./components/HomePage.tsx";
import PCPage from "./components/PCPage.tsx";
import RootLayout from "./components/RootLayout.tsx";
import SessionPage from "./components/SessionPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "pc", Component: PCPage },
      { path: "session", Component: SessionPage },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
