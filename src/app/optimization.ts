import {
  Project,
  Result,
  InputConfig,
  Department,
  DeptRelationship,
  LayoutDept
} from "./Interfaces";
import { Observable, Subscriber } from "rxjs";

export class Optimization {
  private project: Project;
  private dept: Department[];
  private relationShips: InputConfig;
  private HVDeptRelationShips = {};
  private sortedDept = [];
  private deptCount = 0;
  private result: Result = {} as Result;
  private deptObject = {};
  private placedDeptOnLayout = [];

  constructor(project: Project) {
    this.project = project;
    this.relationShips = this.project.activeInputConfig;
    this.dept = this.project.departments;
    this.deptCount = this.project.departments.length;

    this.deptObject = this.project.departments
      .map(item => {
        item.top = "";
        item.bottom = "";
        item.left = "";
        item.right = "";
        return item;
      })
      .reduce((cum, item) => ({ ...cum, [item.id]: item }), {});
  }

  setConfig() {}
  getConfig() {}

  private deptSequence() {
    console.log(this.project);
    let out = {};
    this.relationShips.matrix.forEach((rowRel, rowIndex) => {
      if (!out[rowRel.departmentId]) {
        out[rowRel.departmentId] = {
          ...({ vRel: [], hRel: [] } as DeptRelationship)
        };
      }
      rowRel.rowData.forEach((colRel, colIndex) => {
        // console.log(out, rowRel.departmentId, out[rowRel.departmentId]);
        if (rowIndex < colIndex) {
          out[rowRel.departmentId].hRel.push({
            deptId: colRel.departmentId,
            relIndex: colRel.value
          });
        }
        if (!out[colRel.departmentId]) {
          out[colRel.departmentId] = {
            ...({ vRel: [], hRel: [] } as DeptRelationship)
          };
        }
        if (rowIndex < colIndex) {
          out[colRel.departmentId].vRel.push({
            deptId: rowRel.departmentId,
            relIndex: colRel.value
          });
        }
      });
    });
    this.HVDeptRelationShips = out;
    console.log(out);
  }

  private sortDept() {
    // tslint:disable-next-line: forin
    for (let data in this.HVDeptRelationShips) {
      let temp = this.HVDeptRelationShips[data];
      let resultantRel =
        temp.vRel.reduce((cum, item) => cum + item.relIndex, 0) +
        temp.hRel.reduce((cum, item) => cum + item.relIndex, 0);
      this.sortedDept.push({ deptId: data, cumRelVal: resultantRel });
    }
    this.sortedDept.sort((a, b) => b.cumRelVal - a.cumRelVal);
  }

  private process() {
    this.deptSequence();
    this.sortDept();
    this.result = {
      result: new Array(this.deptCount * 2)
        .fill(" ")
        .map(item => new Array(this.deptCount * 2).fill("").map(item => ({}))),
      execTime: null,
      startTime: new Date()
    } as Result;
    const resultLen = this.result.result.length;
    console.log(this.sortedDept);

    this.sortedDept.forEach((item, index) => {
      if (index === 0) {
        this.result.result[resultLen / 2 - 1][resultLen / 2 - 1] = {
          id: "# " + index + "*",
          deptId: item.deptId,
          color: this.deptObject[item.deptId].color,
          deptName: this.deptObject[item.deptId].name,
          index: this.deptObject[item.deptId].index,
          area: this.deptObject[item.deptId].dimension.area
        } as LayoutDept;
        this.deptObject[item.deptId].pos = { x: 0, y: 0 };
        this.placedDeptOnLayout.push(item.deptId);
        this.checkAndPlace4Rel(item.deptId, resultLen);
      } else {
        if (!this.isDeptPlaced(item.deptId)) {
          let highestRel = { deptId: "", relDirection: "H", relIndex: -1 };
          // console.log(
          //   "****************** CHECKING PLACED DEPTS FOR REL WITH" +
          //     item.deptId +
          //     " **************************"
          // );
          for (let deptId of [...this.placedDeptOnLayout]) {
            const vRelIndex = this.HVDeptRelationShips[item.deptId].vRel.reduce(
              (cum, item) => (item.deptId === deptId ? item.relIndex : cum),
              null
            );

            const hRelIndex = this.HVDeptRelationShips[item.deptId].hRel.reduce(
              (cum, item) => (item.deptId === deptId ? item.relIndex : cum),
              null
            );
            // console.log("checking placed dept for rel: ", vRelIndex, hRelIndex);
            if (vRelIndex === null && vRelIndex >= highestRel.relIndex) {
              if (
                deptId.length !== 0 &&
                this.deptObject[deptId].top.length !== 0 &&
                this.deptObject[deptId].bottom.length !== 0
              ) {
                continue;
              }
              highestRel = {
                deptId,
                relDirection: "V",
                relIndex: vRelIndex
              };
            }
            if (hRelIndex === null && hRelIndex >= highestRel.relIndex) {
              if (
                deptId.length !== 0 &&
                this.deptObject[deptId].left.length !== 0 &&
                this.deptObject[deptId].right.length !== 0
              ) {
                continue;
              }
              highestRel = {
                deptId,
                relDirection: "H",
                relIndex: hRelIndex
              };
            }
            // console.log(
            //   "depts been placed checked: ",
            //   this.deptObject[deptId],
            //   vRelIndex,
            //   hRelIndex
            // );
          }
          // console.log(
          //   "************************* end of checking *******************"
          // );
          // console.log("highest val: ", highestRel);
          if (highestRel.relDirection === "H") {
            // console.log(
            //   "dept to be place horizontally around: ",
            //   highestRel,
            //   this.deptObject[highestRel.deptId]
            // );
            const pos = this.hPlacement(highestRel.deptId, item.deptId);
            console.log("position", pos);
            this.result.result[resultLen / 2 - 1 + pos.y][
              resultLen / 2 - 1 + pos.x
            ] = {
              id: "# " + index + "*",
              deptId: item.deptId,
              color: this.deptObject[item.deptId].color,
              deptName: this.deptObject[item.deptId].name,
              index: this.deptObject[item.deptId].index,
              area: this.deptObject[item.deptId].dimension.area
            } as LayoutDept;
          } else {
            const pos = this.vPlacement(highestRel.deptId, item.deptId);
            this.result.result[resultLen / 2 - 1 + pos.y][
              resultLen / 2 - 1 + pos.x
            ] = {
              id: "# " + index + "*",
              deptId: item.deptId,
              color: this.deptObject[item.deptId].color,
              deptName: this.deptObject[item.deptId].name,
              index: this.deptObject[item.deptId].index,
              area: this.deptObject[item.deptId].dimension.area
            } as LayoutDept;
          }
          this.placedDeptOnLayout.push(item.deptId);
          console.log(
            "for deptatment: " + item.deptId,
            " should be placed around: ",
            highestRel,
            this.placedDeptOnLayout
          );
        }
      }
    });
    console.log(this.result);
  }

