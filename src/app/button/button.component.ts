import {
  Component,
  OnInit,
  Input,
  Output,
  OnDestroy,
  EventEmitter,
  OnChanges,
  DoCheck,
  SimpleChanges,
  AfterContentChecked,
  AfterViewInit,
  ViewChild,
  ContentChild,
  AfterViewChecked,
  AfterContentInit,
} from "@angular/core";
import { TestServiceService } from "../test-service.service";

import { interval, Subscription } from "rxjs";
import { take, map } from "rxjs/operators";

enum BtnTypes {
  "flat",
  "fab",
  "disabled",
}

@Component({
  selector: "app-button",
  templateUrl: "./button.component.html",
  styleUrls: ["./button.component.scss"],
})
export class ButtonComponent implements OnInit, OnChanges {
  @Input()
  public text: String;
  @Input()
  public type: String;
  @Input("bgcolor")
  public bgColor: String;
  @Input("color")
  public color: String;
  @Input()
  public noBorder = false;

  @Output()
  public clicked = new EventEmitter<any>();

  public shouldShow = true;
  public btnText = "";
  public data = "";
  public btnClass = {
    flat: false,
    round: false,
    fab: false,
    rounded: false,
    btn: true,
    fill: false,
  };
  public customStyle = {};

  constructor(public globals: TestServiceService) {}
  ngOnChanges(): void {
    this.customStyle = { "background-color": this.bgColor, color: this.color };
  }

  ngOnInit() {
    this.btnClass.flat = this.type === "flat";
    this.btnClass.fab = this.type === "fab";
    this.btnClass.round = this.type === "round";
    this.btnClass.rounded = this.type === "rounded";
    this.btnClass.fill = this.type === "fill";

    // this.customStyle = {
    //   ...this.customStyle,
    // };
  }

  onClick = (args) => {
    this.clicked.emit(args);
  };
}
