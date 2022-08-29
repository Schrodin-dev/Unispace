import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterModifierNoteComponent } from './ajouter-modifier-note.component';

describe('AjouterModifierNoteComponent', () => {
  let component: AjouterModifierNoteComponent;
  let fixture: ComponentFixture<AjouterModifierNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjouterModifierNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjouterModifierNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
