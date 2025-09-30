import { NavLink } from "react-router";

export default function MainNav() {
  return (
    <nav>
      <NavLink to="/pc">PCs</NavLink>
      <NavLink to="/session">Sessions</NavLink>
    </nav>
  );
}
