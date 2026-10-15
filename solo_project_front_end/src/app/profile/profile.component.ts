import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile', standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatInputModule],
  templateUrl: './profile.component.html', styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  loading = true;
  saving = false;
  message = '';
  error = '';
  responses: any[] = [];
  readonly form: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      phone: ['', [Validators.required, Validators.maxLength(20)]],
      email: [{ value: '', disabled: true }],
      age: [null, [Validators.min(0), Validators.max(9999)]]
    });
  }

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: profile => { this.form.patchValue(profile); this.loading = false; },
      error: () => { this.error = '讀取個人資料失敗，請稍後再試。'; this.loading = false; }
    });
    this.authService.getMyResponses().subscribe({ next: responses => this.responses = responses });
  }

  save(): void {
    if (this.form.invalid || this.saving) {
      this.error = '請確認姓名、電話與年齡的內容是否正確。';
      return;
    }
    this.saving = true;
    this.message = '';
    this.error = '';
    const { name, phone, age } = this.form.getRawValue();
    this.authService.updateProfile({ name: name ?? '', phone: phone ?? '', age: age ?? undefined }).subscribe({
      next: profile => { this.form.patchValue(profile); this.message = '個人資料已儲存。'; this.saving = false; },
      error: error => { this.error = error?.error?.message || '儲存失敗，請稍後再試。'; this.saving = false; }
    });
  }
}