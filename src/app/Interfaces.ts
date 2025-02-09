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
interface colInputData {
  id: string;
  value: number;
  pos: IJPos;
  departmentId: string;
  index: string;
}

interface rowInputData {
  rowData: Array<colInputData>;
  departmentId: string;
  index: string;
}

export interface Result {
  execTime: Date;
  startTime: Date;
  result: LayoutMatrix;
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

export interface User {
  createdDate: Date;
  lastVisitedDate: Date;
  appConfig: AppConfig;
  username: string;
  email: string;
  userId: string;
}

export interface Project {
  id: string;
  userId: string;
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
  layoutType: string;
}

export interface LayoutDept {
  color: string;
  id: string;
  deptId: string;
  area: number;
  width: number;
  height: number;
  breath: number;
  deptName: string;
  index: number;
}

export interface DeptRelationship {
  vRel: Rel[];
  hRel: Rel[];
}
interface Rel {
  deptId: string;
  relIndex: number;
}

export interface LayoutMatrix extends Array<Array<LayoutDept>> {}

export interface AppConfig {
  theme: string;
}
