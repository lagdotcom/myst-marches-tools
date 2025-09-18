import { useCallback } from "react";
import {
  Button,
  ComboBox,
  FieldError,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  type Key,
} from "react-aria-components";

interface ComboBoxItem {
  id: string;
  name: string;
}

interface Props<TItem extends ComboBoxItem> {
  disabled?: boolean;
  label: string;
  items: TItem[];
  selected: string;
  onChange(key: string): void;
}

export default function MyComboBox<TItem extends ComboBoxItem>({
  disabled,
  label,
  items,
  selected,
  onChange,
}: Props<TItem>) {
  const onSelectionChange = useCallback(
    (key: Key | null) => {
      onChange(key ? (key as string) : "");
    },
    [onChange]
  );

  return (
    <ComboBox
      isDisabled={disabled}
      defaultItems={items}
      selectedKey={selected}
      onSelectionChange={onSelectionChange}
    >
      <Label>{label}</Label>
      <div>
        <Input />
        <Button>🔽</Button>
      </div>
      <FieldError />
      <Popover>
        <ListBox<TItem>>
          {(item) => <ListBoxItem>{item.name}</ListBoxItem>}
        </ListBox>
      </Popover>
    </ComboBox>
  );
}
