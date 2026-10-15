import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';

@Component({ selector: 'app-login', standalone: true, imports: [CommonModule, RouterLink, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule], templateUrl: './login.component.html', styleUrls: ['./login.component.scss'] })
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;
  errorMessage = '';
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}
  ngOnInit(): void { this.loginForm = this.fb.group({ email: ['', [Validators.required, Validators.email]], password: ['', [Validators.required, Validators.minLength(8)]] }); }
  togglePasswordVisibility(): void { this.hidePassword = !this.hidePassword; }
  onSubmit(): void {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); this.errorMessage = '請輸入正確的電子郵件與至少 8 個字元的密碼。'; return; }
    this.errorMessage = '';
    this.authService.login(this.loginForm.value).subscribe({
      next: response => { if (response?.token) this.router.navigate(['/quiz-list']); else this.errorMessage = '帳號或密碼錯誤。'; },
      error: err => { console.error('登入失敗：', err); this.errorMessage = '帳號或密碼錯誤。'; }
    });
  }
}

