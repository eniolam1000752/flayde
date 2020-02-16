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
import { Project } from "./Interfaces";

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
  public weightMatrix;
  public selectedInputWeightObj = {};

  public newProject: Project = { name: "" } as Project;
  public projects: Project[] = [];
  public opendProjects: Project[] = [];

  constructor(public globals: TestServiceService) {
    console.log("app construcror");
  }

  ngOnInit() {
    // this.globals.addUser();
    this.weightMatrix = new Array(6).fill(2).map((item, rowIndex) => ({
      rowData: new Array(6).fill(2).map((item, colIndex) => ({
        id: `${Math.random()}`,
        value: 0,
        pos: { i: rowIndex, j: colIndex },
        departmentId: colIndex
      })),
      departmentId: rowIndex
    }));
  }
  ngAfterViewInit() {
    // this.showAddInputConfig();
  }

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
    const projectClone: Project = { ...this.newProject } as Project;
    projectClone.id = `project-${Math.random()}`;
    projectClone.departments = [];
    projectClone.numberOfDept = projectClone.departments.length;
    projectClone.created = new Date();
    projectClone.description = "";
    projectClone.firstExec = null;
    projectClone.deleteDate = null;
    projectClone.isDeleted = false;
    projectClone.isRunning = false;
    projectClone.lastExec = null;

    this.projects.push(projectClone);
    this.collapseProjects();
    this.toggleModal();
  }

  loadSelectedProject(selectedProject) {
    console.log(selectedProject);
  }
}
