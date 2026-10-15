import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortAnswerResultComponent } from './short-answer-result.component';

describe('ShortAnswerResultComponent', () => {
  let component: ShortAnswerResultComponent;
  let fixture: ComponentFixture<ShortAnswerResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShortAnswerResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShortAnswerResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
