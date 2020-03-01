import { Project, Result } from "./Interfaces";
import { Observable, Subscriber } from "rxjs";

export class Optimization {
  private project: Project;
  constructor(project: Project) {
    this.project = project;
  }

  setConfig() {}
  getConfig() {}

  run() {
    let observable = new Observable(subscriber => {
      const depts = this.project.departments;
      let resultData = [];
      for (let i = 0; i < depts.length; i++) {
        let temp = [];
        for (let j = 0; j < depts.length; j++) {
          if (i === j) {
            temp.push({ id: `#${j}*`, color: depts[j].color });
          } else {
            temp.push({});
          }
        }
        resultData.push([...temp]);
      }
      subscriber.next({
        execTime: new Date(),
        startTime: new Date(),
        result: resultData
      } as Result);
      subscriber.complete();
    });

    return observable;
  }
}
