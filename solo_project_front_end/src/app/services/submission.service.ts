import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  // 假設您提交答案的後端 API 路徑是 /api/submissions
  private apiUrl = '/api/submissions';

  constructor(private http: HttpClient) { }

  /**
   * 提交問卷答案
   * @param submissionData 包含 quizId 和答案的物件
   */
  submitQuiz(submissionData: any): Observable<any> {
    return this.http.post(this.apiUrl, submissionData);
  }
}