  hasFourRelationship(deptId) {
    return this.HVDeptRelationShips[deptId].vRel
      .filter(item => item.relIndex === 4)
      .map(item => item.deptId)
      .concat(
        this.HVDeptRelationShips[deptId].hRel
          .filter(item => item.relIndex === 4)
          .map(item => item.deptId)
      );
  }
  hPlacement(aroundDeptId, deptToBePlacedId) {
    if (this.deptObject[aroundDeptId].left.length === 0) {
      this.deptObject[aroundDeptId].left = deptToBePlacedId;
      this.deptObject[deptToBePlacedId].right = aroundDeptId;
      this.deptObject[deptToBePlacedId].pos = {
        ...this.deptObject[aroundDeptId].pos,
        x: this.deptObject[aroundDeptId].pos.x - 1
      };
      return { ...this.deptObject[deptToBePlacedId].pos };
    }
    if (this.deptObject[aroundDeptId].right.length === 0) {
      this.deptObject[aroundDeptId].right = deptToBePlacedId;
      this.deptObject[deptToBePlacedId].left = aroundDeptId;
      this.deptObject[deptToBePlacedId].pos = {
        ...this.deptObject[aroundDeptId].pos,
        x: this.deptObject[aroundDeptId].pos.x + 1
      };
      return { ...this.deptObject[deptToBePlacedId].pos };
    }
  }
  vPlacement(aroundDeptId, deptToBePlacedId) {
    if (this.deptObject[aroundDeptId].top.length === 0) {
      this.deptObject[aroundDeptId].top = deptToBePlacedId;
      this.deptObject[deptToBePlacedId].bottom = aroundDeptId;
      this.deptObject[deptToBePlacedId].pos = {
        ...this.deptObject[aroundDeptId].pos,
        y: this.deptObject[aroundDeptId].pos.y - 1
      };
      return { ...this.deptObject[deptToBePlacedId].pos };
    }
    if (this.deptObject[aroundDeptId].bottom.length === 0) {
      this.deptObject[aroundDeptId].bottom = deptToBePlacedId;
      this.deptObject[deptToBePlacedId].top = aroundDeptId;
      this.deptObject[deptToBePlacedId].pos = {
        ...this.deptObject[aroundDeptId].pos,
        y: this.deptObject[aroundDeptId].pos.y + 1
      };
      return { ...this.deptObject[deptToBePlacedId].pos };
    }
  }
  isDeptPlaced(deptId) {
    return this.placedDeptOnLayout.indexOf(deptId) !== -1;
  }
  checkAndPlace4Rel(deptId, resultLen) {
    let count = 0;
    for (let item of this.HVDeptRelationShips[deptId].vRel) {
      if (count < 2 && item.relIndex === 4) {
        const pos = this.vPlacement(deptId, item.deptId);
        this.result.result[resultLen / 2 - 1 + pos.y][
          resultLen / 2 - 1 + pos.x
        ] = {
          id: "# " + "*",
          deptId: item.deptId,
          color: this.deptObject[item.deptId].color,
          deptName: this.deptObject[item.deptId].name,
          index: this.deptObject[item.deptId].index,
          area: this.deptObject[item.deptId].dimension.area
        } as LayoutDept;
        this.placedDeptOnLayout.push(item.deptId);
        ++count;
      }
    }
    for (const item of this.HVDeptRelationShips[deptId].hRel) {
      if (count < 2 && item.relIndex === 4) {
        console.log("around: ", deptId, " place: ", item.deptId);
        const pos = this.hPlacement(deptId, item.deptId);
        this.result.result[resultLen / 2 - 1 + pos.y][
          resultLen / 2 - 1 + pos.x
        ] = {
          id: "# " + "*",
          deptId: item.deptId,
          color: this.deptObject[item.deptId].color,
          deptName: this.deptObject[item.deptId].name,
          index: this.deptObject[item.deptId].index,
          area: this.deptObject[item.deptId].dimension.area
        } as LayoutDept;
        this.placedDeptOnLayout.push(item.deptId);
        ++count;
      }
    }
  }

  run() {
    const observable = new Observable(subscriber => {
      this.process();
      this.result.result = [...this.result.result].filter(row =>
        row.reduce((cum, col) => (!cum ? col.id !== undefined : true), false)
      );
      subscriber.next(this.result);
      subscriber.complete();
    });

    return observable;
  }
}
