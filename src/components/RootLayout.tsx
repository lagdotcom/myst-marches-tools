import { Outlet } from "react-router";

import MainNav from "./MainNav";

export default function RootLayout() {
  return (
    <>
      <MainNav />
      <main>
        <Outlet />
      </main>
    </>
  );
}
