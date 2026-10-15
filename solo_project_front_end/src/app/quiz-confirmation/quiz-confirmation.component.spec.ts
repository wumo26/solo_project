import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizConfirmationComponent } from './quiz-confirmation.component';

describe('QuizConfirmationComponent', () => {
  let component: QuizConfirmationComponent;
  let fixture: ComponentFixture<QuizConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
