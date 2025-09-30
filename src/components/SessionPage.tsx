import { useCallback, useState } from "react";
import { Dialog, Heading, Modal } from "react-aria-components";

import { useSessionAPI, useSessionList } from "../api";
import type { Session } from "../types";
import { MyButton } from "./common/MyButton";
import SessionForm from "./SessionForm/SessionForm";
import SessionTable from "./SessionTable";

export default function SessionPage() {
  const { mutate } = useSessionList();
  const { isSubmitting, post, put } = useSessionAPI();
  const [isAddOpen, setAddOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session>();

  const onEditSession = useCallback((session: Session) => {
    setEditingSession(session);
    setEditOpen(true);
  }, []);

  const onSubmitAdd = useCallback(
    async (session: Session, onComplete: () => void) => {
      const error = await post(session);
      if (error) return alert(error);

      onComplete();
      await mutate();
    },
    [mutate, post],
  );

  const onSubmitEdit = useCallback(
    async (session: Session, onComplete: () => void) => {
      const error = await put(session);
      if (error) return alert(error);

      onComplete();
      setEditingSession(undefined);
      setEditOpen(false);

      await mutate();
    },
    [mutate, put],
  );

  return (
    <>
      <div>
        <MyButton onClick={() => setAddOpen(true)}>Add Session</MyButton>
      </div>
      <SessionTable onEdit={onEditSession} />

      <Modal isOpen={isAddOpen} onOpenChange={setAddOpen} isDismissable>
        <Dialog>
          <Heading slot="title">Add Session</Heading>
          <SessionForm disabled={isSubmitting} onSubmit={onSubmitAdd} />
        </Dialog>
      </Modal>

      <Modal isOpen={isEditOpen} onOpenChange={setEditOpen} isDismissable>
        <Dialog>
          <Heading slot="title">Edit Session</Heading>
          <SessionForm
            disabled={isSubmitting}
            edit={editingSession}
            onSubmit={onSubmitEdit}
          />
        </Dialog>
      </Modal>
    </>
  );
}
