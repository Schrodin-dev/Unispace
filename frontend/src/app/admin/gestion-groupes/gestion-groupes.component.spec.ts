import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionGroupesComponent } from './gestion-groupes.component';

describe('GestionGroupesComponent', () => {
  let component: GestionGroupesComponent;
  let fixture: ComponentFixture<GestionGroupesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionGroupesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionGroupesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
