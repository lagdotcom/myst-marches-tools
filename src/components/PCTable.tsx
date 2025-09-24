import "./App.scss";

import cx from "classnames";
import {
  Button,
  Cell,
  Row,
  Table,
  TableBody,
  TableHeader,
} from "react-aria-components";

import { usePCList } from "../api";
import type { ClassLevel, PC } from "../types";
import useSortedList from "../useSortedList";
import { MyColumn } from "./MyColumn";

interface Props {
  onEdit(pc: PC): void;
}

const classLevels = (data: ClassLevel[]) =>
  data
    .map((cl) =>
      cl.subclass
        ? `${cl.subclass} ${cl.name} ${cl.level}`
        : `${cl.name} ${cl.level}`
    )
    .join(", ");

export default function PCTable({ onEdit }: Props) {
  const { data, error, isLoading } = usePCList();
  const { items, onSortChange, sortDescriptor } = useSortedList(
    data?.results ?? [],
    "name"
  );

  return (
    <Table
      aria-label="PCs"
      className={cx("react-aria-Table", { error, isLoading })}
      sortDescriptor={sortDescriptor}
      onSortChange={onSortChange}
    >
      <TableHeader>
        <MyColumn id="player" allowsSorting>
          Player
        </MyColumn>
        <MyColumn id="name" allowsSorting isRowHeader>
          Name
        </MyColumn>
        <MyColumn id="species" allowsSorting>
          Species
        </MyColumn>
        <MyColumn>Class</MyColumn>
        <MyColumn>Actions</MyColumn>
      </TableHeader>
      <TableBody
        renderEmptyState={() =>
          isLoading ? "Loading..." : error ? `Error: ${error}` : "No PCs found"
        }
      >
        {items.map((pc, index) => (
          <Row key={index}>
            <Cell>{pc.player}</Cell>
            <Cell>{pc.name}</Cell>
            <Cell>{pc.species}</Cell>
            <Cell>{classLevels(pc.classLevels)}</Cell>
            <Cell>
              <Button onClick={() => onEdit(pc)}>✏️</Button>
            </Cell>
          </Row>
        ))}
      </TableBody>
    </Table>
  );
}
