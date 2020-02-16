export interface Pos {
  x: number;
  y: number;
}
export interface Dimension {
  width: number;
  height: number;
  area: number;
}

export interface Department {
  id: string;
  name: string;
  color: string;
  created: Date;
  position: Pos;
  dimension: Dimension;
  left: string;
  right: string;
  top: string;
  bottom: string;
}

export interface User {}

export interface Project {
  id: string;
  name: string;
  description: string;
  created: Date;
  departments: Department[];
  numberOfDept: number;
  isRunning: boolean;
  lastExec: Date;
  firstExec: Date;
  owner: User;
  sharedTo: User;
  isDeleted: boolean;
  deleteDate: Date;
}
