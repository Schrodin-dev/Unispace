import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupprReceiverComponent } from './suppr-receiver.component';

describe('SupprReceiverComponent', () => {
  let component: SupprReceiverComponent;
  let fixture: ComponentFixture<SupprReceiverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupprReceiverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupprReceiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
