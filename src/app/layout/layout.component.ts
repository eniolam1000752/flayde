import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { Project } from "../Interfaces";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"],
  exportAs: "layout",
})
export class LayoutComponent implements OnInit {
  @Input()
  public activeProject: Project = {} as Project;

  @Input("user")
  public annotation: string = null;

  @Output()
  public statusClicked = new EventEmitter();
  @Output()
  public leftMenuClicked = new EventEmitter();
  @Output()
  public rightMenuClicked = new EventEmitter();

  public isShownLeft = false;
  public layoutRightClass = {
    "right-hide": false,
    "layout-right": true,
    "right-show": true,
    show: false,
  };

  constructor() {}

  ngOnInit() {
    this.layoutRightClass = {
      "right-hide": false,
      "layout-right": true,
      "right-show": true,
      show: false,
    };
  }

  public colapseRightPane = () => {
    this.layoutRightClass["right-hide"] = !this.layoutRightClass["right-hide"];
    this.layoutRightClass["right-show"] = !this.layoutRightClass["right-show"];
  };

  public clickStatus(event) {
    this.statusClicked.emit(event);
  }
  public toogleLeftDrawer() {
    this.isShownLeft = !this.isShownLeft;
  }
  public tooggleRightDrawer() {
    this.layoutRightClass.show = !this.layoutRightClass.show;
  }
}
