import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainEdtComponent } from './main-edt.component';

describe('MainEdtComponent', () => {
  let component: MainEdtComponent;
  let fixture: ComponentFixture<MainEdtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainEdtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainEdtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
