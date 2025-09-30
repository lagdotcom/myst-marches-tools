import { useCallback, useState } from "react";
import { Dialog, Heading, Modal } from "react-aria-components";

import { usePCAPI, usePCList } from "../api";
import type { PC } from "../types";
import { MyButton } from "./common/MyButton";
import PCForm from "./PCForm/PCForm";
import PCTable from "./PCTable";

export default function PCPage() {
  const { mutate } = usePCList();
  const { isSubmitting, post, put } = usePCAPI();
  const [isAddOpen, setAddOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [editingPC, setEditingPC] = useState<PC>();

  const onEditPC = useCallback((pc: PC) => {
    setEditingPC(pc);
    setEditOpen(true);
  }, []);

  const onSubmitAdd = useCallback(
    async (pc: PC, onComplete: () => void) => {
      const error = await post(pc);
      if (error) return alert(error);

      onComplete();
      await mutate();
    },
    [mutate, post],
  );

  const onSubmitEdit = useCallback(
    async (pc: PC, onComplete: () => void) => {
      const error = await put(pc);
      if (error) return alert(error);

      onComplete();
      setEditingPC(undefined);
      setEditOpen(false);

      await mutate();
    },
    [mutate, put],
  );

  return (
    <>
      <div>
        <MyButton onClick={() => setAddOpen(true)}>Add PC</MyButton>
      </div>
      <PCTable onEdit={onEditPC} />

      <Modal isOpen={isAddOpen} onOpenChange={setAddOpen} isDismissable>
        <Dialog>
          <Heading slot="title">Add PC</Heading>
          <PCForm disabled={isSubmitting} onSubmit={onSubmitAdd} />
        </Dialog>
      </Modal>

      <Modal isOpen={isEditOpen} onOpenChange={setEditOpen} isDismissable>
        <Dialog>
          <Heading slot="title">Edit PC</Heading>
          <PCForm
            disabled={isSubmitting}
            edit={editingPC}
            onSubmit={onSubmitEdit}
          />
        </Dialog>
      </Modal>
    </>
  );
}
