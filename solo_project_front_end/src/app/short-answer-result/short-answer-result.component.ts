import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-short-answer-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './short-answer-result.component.html',
  styleUrl: './short-answer-result.component.scss'
})
export class ShortAnswerResultComponent {
  @Input() question: string = '';
  @Input() answers: string[] = [];

  showAnswers: boolean = false;

  toggleAnswers() {
    this.showAnswers = !this.showAnswers;
  }
}
