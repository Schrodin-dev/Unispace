import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionUeRessourcesComponent } from './gestion-ue-ressources.component';

describe('GestionUeRessourcesComponent', () => {
  let component: GestionUeRessourcesComponent;
  let fixture: ComponentFixture<GestionUeRessourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionUeRessourcesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionUeRessourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
