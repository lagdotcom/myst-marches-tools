import "./App.scss";

import { Analytics } from "@vercel/analytics/react";
import { useCallback, useState } from "react";
import { Dialog, Heading, Modal } from "react-aria-components";

import { useAddPC, useEditPC, usePCList } from "../api";
import type { PC } from "../types";
import { MyButton } from "./common/MyButton";
import PCForm from "./PCForm/PCForm";
import PCTable from "./PCTable";

function App() {
  const { mutate } = usePCList();
  const addPC = useAddPC();
  const editPC = useEditPC();
  const [isAddOpen, setAddOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [editingPC, setEditingPC] = useState<PC>();

  const onEditPC = useCallback((pc: PC) => {
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
    [addPC, mutate],
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
    [editPC, mutate],
  );

  return (
    <main>
      <Analytics />

      <nav>
        <MyButton onClick={() => setAddOpen(true)}>Add PC</MyButton>
      </nav>

      <article>
        <PCTable onEdit={onEditPC} />
      </article>

      <Modal isOpen={isAddOpen} onOpenChange={setAddOpen} isDismissable>
        <Dialog>
          <Heading slot="title">Add PC</Heading>
          <PCForm disabled={addPC.isSubmitting} onSubmit={onSubmitAdd} />
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
        </Dialog>
      </Modal>
    </main>
  );
}

export default App;
