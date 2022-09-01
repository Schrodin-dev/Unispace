import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewAgendaComponent } from './preview-agenda.component';

describe('PreviewAgendaComponent', () => {
  let component: PreviewAgendaComponent;
  let fixture: ComponentFixture<PreviewAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewAgendaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
