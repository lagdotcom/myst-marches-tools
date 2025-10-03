import { speciesNames } from "@common/data";
import type { PC } from "@common/types";
import cx from "classnames";
import { type FormEvent, useCallback, useState } from "react";
import {
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "react-aria-components";

import { MyButton } from "../common/MyButton";
import { MyComboBox } from "../common/MyComboBox";
import PCClassLevels from "./PCClassLevels";

interface Props {
  disabled?: boolean;
  edit?: PC;
  onSubmit(pc: PC, onComplete: () => void): void;
}

const speciesNameOptions = speciesNames.map((name) => ({ id: name, name }));

export default function PCForm({ disabled, edit, onSubmit }: Props) {
  const [id] = useState(edit?.id);
  const [player, setPlayer] = useState(edit?.player ?? "");
  const [name, setName] = useState(edit?.name ?? "");
  const [shortName, setShortName] = useState(
    edit?.shortName ?? edit?.name ?? "",
  );
  const [species, setSpecies] = useState(edit?.species ?? "");
  const [beyondUrl, setBeyondUrl] = useState(edit?.beyondUrl ?? "");
  const [classLevels, setClassLevels] = useState(
    edit?.classLevels ?? [{ name: "", level: 1 }],
  );

  const reset = useCallback(() => {
    setPlayer("");
    setName("");
    setShortName("");
    setSpecies("");
    setBeyondUrl("");
    setClassLevels([{ name: "", level: 1 }]);
  }, []);

  const onFormSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const short = shortName ? shortName : undefined;
      onSubmit(
        {
          id: id ?? `pc:${short ?? name}`,
          player,
          name,
          shortName: short,
          species,
          classLevels,
          beyondUrl,
        },
        reset,
      );
    },
    [
      beyondUrl,
      classLevels,
      id,
      name,
      onSubmit,
      player,
      reset,
      shortName,
      species,
    ],
  );

  return (
    <Form
      className={cx("react-aria-Form", { disabled })}
      onSubmit={onFormSubmit}
    >
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
        value={name}
        onChange={setName}
      >
        <Label>Name</Label>
        <Input />
        <FieldError />
      </TextField>{" "}
      <TextField
        isDisabled={disabled}
        value={shortName}
        onChange={setShortName}
      >
        <Label>Short Name</Label>
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
      <TextField
        isDisabled={disabled}
        isRequired
        value={beyondUrl}
        onChange={setBeyondUrl}
      >
        <Label>D&D Beyond URL</Label>
        <Input />
        <FieldError />
      </TextField>
      <PCClassLevels
        disabled={disabled}
        classLevels={classLevels}
        onUpdate={setClassLevels}
      />
      <MyButton isDisabled={disabled} type="submit">
        Submit
      </MyButton>
    </Form>
  );
}
