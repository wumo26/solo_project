import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AnswerPayload, QuizResponse, QuizService, SubmissionPayload } from '../services/quiz.service';

@Component({ selector: 'app-quiz-take', standalone: true, imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatRadioModule, MatCheckboxModule, MatInputModule, MatFormFieldModule], templateUrl: './quiz-take.component.html', styleUrls: ['./quiz-take.component.scss'] })
export class QuizTakeComponent implements OnInit {
  quizData: QuizResponse | null = null;
  submissionForm: FormGroup;
  quizId: string | null = null;
  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private quizService: QuizService) { this.submissionForm = this.fb.group({ answers: this.fb.array([]) }); }
  ngOnInit(): void { this.quizId = this.route.snapshot.paramMap.get('id'); if (this.quizId) this.loadQuiz(this.quizId); }
  loadQuiz(id: string): void { this.quizService.getQuizById(id).subscribe(data => { this.quizData = data; this.buildForm(); }); }
  buildForm(): void {
    if (!this.quizData) return;
    const groups = this.quizData.questions.map(question => {
      if (question.type === 'MULTI') {
        const controls = question.options.reduce((result, option) => ({ ...result, [option.optionCode]: new FormControl(false) }), {} as Record<string, FormControl>);
        return this.fb.group(controls);
      }
      return this.fb.group({ answer: new FormControl('', question.isRequired ? Validators.required : []) });
    });
    this.submissionForm.setControl('answers', this.fb.array(groups));
  }
  returnToList(): void { this.router.navigate(['/quiz-list']); }
  onSubmit(): void {
    if (this.submissionForm.invalid) { alert('請完成所有必填題目。'); return; }
    if (!this.quizData || !this.quizId) return;
    const values = this.submissionForm.value.answers || [];
    const answers: AnswerPayload[] = [];
    this.quizData.questions.forEach((question, index) => {
      const value = values[index] || {};
      const answer: AnswerPayload = { questionId: question.id };
      if (question.type === 'SINGLE' && value.answer) answer.optionIds = [value.answer];
      if (question.type === 'MULTI') answer.optionIds = question.options.filter(option => value[option.optionCode]).map(option => option.id);
      if (question.type === 'TEXT' && value.answer?.trim()) answer.answerText = value.answer.trim();
      if (answer.answerText || answer.optionIds?.length) answers.push(answer);
    });
    const payload: SubmissionPayload = { answers };
    this.quizService.submitQuiz(this.quizId, payload).subscribe({ next: () => { alert('問卷已成功提交。'); this.router.navigate(['/quiz-list']); }, error: err => { console.error(err); alert('提交問卷失敗，請稍後再試。'); } });
  }
}


