import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdtWeekComponent } from './edt-week.component';

describe('EdtWeekComponent', () => {
  let component: EdtWeekComponent;
  let fixture: ComponentFixture<EdtWeekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdtWeekComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EdtWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
