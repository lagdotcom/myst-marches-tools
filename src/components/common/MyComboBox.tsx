import cx from "classnames";
import { useCallback } from "react";
import {
  ComboBox,
  FieldError,
  Input,
  type Key,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
} from "react-aria-components";

import { MyButton } from "./MyButton";

interface ComboBoxItem {
  id: string;
  name: string;
}

interface Props<TItem extends ComboBoxItem> {
  className?: string;
  disabled?: boolean;
  label: string;
  items: TItem[];
  required?: boolean;
  selected: string;
  onChange(key: string): void;
}

export default function MyComboBox<TItem extends ComboBoxItem>({
  className,
  disabled,
  label,
  items,
  required,
  selected,
  onChange,
}: Props<TItem>) {
  const onSelectionChange = useCallback(
    (key: Key | null) => {
      onChange(key ? (key as string) : "");
    },
    [onChange],
  );

  return (
    <ComboBox
      className={cx("react-aria-ComboBox", className)}
      isDisabled={disabled}
      defaultItems={items}
      selectedKey={selected}
      onSelectionChange={onSelectionChange}
      isRequired={required}
    >
      <Label>{label}</Label>
      <div>
        <Input />
        <MyButton>⯆</MyButton>
      </div>
      <FieldError />
      <Popover maxHeight={400}>
        <ListBox<TItem>>
          {(item) => <ListBoxItem>{item.name}</ListBoxItem>}
        </ListBox>
      </Popover>
    </ComboBox>
  );
}
