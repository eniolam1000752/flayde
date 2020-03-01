import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-splash",
  templateUrl: "./splash.component.html",
  styleUrls: ["./splash.component.scss"]
})
export class SplashComponent implements OnInit {
  @Input()
  public shouldShow = false;
  @Input()
  public slashText = "";

  constructor() {}

  ngOnInit() {}
}
