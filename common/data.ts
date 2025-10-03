import type {
  ClassName,
  PCID,
  SessionID,
  SpeciesName,
  WebURL,
} from "./flavours";

export const classNames: ClassName[] = [
  "Barbarian",
  "Bard",
  "Cleric",
  "Druid",
  "Fighter",
  "Monk",
  "Paladin",
  "Ranger",
  "Rogue",
  "Sorcerer",
  "Warlock",
  "Wizard",
];
export function isClassName(value: string): value is ClassName {
  return classNames.includes(value);
}

export const speciesNames: SpeciesName[] = [
  "Aasimar",
  "Dragonborn (Black)",
  "Dragonborn (Blue)",
  "Dragonborn (Brass)",
  "Dragonborn (Bronze)",
  "Dragonborn (Copper)",
  "Dragonborn (Gold)",
  "Dragonborn (Green)",
  "Dragonborn (Red)",
  "Dragonborn (Silver)",
  "Dragonborn (White)",
  "Dwarf",
  "Elf (Drow)",
  "Elf (High)",
  "Elf (Wood)",
  "Gnome (Forest)",
  "Gnome (Rock)",
  "Goliath (Cloud)",
  "Goliath (Fire)",
  "Goliath (Frost)",
  "Goliath (Hill)",
  "Goliath (Stone)",
  "Goliath (Storm)",
  "Halfling",
  "Human",
  "Orc",
  "Tiefling (Abyssal)",
  "Tiefling (Chthonic)",
  "Tiefling (Infernal)",
];
export function isSpeciesName(value: string): value is SpeciesName {
  return speciesNames.includes(value);
}

const isStringFlavour = <T extends string>(value: string): value is T => true;

export const isPCID = isStringFlavour<PCID>;
export const isSessionID = isStringFlavour<SessionID>;
export const isWebURL = isStringFlavour<WebURL>;
