import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { ApiResponse, QuizListItem, QuizDetail, QuizCreationPayload, SubmissionPayload, QuizStatistics } from '../models/quiz.models';
export { QuizStatus } from '../models/quiz.models';
export type { ApiResponse, QuizListItem as Quiz, QuizListItem as QuizResponseDto, QuizDetail as QuizResponse, QuizDetail as QuizDetails, QuizOption as Option, QuizQuestion as QuestionResponse, QuizCreationOption as OptionCreation, QuizCreationQuestion as QuestionCreation, QuizCreationPayload, AnswerPayload, SubmissionPayload, QuizStatistics, QuestionStatistics, OptionStatistics } from '../models/quiz.models';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private readonly apiUrl = '/api/quizzes';
  constructor(private http: HttpClient) {}
  getAllQuizzes(): Observable<QuizListItem[]> { return this.http.get<QuizListItem[]>(this.apiUrl); }
  getMyCreatedQuizzes(): Observable<QuizListItem[]> { return this.http.get<QuizListItem[]>(`${this.apiUrl}/mine`); }
  getPublicQuizzes(): Observable<QuizListItem[]> { return this.http.get<QuizListItem[]>('/api/public/quizzes'); }
  getQuizById(id: string): Observable<QuizDetail> { return this.http.get<QuizDetail>(`${this.apiUrl}/${id}`); }
  getPublicQuizById(id: string): Observable<QuizDetail> { return this.http.get<QuizDetail>(`/api/public/quizzes/${id}`); }
  getPublicQuizAnswers(id: string): Observable<QuizStatistics> { return this.http.get<QuizStatistics>(`/api/public/quizzes/${id}/answers`); }
  getStatistics(id: string): Observable<QuizStatistics> { return this.http.get<QuizStatistics>(`${this.apiUrl}/${id}/statistics`); }
  createQuiz(payload: QuizCreationPayload): Observable<QuizListItem> { return this.http.post<QuizListItem>(this.apiUrl, payload); }
  updateQuiz(payload: QuizCreationPayload): Observable<{ id?: number }> { return this.http.put<{ id?: number }>(this.apiUrl, payload); }
  deleteQuizzes(ids: number[]): Observable<void> { return this.http.delete<void>(this.apiUrl, { body: { ids } }); }
  publishQuiz(id: number, isPublished: boolean): Observable<void> { return this.http.post<void>(`${this.apiUrl}/${id}/publish`, { isPublished }); }
  closeQuiz(id: number): Observable<void> { return this.http.put<void>(`${this.apiUrl}/${id}/close`, {}); }
  setPinned(id: number, isPinned: boolean): Observable<void> { return this.http.put<void>(`${this.apiUrl}/${id}/pin`, { isPinned }); }
  submitQuiz(id: string, payload: SubmissionPayload): Observable<void> { return this.http.post<void>(`${this.apiUrl}/${id}/submit`, payload); }
  searchQuizzes(name?: string, startDate?: string, endDate?: string): Observable<QuizListItem[]> { let params = new HttpParams(); if (name) params = params.set('title', name); if (startDate) params = params.set('start_date', startDate); if (endDate) params = params.set('end_date', endDate); return this.http.get<QuizListItem[]>(`${this.apiUrl}/search`, { params }); }
}