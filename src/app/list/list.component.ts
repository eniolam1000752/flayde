import {
  Component,
  OnInit,
  TemplateRef,
  Input,
  ContentChild,
  ElementRef
} from "@angular/core";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"]
})
export class ListComponent implements OnInit {
  @Input("renderItem")
  public renderItemFunc: Function;
  @Input()
  public renderData;
  @Input()
  public isCollapsed = false;

  @Input("renderItem")
  public renderItem: TemplateRef<ElementRef>;

  @ContentChild(TemplateRef, { static: false })
  public listItem: TemplateRef<ElementRef>;

  constructor() {}

  ngOnInit() {}
}
