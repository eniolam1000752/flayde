import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopToastComponent } from './top-toast.component';

describe('TopToastComponent', () => {
  let component: TopToastComponent;
  let fixture: ComponentFixture<TopToastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopToastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
