import type { Session } from "@common/types";
import { parseDate } from "@internationalized/date";
import cx from "classnames";
import { type FormEvent, useCallback, useState } from "react";
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  DateInput,
  DatePicker,
  DateSegment,
  Dialog,
  FieldError,
  Form,
  Group,
  Heading,
  Input,
  Label,
  Popover,
  TextField,
} from "react-aria-components";

import { MyButton } from "../common/MyButton";
import PCListSelect from "./PCListSelect";

interface Props {
  disabled?: boolean;
  edit?: Session;
  onSubmit(session: Session, onComplete: () => void): void;
}

export default function SessionForm({ disabled, edit, onSubmit }: Props) {
  const [id] = useState(edit?.id);
  const [name, setName] = useState(edit?.name ?? "");
  const [date, setDate] = useState(edit?.date ? parseDate(edit.date) : null);
  const [dm, setDM] = useState(edit?.dm ?? "");
  const [pcs, setPCs] = useState(edit?.pcs ?? []);

  const reset = useCallback(() => {
    setName("");
    setDate(null);
    setDM("");
    setPCs([]);
  }, []);

  const onFormSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      onSubmit(
        {
          id: id ?? "session:...",
          name,
          date: date?.toString() ?? "",
          dm,
          pcs,
        },
        reset,
      );
    },
    [date, dm, id, name, onSubmit, pcs, reset],
  );

  return (
    <Form
      className={cx("react-aria-Form", { disabled })}
      onSubmit={onFormSubmit}
    >
      <TextField
        isDisabled={disabled}
        isRequired
        value={name}
        onChange={setName}
      >
        <Label>Name</Label>
        <Input />
        <FieldError />
      </TextField>
      <DatePicker
        isDisabled={disabled}
        isRequired
        value={date}
        onChange={setDate}
      >
        <Label>Date</Label>
        <Group>
          <DateInput>
            {(segment) => <DateSegment segment={segment} />}
          </DateInput>
          <MyButton>⯆</MyButton>
        </Group>
        <Popover>
          <Dialog>
            <Calendar>
              <header>
                <MyButton slot="previous">⮜</MyButton>
                <Heading />
                <MyButton slot="next">⮞</MyButton>
              </header>
              <CalendarGrid>
                {(date) => <CalendarCell date={date} />}
              </CalendarGrid>
            </Calendar>
          </Dialog>
        </Popover>
      </DatePicker>
      <TextField isDisabled={disabled} isRequired value={dm} onChange={setDM}>
        <Label>DM</Label>
        <Input />
        <FieldError />
      </TextField>
      <PCListSelect value={pcs} setValue={setPCs} />

      <MyButton isDisabled={disabled} type="submit">
        Submit
      </MyButton>
    </Form>
  );
}
