import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionThemesComponent } from './gestion-themes.component';

describe('GestionThemesComponent', () => {
  let component: GestionThemesComponent;
  let fixture: ComponentFixture<GestionThemesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionThemesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionThemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
