import { useMemo, useState } from "react";
import type { Key, SortDescriptor, SortDirection } from "react-stately";

export default function useSortedList<T>(
  data: T[],
  initialColumn: Key,
  initialDirection: SortDirection = "ascending"
) {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: initialColumn,
    direction: initialDirection,
  });

  const items = useMemo(
    () =>
      data.sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const first = a[sortDescriptor.column] ?? "";

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const second = b[sortDescriptor.column] ?? "";

        let cmp = 0;
        if (typeof first === "number") cmp = first - second;
        else cmp = first.localeCompare(second);

        if (sortDescriptor.direction === "descending") cmp *= -1;
        return cmp;
      }),
    [data, sortDescriptor]
  );

  return { items, onSortChange: setSortDescriptor, sortDescriptor };
}
