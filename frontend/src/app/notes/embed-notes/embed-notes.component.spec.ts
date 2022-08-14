import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbedNotesComponent } from './embed-notes.component';

describe('EmbedNotesComponent', () => {
  let component: EmbedNotesComponent;
  let fixture: ComponentFixture<EmbedNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmbedNotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbedNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
