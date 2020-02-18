import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RendrerComponent } from './rendrer.component';

describe('RendrerComponent', () => {
  let component: RendrerComponent;
  let fixture: ComponentFixture<RendrerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RendrerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RendrerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
