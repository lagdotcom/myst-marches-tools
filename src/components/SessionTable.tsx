import cx from "classnames";
import { useCallback } from "react";
import {
  Cell,
  Row,
  Table,
  TableBody,
  TableHeader,
} from "react-aria-components";

import { usePCList, useSessionList } from "../api";
import type { PC, Session } from "../types";
import useSortedList from "../useSortedList";
import { MyButton } from "./common/MyButton";
import { MyColumn } from "./common/MyColumn";

interface Props {
  onEdit(session: Session): void;
}

function getShortName(pc?: PC) {
  return pc?.shortName ?? pc?.name;
}

export default function SessionTable({ onEdit }: Props) {
  const { data: pcs } = usePCList();
  const { data, error, isLoading } = useSessionList();
  const { items, onSortChange, sortDescriptor } = useSortedList(
    data?.results ?? [],
    "date",
    "descending",
  );

  const getPCNames = useCallback(
    (ids: string[]) =>
      ids
        .map(
          (id) => getShortName(pcs?.results.find((pc) => pc.id === id)) ?? id,
        )
        .sort()
        .join(", "),
    [pcs],
  );

  return (
    <Table
      aria-label="Sessions"
      className={cx("react-aria-Table", { error, isLoading })}
      sortDescriptor={sortDescriptor}
      onSortChange={onSortChange}
    >
      <TableHeader>
        <MyColumn id="date" allowsSorting isRowHeader>
          Date
        </MyColumn>
        <MyColumn id="dm" allowsSorting>
          DM
        </MyColumn>
        <MyColumn allowsSorting>PCs</MyColumn>
        <MyColumn>Actions</MyColumn>
      </TableHeader>
      <TableBody
        renderEmptyState={() =>
          isLoading
            ? "Loading..."
            : error
              ? `Error:${error}`
              : "No Sessions found"
        }
      >
        {items.map((session, index) => (
          <Row key={index}>
            <Cell>{session.date}</Cell>
            <Cell>{session.dm}</Cell>
            <Cell>{getPCNames(session.pcs)}</Cell>
            <Cell>
              <MyButton aria-label="Edit" onClick={() => onEdit(session)}>
                ✏️
              </MyButton>
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
}
