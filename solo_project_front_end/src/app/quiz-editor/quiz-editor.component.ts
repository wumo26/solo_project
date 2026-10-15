import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { Option, OptionCreation, QuestionCreation, QuestionResponse, QuizCreationPayload, QuizResponse, QuizService } from '../services/quiz.service';

type EditorQuestionType = 'single-choice' | 'multiple-choice' | 'text-input';

@Component({
  selector: 'app-quiz-editor', standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatDividerModule, MatMenuModule],
  templateUrl: './quiz-editor.component.html', styleUrls: ['./quiz-editor.component.scss']
})
export class QuizEditorComponent implements OnInit {
  quizForm: FormGroup;
  isEditMode = false;
  quizId: string | null = null;
  private originalQuizData: QuizResponse | null = null;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private quizService: QuizService) {
    this.quizForm = this.fb.group({ name: ['', Validators.required], description: [''], startDate: [null, Validators.required], endDate: [null, Validators.required], questions: this.fb.array([]) });
  }
  ngOnInit(): void { this.quizId = this.route.snapshot.paramMap.get('id'); this.isEditMode = !!this.quizId; if (this.quizId) this.loadQuizData(this.quizId); }
  get questions(): FormArray { return this.quizForm.get('questions') as FormArray; }

  loadQuizData(id: string): void {
    this.quizService.getQuizById(id).subscribe({
      next: quiz => {
        if (quiz.isPublished) { alert('\u6b64\u554f\u5377\u5df2\u767c\u5e03\uff0c\u7121\u6cd5\u518d\u4fee\u6539\u5167\u5bb9\u3002'); this.router.navigate(['/quiz-list']); return; }
        this.originalQuizData = JSON.parse(JSON.stringify(quiz));
        this.populateForm(quiz);
      },
      error: error => console.error('Failed to load quiz.', error)
    });
  }

  populateForm(quiz: QuizResponse): void {
    this.quizForm.patchValue({ name: quiz.title, description: quiz.description, startDate: quiz.startDate ? new Date(quiz.startDate.replace(/-/g, '/')) : null, endDate: quiz.endDate ? new Date(quiz.endDate.replace(/-/g, '/')) : null });
    this.questions.clear();
    const typeMap: Record<string, EditorQuestionType> = { SINGLE: 'single-choice', MULTI: 'multiple-choice', TEXT: 'text-input' };
    quiz.questions.forEach((question: QuestionResponse) => {
      const group = this.createQuestion(typeMap[question.type] ?? 'text-input');
      group.patchValue({ questionText: question.title });
      if (question.options?.length) { const options = group.get('options') as FormArray; question.options.forEach((option: Option) => options.push(this.createOption(option.optionText))); }
      this.questions.push(group);
    });
  }

  createQuestion(type: EditorQuestionType): FormGroup { const group: Record<string, unknown> = { questionType: [type], questionText: ['', Validators.required] }; if (type !== 'text-input') group['options'] = this.fb.array([], Validators.minLength(1)); return this.fb.group(group); }
  createOption(optionText = ''): FormGroup { return this.fb.group({ optionText: [optionText, Validators.required] }); }
  addQuestion(type: EditorQuestionType): void { const group = this.createQuestion(type); this.questions.push(group); if (type !== 'text-input') { const options = group.get('options') as FormArray; options.push(this.createOption()); options.push(this.createOption()); } }
  removeQuestion(index: number): void { this.questions.removeAt(index); }
  getOptions(index: number): FormArray { return this.questions.at(index).get('options') as FormArray; }
  addOption(index: number): void { this.getOptions(index).push(this.createOption()); }
  removeOption(questionIndex: number, optionIndex: number): void { this.getOptions(questionIndex).removeAt(optionIndex); }
  returnToList(): void { this.router.navigate(['/quiz-list']); }
  onCancel(): void { if (this.isEditMode && this.originalQuizData) this.populateForm(this.originalQuizData); else this.router.navigate(['/quiz-list']); }

  onSave(): void {
    if (this.quizForm.invalid) { this.quizForm.markAllAsTouched(); alert('\u8acb\u5b8c\u6210\u6240\u6709\u5fc5\u586b\u6b04\u4f4d\u3002'); return; }
    const value = this.quizForm.value;
    const formatDate = (date: Date | string | null): string | null => { if (!date) return null; const parsed = new Date(date); return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}-${String(parsed.getDate()).padStart(2, '0')}`; };
    const typeMap: Record<EditorQuestionType, string> = { 'single-choice': 'SINGLE', 'multiple-choice': 'MULTI', 'text-input': 'TEXT' };
    const questions: QuestionCreation[] = value.questions.map((question: { questionType: EditorQuestionType; questionText: string; options?: { optionText: string }[] }, index: number) => ({ question_num: index + 1, title: question.questionText, type: typeMap[question.questionType], is_required: true, options: question.options?.map((option, optionIndex): OptionCreation => ({ option_code: String.fromCharCode(65 + optionIndex), option_text: option.optionText })) }));
    if (!questions.length) { alert('\u8acb\u81f3\u5c11\u65b0\u589e\u4e00\u500b\u984c\u76ee\u3002'); return; }
    const payload: QuizCreationPayload = { id: this.isEditMode ? Number(this.quizId) : undefined, title: value.name, description: value.description, start_date: formatDate(value.startDate), end_date: formatDate(value.endDate), is_published: false, questions };
    const request = this.isEditMode ? this.quizService.updateQuiz(payload) : this.quizService.createQuiz(payload);
    request.subscribe({ next: result => { const targetId = result?.id ?? this.quizId; if (targetId) this.router.navigate(['/quiz/preview', targetId]); }, error: error => { console.error('Failed to save quiz.', error); alert(error?.error?.message || '\u5132\u5b58\u554f\u5377\u5931\u6557\uff0c\u8acb\u7a0d\u5f8c\u518d\u8a66\u3002'); } });
  }
}
