import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterRessourceUEComponent } from './ajouter-ressource-ue.component';

describe('AjouterRessourceUEComponent', () => {
  let component: AjouterRessourceUEComponent;
  let fixture: ComponentFixture<AjouterRessourceUEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjouterRessourceUEComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjouterRessourceUEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
