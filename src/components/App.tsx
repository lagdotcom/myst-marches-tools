import "./App.scss";

import { Analytics } from "@vercel/analytics/react";
import { useCallback, useState } from "react";
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

import { useAddPC, useEditPC, usePCList } from "../api";
import type { ClassLevel, PC } from "../types";
import useSortedList from "../useSortedList";
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
  const { items, onSortChange, sortDescriptor } = useSortedList(
    data?.results ?? [],
    "name"
  );
  const [isAddOpen, setAddOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [editingPC, setEditingPC] = useState<PC>();

  const onEdit = useCallback((pc: PC) => {
    setEditingPC(pc);
    setEditOpen(true);
  }, []);

  const onSubmitAdd = useCallback(
    async (pc: PC, onComplete: () => void) => {
      const error = await addPC.submit(pc);
      if (error) return alert(error);

      onComplete();
      await mutate();
    },
    [addPC, mutate]
  );

  const onSubmitEdit = useCallback(
    async (pc: PC, onComplete: () => void) => {
      const error = await editPC.submit(pc);
      if (error) return alert(error);

      onComplete();
      setEditingPC(undefined);
      setEditOpen(false);

      await mutate();
    },
    [editPC, mutate]
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>ERROR: {error}</div>;

  return (
    <main>
      <Analytics />

      <nav>
        <Button onClick={() => setAddOpen(true)}>Add PC</Button>
      </nav>

      <article>
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
            <MyColumn id="species" allowsSorting>
              Species
            </MyColumn>
            <MyColumn>Class</MyColumn>
            <MyColumn>Actions</MyColumn>
          </TableHeader>
          <TableBody>
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
      </article>

      <Modal isOpen={isAddOpen} onOpenChange={setAddOpen} isDismissable>
        <Dialog>
          <Heading slot="title">Add PC</Heading>
          <PCForm disabled={addPC.isSubmitting} onSubmit={onSubmitAdd} />
          <Button slot="close">Close</Button>
        </Dialog>
      </Modal>

      <Modal isOpen={isEditOpen} onOpenChange={setEditOpen} isDismissable>
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
    </main>
  );
}

export default App;
