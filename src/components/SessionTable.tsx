import { getLocalTimeZone, parseDate } from "@internationalized/date";
import cx from "classnames";
import { useMemo } from "react";
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
  const augmented = useMemo(
    () =>
      data?.map((s) => ({
        ...s,
        dateLocal: parseDate(s.date)
          .toDate(getLocalTimeZone())
          .toLocaleDateString(),
        pcNames: s.pcs
          .map((id) => getShortName(pcs?.find((pc) => pc.id === id)) ?? id)
          .sort()
          .join(", "),
      })) ?? [],
    [data, pcs],
  );
  const { items, onSortChange, sortDescriptor } = useSortedList(
    augmented,
    "date",
    "descending",
  );

  return (
    <Table
      aria-label="Sessions"
      className={cx("react-aria-Table", { error, isLoading })}
      sortDescriptor={sortDescriptor}
      onSortChange={onSortChange}
    >
      <TableHeader>
        <MyColumn id="name" allowsSorting isRowHeader>
          Name
        </MyColumn>
        <MyColumn id="date" allowsSorting>
          Date
        </MyColumn>
        <MyColumn id="dm" allowsSorting>
          DM
        </MyColumn>
        <MyColumn id="pcNames" allowsSorting>
          PCs
        </MyColumn>
        <MyColumn>Actions</MyColumn>
      </TableHeader>
      <TableBody
        items={items}
        renderEmptyState={() =>
          isLoading
            ? "Loading..."
            : error
              ? `Error: ${error}`
              : "No sessions found"
        }
      >
        {(session) => (
          <Row>
            <Cell>{session.name}</Cell>
            <Cell>{session.dateLocal}</Cell>
            <Cell>{session.dm}</Cell>
            <Cell>{session.pcNames}</Cell>
            <Cell>
              <MyButton aria-label="Edit" onClick={() => onEdit(session)}>
                ✏️
              </MyButton>
            </Cell>
          </Row>
        )}
      </TableBody>
    </Table>
  );
}
