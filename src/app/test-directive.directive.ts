import { Directive, Input, OnInit } from "@angular/core";

@Directive({
  selector: "away"
})
export class TestDirectiveDirective implements OnInit {
  @Input()
  public id = "";

  ngOnInit(): void {
    console.log("directive id: ", this.id);
  }
  constructor() {}
}
