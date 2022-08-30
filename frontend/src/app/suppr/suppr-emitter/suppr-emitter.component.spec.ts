import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupprEmitterComponent } from './suppr-emitter.component';

describe('SupprEmitterComponent', () => {
  let component: SupprEmitterComponent;
  let fixture: ComponentFixture<SupprEmitterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupprEmitterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupprEmitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
