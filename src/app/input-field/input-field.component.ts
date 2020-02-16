import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  DoCheck,
  OnChanges,
  SimpleChanges
} from "@angular/core";

@Component({
  selector: "app-input-field",
  templateUrl: "./input-field.component.html",
  styleUrls: ["./input-field.component.scss"]
})
export class InputFieldComponent implements OnInit, OnChanges {
  @Input("placeholder")
  public placeholder = "-- placeholder --";
  @Input("text")
  public text = "";
  @Input("message")
  public message = "";
  @Input("type")
  public type = "text";

  @Output("changeText")
  public changeText = new EventEmitter<any>();

  public value = "";

  constructor() {}

  ngOnInit() {}

  onTextChanged(event) {
    console.log("event");
    this.changeText.emit(this.value);
    this.value = this.text;
  }
  ngOnChanges() {
    this.value = this.text;
  }
}
