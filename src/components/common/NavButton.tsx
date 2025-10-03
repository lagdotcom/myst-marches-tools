import { useCallback, useMemo } from "react";
import { ToggleButton } from "react-aria-components";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  label: string;
  url: string;
}

export function NavButton({ label, url }: Props) {
  const location = useLocation();
  const navigate = useNavigate();

  const isCurrent = useMemo(
    () => location.pathname === url,
    [location.pathname, url],
  );
  const onClick = useCallback(() => navigate(url), [navigate, url]);

  return (
    <ToggleButton isSelected={isCurrent} onClick={onClick}>
      {label}
    </ToggleButton>
  );
}
