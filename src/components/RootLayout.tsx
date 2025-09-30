import { Analytics } from "@vercel/analytics/react";
import { Outlet } from "react-router";

import MainNav from "./MainNav";

export default function RootLayout() {
  return (
    <>
      <Analytics />
      <MainNav />
      <main>
        <Outlet />
      </main>
    </>
  );
}
