import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { QuizReadonlyContentComponent } from '../shared/quiz-readonly-content/quiz-readonly-content.component';
import { QuizService, QuizResponse } from '../services/quiz.service';

@Component({ selector: 'app-quiz-preview', standalone: true, imports: [CommonModule, RouterModule, MatButtonModule, QuizReadonlyContentComponent], templateUrl: './quiz-preview.component.html', styleUrls: ['./quiz-preview.component.scss'] })
export class QuizPreviewComponent implements OnInit {
  quizData: QuizResponse | null = null;
  currentQuizId: string | null = null;
  constructor(private route: ActivatedRoute, private router: Router, private quizService: QuizService) {}
  ngOnInit(): void { this.route.paramMap.subscribe(params => { const id = params.get('id'); if (id) { this.currentQuizId = id; this.quizService.getQuizById(id).subscribe(data => this.quizData = data); } }); }
  editQuiz(): void { if (this.currentQuizId) this.router.navigate(['/quiz/edit', this.currentQuizId]); }
  goBack(): void { this.router.navigate(['/quiz-list']); }
}
