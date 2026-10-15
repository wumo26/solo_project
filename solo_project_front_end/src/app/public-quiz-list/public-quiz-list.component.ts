import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { QuizListItem } from '../models/quiz.models';
import { QuizService } from '../services/quiz.service';

@Component({ selector: 'app-public-quiz-list', standalone: true, imports: [CommonModule, FormsModule, RouterModule, MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule, DatePipe], templateUrl: './public-quiz-list.component.html', styleUrl: './public-quiz-list.component.scss' })
export class PublicQuizListComponent implements OnInit {
  displayedColumns = ['name', 'startDate', 'endDate', 'status', 'actions'];
  dataSource = new MatTableDataSource<QuizListItem>();
  titleFilter = '';
  availableDateFilter = '';
  loading = true;
  error = '';
  private allQuizzes: QuizListItem[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private quizService: QuizService) {}
  ngOnInit(): void { this.quizService.getPublicQuizzes().subscribe({ next: data => { this.allQuizzes = data; this.applyFilters(); this.loading = false; }, error: () => { this.error = '\u76ee\u524d\u7121\u6cd5\u8f09\u5165\u516c\u958b\u554f\u5377\uff0c\u8acb\u7a0d\u5f8c\u518d\u8a66\u3002'; this.loading = false; } }); }
  creatorName(quiz: QuizListItem): string { return quiz.creatorName || '\u672a\u8a2d\u5b9a\u5efa\u7acb\u8005'; }
  statusLabel(quiz: QuizListItem): string { return quiz.isClosed ? '\u5df2\u7d50\u675f' : '\u767c\u5e03\u4e2d'; }
  applyFilters(): void { const title = this.titleFilter.trim().toLocaleLowerCase(); this.dataSource.data = this.allQuizzes.filter(quiz => { const quizStart = this.dateOnly(quiz.startDate); const quizEnd = this.dateOnly(quiz.endDate); const matchesTitle = !title || quiz.title.toLocaleLowerCase().includes(title); const isAvailableOnSelectedDate = !this.availableDateFilter || (quizStart <= this.availableDateFilter && quizEnd >= this.availableDateFilter); return matchesTitle && isAvailableOnSelectedDate; }); if (this.paginator) { this.dataSource.paginator = this.paginator; this.paginator.firstPage(); } }
  clearFilters(): void { this.titleFilter = ''; this.availableDateFilter = ''; this.applyFilters(); }
  private dateOnly(value: string): string { return value ? String(value).slice(0, 10) : ''; }
}

