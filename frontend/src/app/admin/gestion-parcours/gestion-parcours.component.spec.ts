import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionParcoursComponent } from './gestion-parcours.component';

describe('GestionParcoursComponent', () => {
  let component: GestionParcoursComponent;
  let fixture: ComponentFixture<GestionParcoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionParcoursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionParcoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
