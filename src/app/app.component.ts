import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  AfterViewChecked,
  QueryList,
  DoCheck,
  ContentChild,
  AfterContentInit,
  AfterContentChecked,
  OnChanges,
  Predicate
} from "@angular/core";
import { TestServiceService } from "./test-service.service";
import { ModalComponent } from "./modal/modal.component";
import { ButtonComponent } from "./button/button.component";
import { LayoutComponent } from "./layout/layout.component";
import { Project, InputConfig, Department, MatrixData } from "./Interfaces";

interface ColorObj {
  color: string;
  id: number;
}
interface DimObj {
  width: number;
  height: number;
  area: number;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild("layout", { static: false })
  public layoutRef: LayoutComponent;

  @ViewChild("modal", { static: false })
  public modalRef: ModalComponent;

  public toastText = "";
  public collapsableClass = { collapsable: true, "no-collapse": true };
  public modalContent = "inputConfig";
  public modalHeaderTitle = "Add Departmental Relationships";
  public colorList: ColorObj[] = [
    { color: "#f90", id: 0 },
    { color: "#090", id: 1 },
    { color: "#f00", id: 2 },
    { color: "#0f0", id: 3 },
    { color: "#000", id: 4 },
    { color: "#f9f", id: 5 },
    { color: "#09f", id: 6 },
    { color: "#293", id: 7 },
    { color: "#5ca", id: 8 },
    { color: "#ac8", id: 9 },
    { color: "#999", id: 10 },
    { color: "#555", id: 11 },
    { color: "#cba", id: 12 },
    { color: "#e08", id: 13 },
    { color: "#092", id: 14 }
  ];

  public selectedColor: ColorObj = this.colorList[0];
  public modelDim: DimObj = { width: 0, height: 0, area: 0 };
  public weightMatrix: MatrixData;
  public selectedInputWeightObj = {};

  public newProject: Project = {
    name: "",
    description: "No description provided for this project."
  } as Project;
  public projects: Project[] = [];
  public indexedProjects: any = {};
  public opendProjects: Project[] = [];
  public newProjectInputFieldMsg: string = "";
  public newDeptInputFieldMsg: string = "";
  public activeProject: Project = { name: "eni" } as Project;

  public deptAlias: string = "";

  constructor(public globals: TestServiceService) {
    console.log("app construcror");
  }

  ngOnInit() {}
  ngAfterViewInit() {}

  toggleRightPane() {
    this.layoutRef.colapseRightPane();
  }
  toogleCollapse() {
    this.collapsableClass["no-collapse"] = !this.collapsableClass[
      "no-collapse"
    ];
  }
  collapseProjects() {
    this.collapsableClass["no-collapse"] = false;
  }
  unCollapseProjects() {
    this.collapsableClass["no-collapse"] = true;
  }

  private toggleModal() {
    this.modalRef.toggleModal();
  }

  onTextChanged(event, inputCategory) {
    switch (inputCategory) {
      case "project":
        this.newProject.name = event;
        break;
      case "dept":
        this.deptAlias = event;
        break;
      default:
        break;
    }
  }

  showAddLayoutProject() {
    this.modalContent = "layout";
    this.modalHeaderTitle = "Add new Layout project";
    this.toggleModal();
  }
  showAddLayoutDepartment() {
    this.modalContent = "department";
    this.modalHeaderTitle = "Add Department";
    this.toggleModal();
  }
  showAddInputConfig() {
    this.modalContent = "inputConfig";
    this.modalHeaderTitle = "Add Departmental Relationships";
    this.toggleModal();
  }
  onSelectColor(colorObj) {
    this.selectedColor = colorObj;
  }

