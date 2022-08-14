import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravailAFaireComponent } from './travail-a-faire.component';

describe('TravailAFaireComponent', () => {
  let component: TravailAFaireComponent;
  let fixture: ComponentFixture<TravailAFaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravailAFaireComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TravailAFaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
