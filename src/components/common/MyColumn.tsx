import { Column, type ColumnProps } from "react-aria-components";

export function MyColumn(
  props: Omit<ColumnProps, "children"> & { children?: React.ReactNode },
) {
  return (
    <Column {...props}>
      {({ allowsSorting, sortDirection }) => (
        <div className="column-header">
          {props.children}
          {allowsSorting && (
            <span aria-hidden="true" className="sort-indicator">
              {sortDirection === "ascending" ? "⬇️" : "⬆️"}
            </span>
          )}
        </div>
      )}
    </Column>
  );
}