  onEnterDim(event, type) {
    switch (type) {
      case "w":
        this.modelDim.width =
          event.length <= 3 ? Number(event) : this.modelDim.width;
        this.modelDim.area = this.modelDim.width * this.modelDim.height;
        break;
      case "h":
        this.modelDim.height =
          event.length <= 3 ? Number(event) : this.modelDim.height;
        this.modelDim.area = this.modelDim.width * this.modelDim.height;
        break;
      case "a":
        this.modelDim.area =
          event.length <= 3 ? Number(event) : this.modelDim.area;
        break;
      default:
        break;
    }
  }
  setSelectedInputWeight(event, data) {
    if (event) event.stopPropagation();

    if (!(data.pos.i >= data.pos.j)) {
      this.selectedInputWeightObj = data;
    } else {
      this.selectedInputWeightObj = {};
    }
  }
  selectWeightValue(value, id) {
    this.weightMatrix.forEach(item => {
      item.rowData.forEach(colItem => {
        if (colItem.id === id) colItem.value = value;
      });
    });
  }

  createNewProject() {
    for (let item of this.projects) {
      console.log(item);
      if (item.name === this.newProject.name) {
        console.log("project name has been use. Please chose another");
        this.newProjectInputFieldMsg =
          "project name had been used. Choose another";
        return 0;
      }
    }

    const projectClone: Project = {
      ...this.newProject,
      id: `project-${(Math.random() + "").slice(2, 15)}`,
      departments: [],
      created: new Date(),
      numberOfDept: 0,
      firstExec: null,
      deleteDate: null,
      isDeleted: false,
      isRunning: false,
      lastExec: null
    } as Project;

    this.projects.push(projectClone);
    this.indexedProjects[projectClone.id] = projectClone;
    this.loadSelectedProject(projectClone);
    this.collapseProjects();
    this.toggleModal();
    this.newProjectInputFieldMsg = "";
  }

  loadSelectedProject(selectedProject: Project) {
    // console.log(selectedProject);
    this.selectProject(selectedProject, selectedProject.id);
    for (let project of this.opendProjects) {
      if (project.id === selectedProject.id) {
        return 0;
      }
    }
    this.opendProjects.push({ ...selectedProject });
  }

  loadInputConfig() {
    this.weightMatrix = this.activeProject.departments.map(
      (item, rowIndex) => ({
        rowData: this.activeProject.departments.map((item, colIndex) => ({
          id: `${Math.random()}`,
          value: 0,
          pos: { i: rowIndex, j: colIndex },
          departmentId: colIndex.toString()
        })),
        departmentId: rowIndex.toString()
      })
    ) as MatrixData;
  }

  selectProject(project: Project, id) {
    this.activeProject = project;
    this.loadInputConfig();
    console.log(this.projects);
  }

  addDeptToProject(project: Project, id) {
    let deptTemp: Department = {
      id: `dept-${(Math.random() + "").slice(2, 15)}`,
      name: this.deptAlias,
      color: { ...this.selectedColor }.color,
      created: new Date(),
      dimension: { ...this.modelDim } as DimObj,
      left: "",
      right: "",
      top: "",
      bottom: "",
      position: { x: 0, y: 0 }
    } as Department;

    try {
      this.departmentAddValidation(deptTemp, project);
      this.activeProject.departments.push(deptTemp);
      this.indexedProjects[id].numberOfDept = project.departments.length;

      this.loadInputConfig();
      this.toggleModal();

      this.newDeptInputFieldMsg = "";
      this.deptAlias = "";
      this.selectedColor = this.colorList[0];
      this.modelDim = { width: 0, height: 0, area: 0 };
    } catch (exp) {
      console.log(exp.message);
      this.newDeptInputFieldMsg = exp.message;
    }
  }

  private departmentAddValidation(deptInstance: Department, project: Project) {
    if (!/\w+/.test(deptInstance.name)) {
      throw new Error("provide a department alias");
    }
    if (deptInstance.dimension.width === 0) {
      throw new Error("width of department can not be zero (0)");
    }
    if (deptInstance.dimension.height === 0) {
      throw new Error("height of department can not be zero (0)");
    }
    for (let dept of project.departments) {
      if (dept.color === deptInstance.color) {
        throw new Error("color value has been used. choose another.");
      }
      if (dept.name === deptInstance.name) {
        throw new Error("name has been used. choose another");
      }
    }
  }
}
