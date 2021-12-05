import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesDonneesComponent } from './mes-donnees.component';

describe('MesDonneesComponent', () => {
  let component: MesDonneesComponent;
  let fixture: ComponentFixture<MesDonneesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MesDonneesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MesDonneesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
