import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  OnChanges
} from "@angular/core";

interface ModalEvent {
  event: String;
  state: Boolean;
}

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"]
})
export class ModalComponent implements OnInit, OnChanges {
  @Output()
  public toggled = new EventEmitter<Boolean>();
  @Output()
  public clicked = new EventEmitter<ModalEvent>();

  @Input("allowBackLayClick")
  public allowBackLayClick = true;
  @Input("headerText")
  public headerText = "-- empty --";
  @Input("isLoading")
  public isLoading = false;

  public modalClass = { "modal-back-lay": true, hide: true };

  constructor() {}

  ngOnInit() {}
  toggleModal() {
    this.modalClass.hide = !this.modalClass.hide;
    this.toggled.emit(this.modalClass.hide);
  }
  onclicked(event) {
    if (this.allowBackLayClick) {
      this.toggleModal();
      this.clicked.emit({ event, state: this.modalClass.hide });
    }
  }
  contentClick(event) {
    event.stopPropagation();
  }

  ngOnChanges() {}
  onSubmit() {}
}
