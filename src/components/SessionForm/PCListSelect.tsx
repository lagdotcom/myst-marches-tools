import cx from "classnames";
import { useCallback, useMemo } from "react";
import {
  Label,
  ListBox,
  ListBoxItem,
  type Selection,
} from "react-aria-components";

import { usePCList } from "../../api";
import styles from "./PCListSelect.module.scss";

interface Props {
  value: string[];
  setValue(value: string[]): void;
}

export default function PCListSelect({ value, setValue }: Props) {
  const { data } = usePCList();
  const items = useMemo(
    () =>
      data
        ?.map((pc) => ({ id: pc.id, name: pc.name }))
        .sort((a, b) => a.name.localeCompare(b.name)) ?? [],
    [data],
  );

  const onSelectionChange = useCallback(
    (selection: Selection) => {
      if (selection === "all") {
        setValue(items.map((i) => i.id));
      } else {
        setValue(Array.from(selection) as string[]);
      }
    },
    [items, setValue],
  );

  return (
    <div>
      <Label>PCs</Label>
      <ListBox
        className={cx("react-aria-ListBox", styles.list)}
        aria-label="PCs"
        items={items}
        selectionMode="multiple"
        selectedKeys={value}
        onSelectionChange={onSelectionChange}
      >
        {(item) => <ListBoxItem>{item.name}</ListBoxItem>}
      </ListBox>
    </div>
  );
}
