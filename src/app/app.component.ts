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
  Predicate,
  Input
} from "@angular/core";
import { TestServiceService } from "./test-service.service";
import { ModalComponent } from "./modal/modal.component";
import { ButtonComponent } from "./button/button.component";
import { LayoutComponent } from "./layout/layout.component";
import { Project, InputConfig, Department, MatrixData } from "./Interfaces";
import { ToastComponent } from "./toast/toast.component";

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

  @ViewChild("toast", { static: false })
  public toastRef: ToastComponent;

  public collapsableClass = { collapsable: true, "no-collapse": true };
  public modalContent = "";
  public modalHeaderTitle = "";
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
  public legend = [
    { code: "A", value: 4, priority: "Aboslutely Necessary" },
    { code: "E", value: 3, priority: "Especially important" },
    { code: "I", value: 2, priority: "Important" },
    { code: "O", value: 1, priority: "Oridinary" },
    { code: "U", value: 0, priority: "Unimportant" },
    { code: "X", value: -1, priority: "Undesirable" }
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
  public newRelationshipInputFieldMsg: string = "";
  public activeProject: Project = { name: "" } as Project;

  public deptAlias: string = "";
  public inputAlias: string = "";
  public toastMessage: string = "";

  public editSelectedRelationship: InputConfig = {} as InputConfig;
  public selectedProjectId = "";

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

  public toggleModal() {
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
      case "relationship":
        this.inputAlias = event;
        break;
      case "e-relationship":
        this.editSelectedRelationship.name = event;
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
    if (this.activeProject.id) {
      this.modalContent = "department";
      this.modalHeaderTitle = "Add Department";
      this.toggleModal();
    } else {
      this.toastMessage = "😠 Create a project before you add a Department";
      this.toastRef.showToast();
    }
  }
  showAddInputConfig() {
    if (!this.activeProject.departments) {
      this.toastMessage =
        "😠 Number of department should be greater than 2 to provide a relationship";
      this.toastRef.showToast();
      return 0;
    }
    if (this.activeProject.departments.length <= 2) {
      this.toastMessage =
        "😠 Number of department should be greater than to provide a relationship";
      this.toastRef.showToast();
      return 0;
    }
    if (this.activeProject.id) {
      this.modalContent = "inputConfig";
      this.modalHeaderTitle = "Add Departmental Relationships";
      this.loadInputConfig();
      this.toggleModal();
    } else {
      this.toastMessage = "😠 Create a project before you add a relationship";
      this.toastRef.showToast();
    }
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
  selectWeightValue(value, id, isEdit?) {
    if (!isEdit) {
      this.weightMatrix.forEach(item => {
        item.rowData.forEach(colItem => {
          if (colItem.id === id) colItem.value = value;
        });
      });
    } else {
      this.editSelectedRelationship.matrix.forEach(item => {
        item.rowData.forEach(colItem => {
          if (colItem.id === id) colItem.value = value;
        });
      });
    }
  }

  createNewProject() {
    try {
      this.projectAddValidation();
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
        lastExec: null,
        inputConfigs: [],
        activeInputConfig: {}
      } as Project;

      this.projects.push(projectClone);
      this.indexedProjects[projectClone.id] = projectClone;
      this.loadSelectedProject(projectClone);
      this.collapseProjects();
      this.toggleModal();
      this.newProjectInputFieldMsg = "";
    } catch (exp) {
      this.newProjectInputFieldMsg = exp.message;
      this.toastMessage = exp.message;
      this.toastRef.showToast();
    }
  }

  loadSelectedProject(selectedProject: Project) {
    console.log(selectedProject);
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
          id: `value-${(Math.random() + "").slice(2, 15)}`,
          value: 0,
          pos: { i: rowIndex, j: colIndex },
          departmentId: colIndex.toString()
        })),
        departmentId: rowIndex.toString()
      })
    ) as MatrixData;
  }

  selectProject(project: Project, id) {
    this.activeProject = this.indexedProjects[id];
    // this.loadInputConfig();
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
      this.indexedProjects[
        id
      ].numberOfDept = this.activeProject.departments.length;
      this.activeProject.numberOfDept = this.activeProject.departments.length;

      // this.loadInputConfig();
      this.toggleModal();

      this.newDeptInputFieldMsg = "";
      this.deptAlias = "";
      this.selectedColor = this.colorList[0];
      this.modelDim = { width: 0, height: 0, area: 0 };
    } catch (exp) {
      console.log(exp.message);
      this.newDeptInputFieldMsg = exp.message;
      this.toastMessage = exp.message;
      this.toastRef.showToast();
    }
  }

  addRelationshipsToProject() {
    try {
      this.relationshipValidation();
      const projectId = this.activeProject.id;
      const relationship: InputConfig = {
        id: `relationship-${(Math.random() + "").slice(2, 15)}`,
        name: this.inputAlias,
        matrix: [...this.weightMatrix]
      } as InputConfig;

      this.indexedProjects[projectId].inputConfigs.push(relationship);
      this.indexedProjects[projectId].activeInputConfig = relationship;
      this.inputAlias = "";
      this.toggleModal();
    } catch (exp) {
      this.newRelationshipInputFieldMsg = exp.message;
      this.toastMessage = exp.message;
      this.toastRef.showToast();
    }
  }

  selectRelationships(relationShip: InputConfig) {
    this.indexedProjects[
      this.activeProject.id
    ].activeInputConfig = relationShip;
  }

  editRelationships(relationShip: InputConfig) {
    this.editSelectedRelationship = relationShip;
    this.modalHeaderTitle = "Edit Relation ship for :";
    this.modalContent = "e-inputConfig";
    this.toggleModal();
    console.log(this.editSelectedRelationship);
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

  private projectAddValidation() {
    if (!/\w+/.test(this.newProject.name)) {
      throw new Error("provide a project alias/name");
    }
    for (let item of this.projects) {
      if (item.name === this.newProject.name) {
        throw new Error(
          "Project alias/name has been used please choose another"
        );
      }
    }
  }

  private relationshipValidation() {
    if (!/\w+/.test(this.inputAlias)) {
      throw new Error("provide a Relationship alias/name");
    }
    for (let item of this.indexedProjects[this.activeProject.id].inputConfigs) {
      if (item.name === this.inputAlias) {
        throw new Error(
          "Relationship alias/name has been used please choose another"
        );
      }
    }
  }
}
