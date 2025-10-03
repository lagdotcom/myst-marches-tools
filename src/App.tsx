import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SWRConfig } from "swr";

import MainNav from "./components/MainNav";
import PCPage from "./components/PCPage";
import SessionPage from "./components/SessionPage";

export default function App() {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        shouldRetryOnError: true,
      }}
    >
      <BrowserRouter>
        <Analytics />
        <MainNav />
        <main>
          <Routes>
            <Route path="/pc" element={<PCPage />} />
            <Route path="/session" element={<SessionPage />} />
            <Route path="*" element={<Navigate to="/pc" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </SWRConfig>
  );
}
