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
  private _isShowing: Boolean = true;

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
  ngOnChanges(changes: SimpleChanges) {
    console.log("toast did change: ", changes);
  }

  public toggle = () => {
    this._isShowing = !this._isShowing;
  };

  private cancel = () => {
    this.toggle();
  };
}
