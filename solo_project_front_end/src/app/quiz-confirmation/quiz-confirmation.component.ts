import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// ==================== vvv [??蝯Ⅱ隤?甇?Ⅱ頝臬?] vvv ====================
// ??函? answer.service.ts ??submission.service.ts ?賢 services 鞈?憭曆葉嚗?
// ?隞亙??? import 頝臬??賢?? '../services/...'
import { AnswerService } from '../services/answer.service';
import { SubmissionService } from '../services/submission.service';
import type { QuizDetails } from '../models/quiz.models'; // ?身 quiz.service.ts 銋 services 銝?
// ==================== ^^^ [??蝯Ⅱ隤?甇?Ⅱ頝臬?] ^^^ ====================

// ?臬 Angular Material 璅∠?
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-quiz-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './quiz-confirmation.component.html',
  styleUrls: ['./quiz-confirmation.component.css']
})
export class QuizConfirmationComponent implements OnInit {

  quiz: QuizDetails | null = null;
  userAnswers: { [questionId: string]: string } | null = null;
  questionMap = new Map<string, string>();
  isSubmitting = false;

  constructor(
    private router: Router,
    private answerService: AnswerService,
    private submissionService: SubmissionService // 憒?銝??import 甇?Ⅱ嚗ㄐ?隤文停??憭?
  ) {}

  ngOnInit(): void {
    const submissionData = this.answerService.getSubmissionData();

    if (!submissionData) {
      this.router.navigate(['/quiz-list']);
      return;
    }

    this.quiz = submissionData.quiz;
    this.userAnswers = submissionData.answers;

    this.quiz?.questions.forEach(q => {
      this.questionMap.set(String(q.id), q.text);
    });
  }

  get answerKeys(): string[] {
    return this.userAnswers ? Object.keys(this.userAnswers) : [];
  }

  goBack(): void {
    if (this.quiz) {
      this.router.navigate(['/quiz/take', this.quiz.id]);
    } else {
      this.router.navigate(['/quiz-list']);
    }
  }

  confirmAndSubmit(): void {
    if (!this.quiz || !this.userAnswers) return;

    this.isSubmitting = true;

    const payload = {
      quizId: this.quiz.id,
      answers: Object.entries(this.userAnswers).map(([questionId, answer]) => ({
        questionId: Number(questionId),
        answer: answer
      }))
    };

    this.submissionService.submitQuiz(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        alert('?撌脫???鈭歹?');
        this.answerService.clearSubmissionData();
        this.router.navigate(['/quiz-list']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('?漱憭望?:', err);
        alert('?漱憭望?嚗?瑼Ｘ蝬脰楝?????敺?閰艾?);
      }
    });
  }
}

