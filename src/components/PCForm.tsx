import { type FormEvent, useCallback, useMemo, useState } from "react";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "react-aria-components";
import cx from "classnames";

import { classNames, speciesNames } from "../data";
import type { PC } from "../types";
import MyComboBox from "./MyComboBox";

interface Props {
  disabled?: boolean;
  edit?: PC;
  onSubmit(pc: PC, onComplete: () => void): void;
}

const classNameOptions = classNames.map((name) => ({ id: name, name }));
const speciesNameOptions = speciesNames.map((name) => ({ id: name, name }));

export default function PCForm({ disabled, edit, onSubmit }: Props) {
  const editing = useMemo(() => !!edit, [edit]);
  const [player, setPlayer] = useState(edit?.player ?? "");
  const [name, setName] = useState(edit?.name ?? "");
  const [species, setSpecies] = useState(edit?.species ?? "");
  const [className, setClassName] = useState(edit?.classLevels[0].name ?? "");

  const reset = useCallback(() => {
    setPlayer("");
    setName("");
    setClassName("");
  }, []);

  const onFormSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      onSubmit(
        { player, name, species, classLevels: [{ name: className, level: 1 }] },
        reset
      );
    },
    [className, name, onSubmit, player, reset, species]
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
      <MyComboBox
        label="Class"
        disabled={disabled}
        items={classNameOptions}
        selected={className}
        onChange={setClassName}
      />

      <Button isDisabled={disabled} type="submit">
        Submit
      </Button>
    </Form>
  );
}
