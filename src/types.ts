export interface PC {
  id: string;
  name: string;
  shortName?: string;
  player: string;
  species: string;
  classLevels: ClassLevel[];
  beyondUrl: string;
}

export interface ClassLevel {
  name: string;
  level: number;
  subclass?: string;
}

export interface Session {
  id: string;
  name: string;
  date: string;
  dm: string;
  pcs: string[];
}
