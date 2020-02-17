interface Pos {
  x: number;
  y: number;
}
interface IJPos {
  i: number;
  j: number;
}
interface Dimension {
  width: number;
  height: number;
  area: number;
}
interface Result {
  execTime: number;
  startTime: number;
  result: string; // to be looked into
}
interface colInputData {
  id: string;
  value: number;
  pos: IJPos;
  departmentId: string;
}

interface rowInputData {
  rowData: Array<colInputData>;
  departmentId: string;
}

export interface MatrixData extends Array<rowInputData> {}

export interface InputConfig {
  id: string;
  name: string;
  matrix: MatrixData;
}

export interface Department {
  id: string;
  index: number;
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
  result: Result;
  activeInputConfig: InputConfig;
  inputConfigs: InputConfig[];
}
