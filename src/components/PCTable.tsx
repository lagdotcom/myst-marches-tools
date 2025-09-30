import cx from "classnames";
import { useCallback } from "react";
import {
  Cell,
  Row,
  Table,
  TableBody,
  TableHeader,
} from "react-aria-components";

import { usePCList } from "../api";
import { CharacterResponse } from "../CharacterV5";
import { classNames } from "../data";
import type { ClassLevel, PC } from "../types";
import useSortedList from "../useSortedList";
import { MyButton } from "./common/MyButton";
import { MyColumn } from "./common/MyColumn";
import styles from "./PCTable.module.scss";

interface Props {
  onEdit(pc: PC): void;
}

const classNameToCssClass = Object.fromEntries(
  classNames.map((name) => [name, styles[name]]),
);

function CLDisplay({ subclass, name, level }: ClassLevel) {
  return (
    <span className={cx(styles.level, classNameToCssClass[name])}>
      {subclass} {name} {level}
    </span>
  );
}

const showDDBFetch = false;

const classLevels = (data: ClassLevel[]) =>
  data.map((cl, i) => <CLDisplay key={i} {...cl} />);

export default function PCTable({ onEdit }: Props) {
  const { data, error, isLoading } = usePCList();
  const { items, onSortChange, sortDescriptor } = useSortedList(
    data ?? [],
    "name",
  );

  const ddbFetch = useCallback(async (id: string) => {
    const res = await fetch(`/api/fetch?id=${id}`);
    const raw = await res.json();
    const parsed = CharacterResponse.parse(raw);
    console.log(parsed);
  }, []);

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
        items={items}
        renderEmptyState={() =>
          isLoading ? "Loading..." : error ? `Error: ${error}` : "No PCs found"
        }
      >
        {(pc) => (
          <Row>
            <Cell>{pc.player}</Cell>
            <Cell>{pc.name}</Cell>
            <Cell>{pc.species}</Cell>
            <Cell>{classLevels(pc.classLevels)}</Cell>
            <Cell>
              <MyButton aria-label="Edit" onClick={() => onEdit(pc)}>
                ✏️
              </MyButton>
              {pc.beyondUrl && (
                <>
                  <MyButton
                    aria-label="D&D Beyond"
                    onClick={() => window.open(pc.beyondUrl)}
                  >
                    &amp;
                  </MyButton>
                  {showDDBFetch && (
                    <MyButton onClick={() => ddbFetch(pc.id)}>test</MyButton>
                  )}
                </>
              )}
            </Cell>
          </Row>
        )}
      </TableBody>
    </Table>
  );
}
