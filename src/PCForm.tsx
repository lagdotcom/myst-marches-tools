import {
  Button,
  ComboBox,
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  TextField,
  type Key,
} from "react-aria-components";
import type { PC } from "./types";
import { useCallback, useMemo, useState, type FormEvent } from "react";
import { classNames } from "./data";

interface Props {
  disabled?: boolean;
  edit?: PC;
  onSubmit(pc: PC, onComplete: () => void): void;
}

const classNameOptions = classNames.map((name) => ({ id: name, name }));
type ClassNameOption = (typeof classNameOptions)[number];

export default function PCForm({ disabled, edit, onSubmit }: Props) {
  const editing = useMemo(() => !!edit, [edit]);
  const [player, setPlayer] = useState(edit?.player ?? "");
  const [name, setName] = useState(edit?.name ?? "");
  const [className, setClassName] = useState(edit?.classLevels[0].name ?? "");

  const onClassChange = useCallback((key: Key | null) => {
    setClassName(key ? (key as string) : "");
  }, []);

  const reset = useCallback(() => {
    setPlayer("");
    setName("");
    setClassName("");
  }, []);

  const onFormSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      onSubmit(
        { player, name, classLevels: [{ name: className, level: 1 }] },
        reset
      );
    },
    [className, name, onSubmit, player, reset]
  );

  return (
    <Form onSubmit={onFormSubmit}>
      <TextField
        isDisabled={disabled}
        isRequired
        isReadOnly={editing}
        value={player}
        onChange={setPlayer}
      >
        <Label>Player</Label>
        <Input />
        <FieldError />
      </TextField>
      <TextField
        isDisabled={disabled}
        isRequired
        isReadOnly={editing}
        value={name}
        onChange={setName}
      >
        <Label>Name</Label>
        <Input />
        <FieldError />
      </TextField>
      <ComboBox
        isDisabled={disabled}
        defaultItems={classNameOptions}
        selectedKey={className}
        onSelectionChange={onClassChange}
      >
        <Label>Class</Label>
        <div>
          <Input />
          <Button>🔽</Button>
        </div>
        <FieldError />
        <Popover>
          <ListBox<ClassNameOption>>
            {(item) => <ListBoxItem>{item.name}</ListBoxItem>}
          </ListBox>
        </Popover>
      </ComboBox>

      <Button isDisabled={disabled} type="submit">
        Submit
      </Button>
    </Form>
  );
}
