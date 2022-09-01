import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAgendaComponent } from './edit-agenda.component';

describe('EditAgendaComponent', () => {
  let component: EditAgendaComponent;
  let fixture: ComponentFixture<EditAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAgendaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
