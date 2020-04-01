import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { LayoutMatrix } from "../Interfaces";

@Component({
  selector: "app-rendrer",
  templateUrl: "./rendrer.component.html",
  styleUrls: ["./rendrer.component.scss"]
})
export class RendrerComponent implements OnInit, OnChanges {
  private isCtrlPressed = false;
  public zoomIndex = 1;
  public zoomIndexReverse = 1;

  @Input("data")
  public data: LayoutMatrix;
  @Input("isLoading")
  public isLoading: boolean = true;
  @Input("renderMode")
  public renderMode = "plant";

  constructor() {}

  ngOnInit() {
    window.addEventListener("keydown", event => {
      this.isCtrlPressed = event.key === "Control";
    });
    window.addEventListener("keyup", event => {
      this.isCtrlPressed = event.key === "Control" ? false : true;
    });
  }

  ngOnChanges() {
    console.log(this.data);
  }

  zoomHandler(event) {
    if (event.ctrlKey) event.preventDefault();
    const delta = event.deltaY;
    let mockZoomIndex = this.zoomIndex;
    mockZoomIndex += 0.2 * ((-1 * delta) / 100);
    if (event.ctrlKey && mockZoomIndex < 2.2 && mockZoomIndex > 0.5) {
      this.zoomIndex += 0.2 * ((-1 * delta) / 100);
      // if (delta === Math.abs(delta)) {
      this.zoomIndexReverse += delta * 0.0009;
      console.log("zoom: ", delta, this.zoomIndexReverse);
      // } else {
      // }
    }
  }
  disableBrowserZoom(event) {
    if (event.ctrlKey) event.preventDefault();
  }
  ctrlPressed() {}
  resetZoom() {
    this.zoomIndex = 1;
    this.zoomIndexReverse = 1;
  }
}
