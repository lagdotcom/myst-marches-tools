import { NavButton } from "./common/NavButton";

export default function MainNav() {
  return (
    <nav>
      <NavButton label="PCs" url="/pc" />
      <NavButton label="Sessions" url="/session" />
    </nav>
  );
}
