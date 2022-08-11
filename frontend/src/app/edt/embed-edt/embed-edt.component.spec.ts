import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbedEdtComponent } from './embed-edt.component';

describe('EmbedEdtComponent', () => {
  let component: EmbedEdtComponent;
  let fixture: ComponentFixture<EmbedEdtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmbedEdtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbedEdtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
