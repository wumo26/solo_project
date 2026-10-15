import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// 定義傳入對話框的資料結構
export interface ConfirmDialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: []
})
export class ConfirmDialogComponent {
  // 透過 MAT_DIALOG_DATA 注入從主元件傳來的資料
  // 透過 MatDialogRef 注入對話框本身的參考，以便關閉它
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  // 點擊「取消」按鈕時執行的函式
  onNoClick(): void {
    this.dialogRef.close(false); // 關閉對話框，並回傳 false
  }

  // 點擊「確認」按鈕時執行的函式
  onYesClick(): void {
    this.dialogRef.close(true); // 關閉對話框，並回傳 true
  }
}
