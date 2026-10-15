import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QuizService, QuizStatistics } from '../services/quiz.service';

@Component({ selector: 'app-quiz-stats', standalone: true, imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatProgressSpinnerModule], templateUrl: './quiz-stats.component.html', styleUrls: ['./quiz-stats.component.scss'] })
export class QuizStatsComponent implements OnInit {
  stats: QuizStatistics | null = null;
  isLoading = true;
  error: string | null = null;
  constructor(private route: ActivatedRoute, private quizService: QuizService) {}
  getQuestionTypeLabel(type: string): string { return ({ SINGLE: '單選題', MULTI: '多選題', TEXT: '文字題' } as Record<string, string>)[type] || type; }
  ngOnInit(): void {
    const quizId = this.route.snapshot.paramMap.get('id');
    if (!quizId) { this.error = '找不到問卷編號。'; this.isLoading = false; return; }
    this.quizService.getStatistics(quizId).subscribe({ next: data => { this.stats = data; this.isLoading = false; }, error: err => { this.error = '無法載入問卷統計資料。'; this.isLoading = false; console.error(err); } });
  }
}

