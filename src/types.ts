export interface PC {
  name: string;
  player: string;
  classLevels: ClassLevel[];
}

export interface ClassLevel {
  name: string;
  level: number;
  subclass?: string;
}
