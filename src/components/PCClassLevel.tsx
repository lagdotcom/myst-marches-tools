import { useCallback } from "react";
import {
  Button,
  FieldError,
  Group,
  Input,
  Label,
  NumberField,
  TextField,
} from "react-aria-components";

import { classNames } from "../data";
import type { ClassLevel } from "../types";
import MyComboBox from "./MyComboBox";

interface Props {
  data: ClassLevel;
  onRemove(): void;
  onUpdate(update: Partial<ClassLevel>): void;
  disabled?: boolean;
}

const classNameOptions = classNames.map((name) => ({ id: name, name }));

export default function PCClassLevel({
  data,
  disabled,
  onRemove,
  onUpdate,
}: Props) {
  const onNameChange = useCallback(
    (name: string) => onUpdate({ name }),
    [onUpdate]
  );

  const onLevelChange = useCallback(
    (level: number) => onUpdate({ level }),
    [onUpdate]
  );

  const onSubclassChange = useCallback(
    (subclass: string) =>
      onUpdate({ subclass: subclass ? subclass : undefined }),
    [onUpdate]
  );

  return (
    <div>
      <MyComboBox
        label="Class"
        disabled={disabled}
        items={classNameOptions}
        selected={data.name}
        onChange={onNameChange}
      />

      <NumberField
        isDisabled={disabled}
        minValue={1}
        maxValue={20}
        value={data.level}
        onChange={onLevelChange}
      >
        <Label>Level</Label>
        <Group>
          <Button slot="decrement">➖</Button>
          <Input />
          <Button slot="increment">➕</Button>
        </Group>
        <FieldError />
      </NumberField>

      <TextField
        isReadOnly={disabled || data.level < 3}
        value={data.subclass ?? ""}
        onChange={onSubclassChange}
      >
        <Label>Subclass</Label>
        <Input />
        <FieldError />
      </TextField>

      <Button onClick={onRemove}>🗑️</Button>
    </div>
  );
}
