export interface PC {
  id: string;
  name: string;
  player: string;
  species: string;
  classLevels: ClassLevel[];
}

export interface ClassLevel {
  name: string;
  level: number;
  subclass?: string;
}
