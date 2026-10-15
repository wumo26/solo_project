import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {

  // 將暫存的資料結構升級，可以同時保存問卷和答案
  private submissionData: { quiz: any, answers: any } | null = null;

  constructor() { }

  /**
   * 設定要提交的資料
   * @param quiz 完整的問卷物件
   * @param answers 使用者填寫的答案物件
   */
  setSubmissionData(quiz: any, answers: any) {
    this.submissionData = { quiz, answers };
  }

  /**
   * 獲取提交的資料
   */
  getSubmissionData() {
    return this.submissionData;
  }

  /**
   * 清除暫存的資料
   */
  clearSubmissionData() {
    this.submissionData = null;
  }
}
