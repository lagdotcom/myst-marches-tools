import cx from "classnames";
import { type FormEvent, useCallback, useMemo, useState } from "react";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "react-aria-components";

import { speciesNames } from "../data";
import type { PC } from "../types";
import MyComboBox from "./MyComboBox";
import PCClassLevels from "./PCClassLevels";

interface Props {
  disabled?: boolean;
  edit?: PC;
  onSubmit(pc: PC, onComplete: () => void): void;
}

const speciesNameOptions = speciesNames.map((name) => ({ id: name, name }));

export default function PCForm({ disabled, edit, onSubmit }: Props) {
  const editing = useMemo(() => !!edit, [edit]);
  const [player, setPlayer] = useState(edit?.player ?? "");
  const [name, setName] = useState(edit?.name ?? "");
  const [species, setSpecies] = useState(edit?.species ?? "");
  const [classLevels, setClassLevels] = useState(
    edit?.classLevels ?? [{ name: "", level: 1 }]
  );

  const reset = useCallback(() => {
    setPlayer("");
    setName("");
    setClassLevels([{ name: "", level: 1 }]);
  }, []);

  const onFormSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      onSubmit({ player, name, species, classLevels }, reset);
    },
    [classLevels, name, onSubmit, player, reset, species]
  );

  return (
    <Form className={cx({ disabled })} onSubmit={onFormSubmit}>
      <TextField
        isDisabled={disabled}
        isRequired
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
      <MyComboBox
        label="Species"
        disabled={disabled}
        items={speciesNameOptions}
        selected={species}
        onChange={setSpecies}
      />
      <PCClassLevels
        disabled={disabled}
        classLevels={classLevels}
        onUpdate={setClassLevels}
      />

      <Button isDisabled={disabled} type="submit">
        Submit
      </Button>
    </Form>
  );
}
