// https://spin.atomicobject.com/typescript-flexible-nominal-typing/
interface Flavouring<FlavourT> {
  _type?: FlavourT;
}
type Flavour<T, FlavourT> = T & Flavouring<FlavourT>;

export type ClassName = Flavour<string, "ClassName">;
export type PCID = Flavour<string, "PCID">;
export type SessionID = Flavour<string, "SessionID">;
export type SpeciesName = Flavour<string, "SpeciesName">;
export type WebURL = Flavour<string, "WebURL">;

export type Seconds = Flavour<number, "Seconds">;
