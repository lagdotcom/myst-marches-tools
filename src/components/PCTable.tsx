import type { PC } from "@common/types";
import cx from "classnames";
import { useCallback, useMemo } from "react";
import {
  Cell,
  Row,
  Table,
  TableBody,
  TableHeader,
} from "react-aria-components";

import { usePCList, useSessionList } from "../api";
import { CharacterResponse } from "../CharacterV5";
import useSortedList from "../useSortedList";
import ClassLevelDisplay from "./ClassLevelDisplay";
import { MyButton } from "./common/MyButton";
import { MyColumn } from "./common/MyColumn";

interface Props {
  onEdit(pc: PC): void;
}

const showDDBFetch = false;

export default function PCTable({ onEdit }: Props) {
  const { data, error, isLoading } = usePCList();
  const { data: sessions } = useSessionList();

  const augmented = useMemo(
    () =>
      data?.map((pc) => {
        const pcSessions = sessions?.filter((s) => s.pcs.includes(pc.id)) ?? [];

        return {
          ...pc,
          class: pc.classLevels
            .map((cl) => `${cl.name} ${cl.level} - ${cl.subclass}`)
            .join(" "),
          sessionCount: pcSessions.length,
          session:
            pcSessions.sort((a, b) => b.date.localeCompare(a.date))[0]?.date ??
            "-",
        };
      }) ?? [],
    [data, sessions],
  );
  const { items, onSortChange, sortDescriptor } = useSortedList(
    augmented,
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
        <MyColumn id="class" allowsSorting>
          Class
        </MyColumn>
        <MyColumn id="session" allowsSorting>
          Last Session
        </MyColumn>
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
            <Cell>
              {pc.classLevels.map((cl, i) => (
                <ClassLevelDisplay key={i} {...cl} />
              ))}
            </Cell>
            <Cell>{pc.session}</Cell>
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
