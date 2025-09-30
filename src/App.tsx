import { Analytics } from "@vercel/analytics/react";
import { type ComponentType, useState } from "react";

import MainNav from "./components/MainNav";
import PCPage from "./components/PCPage";
import SessionPage from "./components/SessionPage";
import type { AppPage } from "./routes";

const pages: Record<AppPage, ComponentType> = {
  pc: PCPage,
  session: SessionPage,
};

export default function App() {
  const [page, setPage] = useState<AppPage>("pc");
  const Page = pages[page];

  return (
    <>
      <Analytics />
      <MainNav page={page} navigate={setPage} />
      <main>
        <Page />
      </main>
    </>
  );
}
