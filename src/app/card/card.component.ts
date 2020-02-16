import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter
} from "@angular/core";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"]
})
export class CardComponent implements OnInit, OnChanges {
  @Input("active")
  public active = "false";
  @Output("clicked")
  public clicked = new EventEmitter();

  public cardClass = { card: true, active: true };

  constructor() {}

  ngOnInit() {
    console.log("inited card", this.active);
    this.cardClass.active = this.active === "true";
  }

  ngOnChanges() {
    // this.cardClass.active = this.active;
  }
  onClicked(event) {
    this.clicked.emit(event);
  }
}
