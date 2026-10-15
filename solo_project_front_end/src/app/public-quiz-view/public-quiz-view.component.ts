import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { QuizReadonlyContentComponent } from '../shared/quiz-readonly-content/quiz-readonly-content.component';
import { QuizResponse, QuizService, QuizStatistics } from '../services/quiz.service';

@Component({ selector: 'app-public-quiz-view', standalone: true, imports: [CommonModule, RouterModule, MatIconModule, QuizReadonlyContentComponent], templateUrl: './public-quiz-view.component.html', styleUrl: './public-quiz-view.component.scss' })
export class PublicQuizViewComponent implements OnInit {
  quiz: QuizResponse | null = null;
  statistics: QuizStatistics | null = null;
  error = '';
  constructor(private route: ActivatedRoute, private quizService: QuizService) {}
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.quizService.getPublicQuizById(id).subscribe({ next: quiz => this.quiz = quiz, error: () => this.error = '找不到可公開查看的問卷。' });
    this.quizService.getPublicQuizAnswers(id).subscribe({ next: statistics => this.statistics = statistics });
  }
}
