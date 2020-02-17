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
  selector: "app-toast",
  templateUrl: "./toast.component.html",
  styleUrls: ["./toast.component.scss"]
})
export class ToastComponent implements OnInit, OnChanges {
  @Input("showing")
  private _isShowing: Boolean = false;

  @Input("text")
  private text: String = "no text provied ???";

  @Input("cancelable")
  private cancelable: Boolean = false;

  @Input("position")
  private pos: String = "bottom";

  constructor(globals: TestServiceService) {}

  ngOnInit() {
    console.log("toast component inited");
  }
  ngOnChanges(changes: SimpleChanges) {}

  public toggle = () => {
    this._isShowing = !this._isShowing;
    if (this._isShowing) {
      setTimeout(() => {
        this.hideToast();
      }, 3000);
    }
  };

  public showToast = () => {
    this._isShowing = true;
    setTimeout(() => {
      this.hideToast();
    }, 3000);
  };

  public hideToast = () => {
    this._isShowing = false;
  };

  private cancel = () => {
    this.toggle();
  };
}
