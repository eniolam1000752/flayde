import { Component, OnInit, Input } from "@angular/core";
import { LayoutMatrix } from "../Interfaces";

@Component({
  selector: "app-rendrer",
  templateUrl: "./rendrer.component.html",
  styleUrls: ["./rendrer.component.scss"]
})
export class RendrerComponent implements OnInit {
  private isCtrlPressed = false;
  public zoomIndex = 1;

  @Input("data")
  public data: LayoutMatrix;
  @Input("isLoading")
  public isLoading: boolean = true;

  constructor() {}

  ngOnInit() {
    window.addEventListener("keydown", event => {
      this.isCtrlPressed = event.key === "Control";
    });
    window.addEventListener("keyup", event => {
      this.isCtrlPressed = event.key === "Control" ? false : true;
    });
  }

  zoomHandler(event) {
    if (event.ctrlKey) event.preventDefault();
    const delta = event.deltaY;
    let mockZoomIndex = this.zoomIndex;
    mockZoomIndex += 0.2 * ((-1 * delta) / 100);
    // console.log("zoom: ", mockZoomIndex, delta);
    if (event.ctrlKey && mockZoomIndex < 2.2 && mockZoomIndex > 0.5) {
      this.zoomIndex += 0.2 * ((-1 * delta) / 100);
    }
  }
  disableBrowserZoom(event) {
    if (event.ctrlKey) event.preventDefault();
  }
  ctrlPressed() {}
}
