import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailContentTodoComponent } from './detail-content-todo.component';

describe('DetailContentTodoComponent', () => {
  let component: DetailContentTodoComponent;
  let fixture: ComponentFixture<DetailContentTodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailContentTodoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailContentTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
