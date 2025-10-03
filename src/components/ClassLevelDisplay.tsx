import { classNames } from "@common/data";
import type { ClassLevel } from "@common/types";
import cx from "classnames";

import styles from "./ClassLevelDisplay.module.scss";

const classNameToCssClass = Object.fromEntries(
  classNames.map((name) => [name, styles[name]]),
);

export default function ClassLevelDisplay({
  subclass,
  name,
  level,
}: ClassLevel) {
  return (
    <span className={cx(styles.level, classNameToCssClass[name])}>
      {subclass} {name} {level}
    </span>
  );
}
