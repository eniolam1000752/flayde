import {
  Component,
  OnInit,
  Input,
  OnChanges,
  DoCheck,
  SimpleChanges
} from "@angular/core";
import { TestServiceService } from "../test-service.service";

@Component({
  selector: "app-top-toast",
  templateUrl: "./top-toast.component.html",
  styleUrls: ["./top-toast.component.scss"]
})
export class TopToastComponent implements OnInit, OnChanges {
  @Input("showing")
  private _isShowing: Boolean = false;

  @Input("text")
  private text: String = "no text provied ???";

  @Input("cancelable")
  private cancelable: Boolean = false;

  @Input("position")
  private pos: String = "bottom";

  constructor(globals: TestServiceService) {}

  private timeoutHandler: any;

  ngOnInit() {
    console.log("toast component inited");
  }
  ngOnChanges(changes: SimpleChanges) {}

  public toggle = () => {
    this._isShowing = !this._isShowing;
  };

  public showToast = () => {
    this._isShowing = true;
  };

  public hideToast = () => {
    this._isShowing = false;
  };

  private cancel = () => {
    this.toggle();
  };
}
