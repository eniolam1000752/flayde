import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { Project } from "../Interfaces";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"],
  exportAs: "layout"
})
export class LayoutComponent implements OnInit {
  @Input("activeProject")
  public activeProject: Project = {} as Project;

  public layoutRightClass = {};

  constructor() {}

  ngOnInit() {
    this.layoutRightClass = {
      "right-hide": false,
      "layout-right": true,
      "right-show": true
    };
  }

  public colapseRightPane = () => {
    this.layoutRightClass["right-hide"] = !this.layoutRightClass["right-hide"];
    this.layoutRightClass["right-show"] = !this.layoutRightClass["right-show"];
  };
}
