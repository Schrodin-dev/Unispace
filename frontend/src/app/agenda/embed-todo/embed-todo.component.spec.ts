import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbedTodoComponent } from './embed-todo.component';

describe('EmbedTodoComponent', () => {
  let component: EmbedTodoComponent;
  let fixture: ComponentFixture<EmbedTodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmbedTodoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbedTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
