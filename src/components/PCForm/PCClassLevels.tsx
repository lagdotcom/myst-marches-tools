import type { ClassLevel } from "@common/types";
import { type Dispatch, type SetStateAction, useCallback } from "react";

import { MyButton } from "../common/MyButton";
import PCClassLevel from "./PCClassLevel";
import styles from "./PCClassLevels.module.scss";

interface Props {
  disabled?: boolean;
  classLevels: ClassLevel[];
  onUpdate: Dispatch<SetStateAction<ClassLevel[]>>;
}

export default function PCClassLevels({
  classLevels,
  disabled,
  onUpdate,
}: Props) {
  const onPatch = useCallback(
    (i: number) => (patch: Partial<ClassLevel>) =>
      onUpdate((old) =>
        old.map((data, j) => (i === j ? { ...data, ...patch } : data)),
      ),
    [onUpdate],
  );

  const onAdd = useCallback(
    () => onUpdate((old) => old.concat({ name: "", level: 1 })),
    [onUpdate],
  );

  const onRemove = useCallback(
    (i: number) => () => onUpdate((old) => old.filter((_, j) => i !== j)),
    [onUpdate],
  );

  return (
    <div className={styles.container}>
      {classLevels.map((data, i) => (
        <PCClassLevel
          key={i}
          data={data}
          disabled={disabled}
          onRemove={onRemove(i)}
          onUpdate={onPatch(i)}
        />
      ))}
      <MyButton className={styles.add} isDisabled={disabled} onClick={onAdd}>
        Add Class
      </MyButton>
    </div>
  );
}
