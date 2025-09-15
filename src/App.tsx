import { Analytics } from "@vercel/analytics/react";

import "./App.scss";
import type { ClassLevel, PC } from "./types";
import { useAddPC, useEditPC, usePCList } from "./api";
import { useCallback, useRef, useState, type FormEvent } from "react";
import { classNames } from "./data";
import {
  Button,
  Cell,
  Dialog,
  Heading,
  Modal,
  Row,
  Table,
  TableBody,
  TableHeader,
} from "react-aria-components";
import { useSortedThing } from "./useSorted";
import { MyColumn } from "./MyColumn";
import PCForm from "./PCForm";

const classLevels = (data: ClassLevel[]) =>
  data
    .map((cl) =>
      cl.subclass
        ? `${cl.subclass} ${cl.name} ${cl.level}`
        : `${cl.name} ${cl.level}`
    )
    .join(", ");

function App() {
  const { data, error, isLoading, mutate } = usePCList();
  const addPC = useAddPC();
  const editPC = useEditPC();
  const formRef = useRef<HTMLFormElement>(null);
  const { items, onSortChange, sortDescriptor } = useSortedThing(
    data?.results ?? [],
    "name"
  );
  const [isOpen, setOpen] = useState(false);
  const [editingPC, setEditingPC] = useState<PC>();

  const newPcClick = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const data = new FormData(e.currentTarget);
      console.log(data);

      const player = data.get("player") as string | null;
      const name = data.get("name") as string | null;
      const className = data.get("class") as string | null;
      if (!player || !name || !className) return alert("form not filled");

      const pc: PC = {
        player,
        name,
        classLevels: [{ name: className, level: 1 }],
      };

      const error = await addPC.submit(pc);
      if (error) alert(error);
      else {
        formRef.current?.reset();
        await mutate((old) => ({ results: (old?.results ?? []).concat(pc) }));
      }
    },
    [addPC, mutate]
  );

  const onEdit = useCallback((pc: PC) => {
    setEditingPC(pc);
    setOpen(true);
  }, []);

  const onSubmitEdit = useCallback(
    async (pc: PC, onComplete: () => void) => {
      const error = await editPC.submit(pc);
      if (error) return alert(error);

      onComplete();
      setEditingPC(undefined);
      setOpen(false);

      await mutate();
    },
    [editPC, mutate]
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>ERROR: {error}</div>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Analytics />

      <div style={{ overflowY: "scroll" }}>
        <Table
          aria-label="PCs"
          sortDescriptor={sortDescriptor}
          onSortChange={onSortChange}
          style={{ width: "100%" }}
        >
          <TableHeader>
            <MyColumn id="player" allowsSorting>
              Player
            </MyColumn>
            <MyColumn id="name" allowsSorting isRowHeader>
              Name
            </MyColumn>
            <MyColumn>Class</MyColumn>
            <MyColumn>Actions</MyColumn>
          </TableHeader>
          <TableBody>
            {items.map((pc, index) => (
              <Row key={index}>
                <Cell>{pc.player}</Cell>
                <Cell>{pc.name}</Cell>
                <Cell>{classLevels(pc.classLevels)}</Cell>
                <Cell>
                  <Button onClick={() => onEdit(pc)}>✏️</Button>
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </div>

      <form
        ref={formRef}
        aria-disabled={addPC.isSubmitting}
        onSubmit={newPcClick}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>
            Player
            <input name="player" required />
          </label>
          <label>
            Name
            <input name="name" required />
          </label>
          <label>
            Class
            <select name="class">
              {classNames.map((cn) => (
                <option key={cn} value={cn}>
                  {cn}
                </option>
              ))}
            </select>
          </label>
        </div>

        <Button type="submit">Add PC</Button>
      </form>

      <Modal isOpen={isOpen} onOpenChange={setOpen} isDismissable>
        <Dialog>
          <Heading slot="title">Edit PC</Heading>
          <PCForm
            disabled={editPC.isSubmitting}
            edit={editingPC}
            onSubmit={onSubmitEdit}
          />
          <Button slot="close">Close</Button>
        </Dialog>
      </Modal>
    </div>
  );
}

export default App;
