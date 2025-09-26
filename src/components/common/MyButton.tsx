import classNames from "classnames";
import { Button, type ButtonProps } from "react-aria-components";

export function MyButton({ className, children, ...props }: ButtonProps) {
  return (
    <Button className={classNames("react-aria-Button", className)} {...props}>
      {children}
    </Button>
  );
}
