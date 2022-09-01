import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterAgendaComponent } from './ajouter-agenda.component';

describe('AjouterAgendaComponent', () => {
  let component: AjouterAgendaComponent;
  let fixture: ComponentFixture<AjouterAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjouterAgendaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjouterAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
