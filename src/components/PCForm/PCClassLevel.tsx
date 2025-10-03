import { classNames } from "@common/data";
import type { ClassName } from "@common/flavours";
import type { ClassLevel } from "@common/types";
import cx from "classnames";
import { useCallback } from "react";
import {
  FieldError,
  Group,
  Input,
  Label,
  NumberField,
  TextField,
} from "react-aria-components";

import { MyButton } from "../common/MyButton";
import { MyComboBox } from "../common/MyComboBox";
import styles from "./PCClassLevel.module.scss";

interface Props {
  data: ClassLevel;
  onRemove(): void;
  onUpdate(update: Partial<ClassLevel>): void;
  disabled?: boolean;
}

const classNameOptions = classNames.map((name) => ({ id: name, name }));

const classNameToCssClass = Object.fromEntries(
  classNames.map((name) => [name, styles[name]]),
);

export default function PCClassLevel({
  data,
  disabled,
  onRemove,
  onUpdate,
}: Props) {
  const onNameChange = useCallback(
    (name: ClassName) => onUpdate({ name }),
    [onUpdate],
  );

  const onLevelChange = useCallback(
    (level: number) => onUpdate({ level }),
    [onUpdate],
  );

  const onSubclassChange = useCallback(
    (subclass: string) =>
      onUpdate({ subclass: subclass ? subclass : undefined }),
    [onUpdate],
  );

  return (
    <div className={cx(styles.container, classNameToCssClass[data.name])}>
      <MyComboBox
        className={styles.class}
        label="Class"
        disabled={disabled}
        items={classNameOptions}
        selected={data.name}
        onChange={onNameChange}
        required
      />

      <NumberField
        className={cx("react-aria-NumberField", styles.level)}
        isDisabled={disabled}
        minValue={1}
        maxValue={20}
        value={data.level}
        onChange={onLevelChange}
      >
        <Label>Level</Label>
        <Group>
          <MyButton slot="decrement">➖</MyButton>
          <Input />
          <MyButton slot="increment">➕</MyButton>
        </Group>
        <FieldError />
      </NumberField>

      <TextField
        className={cx("react-aria-TextField", styles.subclass)}
        isReadOnly={disabled || data.level < 3}
        value={data.subclass ?? ""}
        onChange={onSubclassChange}
      >
        <Label>Subclass</Label>
        <Input />
        <FieldError />
      </TextField>

      <MyButton onClick={onRemove} isDisabled={disabled}>
        Remove
      </MyButton>
    </div>
  );
}
