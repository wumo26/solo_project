import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

// 假設您有一個 AuthService 來處理註冊邏輯
// 如果沒有，我們稍後需要建立它
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  // [重要] 將所有需要的模組匯入到 standalone component 中
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  // 宣告一個 FormGroup 來管理您的表單
  registrationForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // 注入 AuthService
    private router: Router // 注入 Router 以便跳轉
  ) { }

  ngOnInit(): void {
    // 使用 FormBuilder 來建立表單控制項和驗證規則
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      phone: ['', Validators.required]
    });
  }

  // 當表單被提交時，這個方法會被呼叫
  onSubmit(): void {
    // 如果表單驗證失敗，就停止執行
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched(); // 標記所有欄位為已觸碰，以顯示錯誤訊息
      return;
    }

    // 呼叫 AuthService 中的 register 方法，並傳入表單的值
    this.authService.register(this.registrationForm.value).subscribe({
      next: (response) => {
        // 註冊成功！
        console.log('註冊成功:', response);
        // 跳轉到登入頁面
        this.router.navigate(['/login']);
      },
      error: (err) => {
        // 註冊失敗
        console.error('註冊失敗:', err);
        this.errorMessage = '註冊失敗，請稍後再試或檢查您的資料。';
      }
    });
  }
}
