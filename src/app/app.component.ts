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
import {
  Project,
  InputConfig,
  Department,
  MatrixData,
  LayoutMatrix,
  Result
} from "./Interfaces";
import { ToastComponent } from "./toast/toast.component";
import { Optimization } from "./optimization";

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

  @ViewChild("topToast", { static: false })
  public topToast: ToastComponent;

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

  public projectTypes: Array<string> = [
    "Process Layout",
    "Product Layout",
    "Combination layout",
    "Fixed position Layout",
    "Group Layout"
  ] as string[];

  public newProject: Project = {
    name: "",
    layoutType: this.projectTypes[0]
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
  public isLoading: boolean = false;
  public showSplash: boolean = true;
  public showDeleteProject: boolean = false;
  public weightCollapsed = true;

  public editSelectedRelationship: InputConfig = {} as InputConfig;
  public selectedProjectId = "";
  public resultData: LayoutMatrix;
  public isGenResult: boolean = true;
  public auth = { email: "", password: "", cpassword: "", username: "" };
  public signIn = { email: "", password: "" };
  public regMsg = "";
  public signInMsg = "";
  public currentUser: any = {};
  public allowModalDissmiss = true;

  constructor(public globals: TestServiceService) {
    console.log("app construcror");
  }

  ngOnInit() {
    this.weightCollapsed = false;
    window.addEventListener("keydown", event => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        if (!this.currentUser.email) {
          this.topToast.showToast();
        } else {
          if (!this.activeProject.id) return 0;
          const temp = { ...this.activeProject };
          console.log(temp);
          if (temp.result.result.length || temp.result.result.length === 0) {
            temp.result = {
              ...temp.result,
              result: this.objectifyArray(temp.result.result)
            };
          }
          this.globals.addProject(temp.id, temp).subscribe(
            resp => {
              this.toastMessage = "😁 No worries data has been saved";
              this.toastRef.showToast();
            },
            err => {
              this.toastMessage = "😬 Unable to save data";
              this.toastRef.showToast();
            }
          );
        }
      }
    });
  }
  ngAfterViewInit() {
    setTimeout(() => (this.weightCollapsed = true), 2000);
    const setShouldShowSplash = state => (this.showSplash = state);
    this.globals.onAuthStateChanged().subscribe(user => {
      if (user) this.initUserProject(user, setShouldShowSplash);
      else this.uninitUserProject(setShouldShowSplash);
    });
  }

  initUserProject(user, awaitFlag?) {
    console.log("user: ", user);
    this.currentUser = user || {};
    this.projects = [];
    this.indexedProjects = {};
    this.activeProject = {} as Project;
    this.opendProjects = [];
    this.globals.getProject(this.currentUser.uid).subscribe(
      collection => {
        console.log("collection list of projects: ", collection);
        collection.forEach(item => {
          const project: Project = item.data() as Project;
          project.result.result = Object.values(project.result.result);
          // console.log("doc items: ", item.data(), project);
          this.projects.push(project);
          this.indexedProjects[project.id] = project;
        });
        awaitFlag(false);
        this.collapseProjects();
        if (this.projects[0]) this.activeProject = this.projects[0];
        if (this.projects[0]) this.opendProjects.push(this.projects[0]);
      },
      err => {
        console.log("error getting projects: ", err);
        awaitFlag(false);
      }
    );
  }
  uninitUserProject(awaitFlag?) {
    this.currentUser = {};
    this.projects = [];
    this.indexedProjects = {};
    this.activeProject = {} as Project;
    this.opendProjects = [];
    awaitFlag(false);
  }

  generateLayoutMatrix = () => {
    if (!this.currentUser.email) {
      this.topToast.showToast();
      return 0;
    }
    console.log(this.activeProject, this.editSelectedRelationship);
    let optimizer = new Optimization(this.activeProject);
    this.isGenResult = false;
    let runner = optimizer.run();
    runner.subscribe((resp: Result) => {
      console.log(resp);
      this.activeProject.result = resp;
    });
  };

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
      case "email":
        this.auth.email = event;
        break;
      case "password":
        this.auth.password = event;
        break;
      case "cpassword":
        this.auth.cpassword = event;
        break;
      case "user":
        this.auth.username = event;
        break;
      case "semail":
        this.signIn.email = event;
        break;
      case "spassword":
        this.signIn.password = event;
        break;
      default:
        break;
    }
  }

  showAddLayoutProject() {
    if (this.currentUser.email) {
      this.modalContent = "layout";
      this.modalHeaderTitle = "Add new Layout project";
      this.toggleModal();
    } else {
      this.topToast.showToast();
    }
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
  showRegister() {
    this.modalContent = "register";
    this.modalHeaderTitle = "Sign Up";
    this.toggleModal();
    this.topToast.hideToast();
    this.allowModalDissmiss = false;
  }
  showLogin() {
    this.modalContent = "login";
    this.modalHeaderTitle = !this.currentUser.email ? "Sign In" : "Sign Out";
    this.toggleModal();
    this.topToast.hideToast();
    this.allowModalDissmiss = false;
  }
  showAlert() {}
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

  onSelectLayoutType(layout) {
    this.newProject.layoutType = layout;
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
      this.activeProject.activeInputConfig.matrix = this.weightMatrix;
    } else {
      this.editSelectedRelationship.matrix.forEach(item => {
        item.rowData.forEach(colItem => {
          if (colItem.id === id) colItem.value = value;
        });
      });
      this.activeProject.activeInputConfig = this.editSelectedRelationship;
    }
  }

  objectifyArray = (array: Array<any>) => {
    return array.reduce((cum, item, index) => {
      cum[index] = item;
      return cum;
    }, {});
  };

  createNewProject() {
    try {
      this.projectAddValidation();
      const projectClone: Project = {
        ...this.newProject,
        id: `project-${(Math.random() + "").slice(2, 15)}`,
        userId: this.currentUser.uid,
        departments: [],
        created: new Date(),
        numberOfDept: 0,
        firstExec: null,
        deleteDate: null,
        isDeleted: false,
        isRunning: false,
        lastExec: null,
        inputConfigs: [],
        activeInputConfig: {},
        description: "No description provided for this project.",
        result: { result: [[]] } as Result
      } as Project;
      const temp = Object.assign({}, projectClone);
      console.log(temp);
      if (temp.result.result.length || temp.result.result.length === 0) {
        temp.result.result = this.objectifyArray(temp.result.result);
      }

      this.isLoading = true;
      this.globals.addProject(projectClone.id, temp).subscribe(
        resp => {
          console.log("project added successfully: ", resp);
          this.projects.push(projectClone);
          this.indexedProjects[projectClone.id] = projectClone;
          this.loadSelectedProject(projectClone);
          this.collapseProjects();
          this.isLoading = false;
          this.toggleModal();
          this.newProjectInputFieldMsg = "";
        },
        err => {
          this.isLoading = false;
          console.log("error adding project: ", err);
        }
      );
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
    this.weightMatrix = this.activeProject.departments.map((row, rowIndex) => ({
      rowData: this.activeProject.departments.map((col, colIndex) => ({
        id: `value-${(Math.random() + "").slice(2, 15)}`,
        value: 0,
        pos: { i: rowIndex, j: colIndex },
        departmentId: col.id,
        index: colIndex.toString()
      })),
      departmentId: row.id,
      index: rowIndex.toString()
    })) as MatrixData;
  }

  selectProject(project: Project, id) {
    this.activeProject = this.indexedProjects[id];
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
      position: { x: 0, y: 0 },
      index: { ...this.activeProject }.departments.length + 1
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

  logoutUser() {
    this.globals.logoutUser().subscribe(
      resp => {
        console.log("user logged out: ", resp);
        // this.toggleModal();
      },
      err => {
        console.log("unable to logout user: ", err);
      }
    );
    this.currentUser = {};
  }

  loginUser() {
    console.log("login in user: ", this.signIn);
    if (this.signIn.password.trim().length === 0) {
      this.toastMessage = "password field can not be empty";
      this.signInMsg = "password field can not be empty";
      this.toastRef.showToast();
      return 0;
    }
    if (this.signIn.email.trim().length === 0) {
      this.toastMessage = "email field can not be empty";
      this.signInMsg = "email field can not be empty";
      this.toastRef.showToast();
      return 0;
    }
    this.isLoading = true;
    this.signInMsg = "";
    setTimeout(() => {
      this.signIn.password = "";
    }, 2000);
    this.globals.loginUser(this.signIn.email, this.signIn.password).subscribe(
      resp => {
        console.log("user: ", resp);
        // this.initUserProject(resp.user);
        this.allowModalDissmiss = true;
        this.isLoading = false;
        this.toastMessage = "Welcome " + resp.user.email;
        this.toastRef.toggle();
        this.toggleModal();
      },
      err => {
        console.log("not signed in: ", err);
        this.toastMessage = err.message;
        this.signInMsg = err.message;
        this.isLoading = false;
        this.toastRef.showToast();
      }
    );
  }

  registerUser() {
    console.log("signing up user: ", this.auth);
    if (this.auth.password !== this.auth.cpassword) {
      this.toastMessage = "confirm password does not corrolate";
      this.regMsg = "confirm password does not corrolate";
      this.toastRef.showToast();
      return 0;
    }
    if (this.auth.password.trim().length === 0) {
      this.toastMessage = "password field can not be empty";
      this.regMsg = "password field can not be empty";
      this.toastRef.showToast();
      return 0;
    }
    if (this.auth.email.trim().length === 0) {
      this.toastMessage = "email field can not be empty";
      this.regMsg = "email field can not be empty";
      this.toastRef.showToast();
      return 0;
    }
    this.isLoading = true;
    this.globals.signUpUser(this.auth).subscribe(
      resp => {
        console.log(resp);
        this.globals.addUser(resp.user.uid, this.auth).subscribe(
          fireStoreAdded => {
            console.log("add to fire store: ", fireStoreAdded);
            this.allowModalDissmiss = true;
            this.isLoading = false;
          },
          fireStoreErr => {
            console.log("not added to firestore: ", fireStoreErr);
            this.isLoading = false;
          }
        );
      },
      err => {
        console.log(err);
        this.toastMessage = err.message;
        this.regMsg = err.message;

        this.isLoading = false;
        this.toastRef.showToast();
      }
    );
  }

  public statusClicked() {
    this.showLogin();
  }

  public deleteProject(project: Project) {
    this.globals.removeProject(project.id).subscribe(
      resp => {
        console.log("delete success: ", resp);
        delete this.indexedProjects[project.id];
        this.projects = Object.values(this.indexedProjects);
        this.opendProjects = this.opendProjects.filter(
          item => item.id !== project.id
        );
        this.activeProject = this.projects[0] || ({} as Project);
      },
      err => {
        console.log("unable to delete project: ", err);
      }
    );
  }
  public deleteDept(event, dept: Department) {
    this.activeProject.departments = this.activeProject.departments.filter(
      (item: Department) => item.id !== dept.id
    );
    const temp = { ...this.activeProject };
    if (temp.result.result.length || temp.result.result.length === 0) {
      temp.result = {
        ...temp.result,
        result: this.objectifyArray(temp.result.result)
      };
    }
    console.log("deleting department", temp);
    this.globals.addProject(temp.id, temp).subscribe(
      resp => {
        console.log("data has been deleted");
      },
      err => {
        console.log("error deleting data");
      }
    );
  }

  removeRelConfig(deptId) {
    this.activeProject.inputConfigs.filter(item => item.matrix.map);
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
