import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import type { QuizDetail } from '../../models/quiz.models';

@Component({
  selector: 'app-quiz-readonly-content',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './quiz-readonly-content.component.html',
  styleUrls: ['./quiz-readonly-content.component.scss']
})
export class QuizReadonlyContentComponent {
  @Input({ required: true }) quiz!: QuizDetail;
  @Input() showDates = true;
  typeName(type: string): string { return type === 'SINGLE' ? '單選題' : type === 'MULTI' ? '多選題' : '文字題'; }
}