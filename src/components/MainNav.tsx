import { ToggleButton } from "react-aria-components";

import type { AppPage } from "../routes";

interface Props {
  page: AppPage;
  navigate(page: AppPage): void;
}

export default function MainNav({ page, navigate }: Props) {
  return (
    <nav>
      <ToggleButton isSelected={page === "pc"} onChange={() => navigate("pc")}>
        PCs
      </ToggleButton>
      <ToggleButton
        isSelected={page === "session"}
        onChange={() => navigate("session")}
      >
        Sessions
      </ToggleButton>
    </nav>
  );
}
