import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../services/quiz.service';
import { QuizListItem } from '../models/quiz.models';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({ selector: 'app-quiz-list', standalone: true, imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatCheckboxModule, MatButtonModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule], providers: [DatePipe], templateUrl: './quiz-list.component.html', styleUrls: ['./quiz-list.component.scss'] })
export class QuizListComponent implements OnInit {
  displayedColumns = ['select', 'name', 'startDate', 'endDate', 'status', 'actions'];
  dataSource = new MatTableDataSource<QuizListItem>();
  selectedIds = new Set<number>();
  isUpdatingStatus: Record<number, boolean> = {};
  isMine = false;
  titleFilter = '';
  availableDateFilter = '';
  private allQuizzes: QuizListItem[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private quizService: QuizService, public dialog: MatDialog, private router: Router, private route: ActivatedRoute) {}
  ngOnInit(): void { this.isMine = this.route.snapshot.routeConfig?.path === 'my-quizzes'; this.loadInitialQuizzes(); }
  creatorName(row: QuizListItem): string { return row.creatorName || '\u672a\u8a2d\u5b9a\u5efa\u7acb\u8005'; }
  statusLabel(row: QuizListItem): string { return row.isClosed ? '\u5df2\u7d50\u675f' : row.isPublished ? '\u767c\u5e03\u4e2d' : '\u672a\u767c\u5e03'; }
  loadInitialQuizzes(): void { const request = this.isMine ? this.quizService.getMyCreatedQuizzes() : this.quizService.getAllQuizzes(); request.subscribe({ next: data => { this.allQuizzes = data; this.applyFilters(); }, error: () => alert('\u7121\u6cd5\u8f09\u5165\u554f\u5377\uff0c\u8acb\u7a0d\u5f8c\u518d\u8a66\u3002') }); }
  applyFilters(): void { const title = this.titleFilter.trim().toLocaleLowerCase(); this.dataSource.data = this.allQuizzes.filter(quiz => { const quizStart = this.dateOnly(quiz.startDate); const quizEnd = this.dateOnly(quiz.endDate); const matchesTitle = !title || quiz.title.toLocaleLowerCase().includes(title); const isAvailableOnSelectedDate = !this.availableDateFilter || (quizStart <= this.availableDateFilter && quizEnd >= this.availableDateFilter); return matchesTitle && isAvailableOnSelectedDate; }); this.selectedIds.clear(); if (this.paginator) { this.dataSource.paginator = this.paginator; this.paginator.firstPage(); } }
  private dateOnly(value: string): string { return value ? String(value).slice(0, 10) : ''; }
  clearFilters(): void { this.titleFilter = ''; this.availableDateFilter = ''; this.applyFilters(); }
  toggleSelect(id: number): void { this.selectedIds.has(id) ? this.selectedIds.delete(id) : this.selectedIds.add(id); }
  toggleSelectAll(checked: boolean): void { if (checked) this.dataSource.data.forEach(row => this.selectedIds.add(row.id)); else this.selectedIds.clear(); }
  isAllSelected(): boolean { return this.dataSource.data.length > 0 && this.selectedIds.size === this.dataSource.data.length; }
  deleteSelected(): void { if (!this.selectedIds.size) return; const ref = this.dialog.open(ConfirmDialogComponent, { data: { title: '\u522a\u9664\u554f\u5377', message: `\u78ba\u5b9a\u522a\u9664 ${this.selectedIds.size} \u4efd\u554f\u5377\uff1f` } }); ref.afterClosed().subscribe(confirmed => { if (confirmed) this.quizService.deleteQuizzes([...this.selectedIds]).subscribe({ next: () => { this.selectedIds.clear(); this.loadInitialQuizzes(); }, error: () => alert('\u522a\u9664\u5931\u6557\u3002') }); }); }
  publishQuiz(id: number): void { if (confirm('\u78ba\u5b9a\u767c\u5e03\u9019\u4efd\u554f\u5377\uff1f')) this.updatePublicationStatus(id, true); }
  endPublication(id: number): void { if (!confirm('\u78ba\u5b9a\u7d50\u675f\u767c\u5e03\uff1f')) return; this.isUpdatingStatus[id] = true; this.quizService.closeQuiz(id).subscribe({ next: () => { delete this.isUpdatingStatus[id]; this.loadInitialQuizzes(); }, error: () => { delete this.isUpdatingStatus[id]; alert('\u66f4\u65b0\u5931\u6557\u3002'); } }); }
  private updatePublicationStatus(id: number, isPublished: boolean): void { this.isUpdatingStatus[id] = true; this.quizService.publishQuiz(id, isPublished).subscribe({ next: () => { delete this.isUpdatingStatus[id]; this.loadInitialQuizzes(); }, error: () => { delete this.isUpdatingStatus[id]; alert('\u66f4\u65b0\u5931\u6557\u3002'); } }); }
  togglePinned(id: number, isPinned: boolean): void { this.isUpdatingStatus[id] = true; this.quizService.setPinned(id, isPinned).subscribe({ next: () => { delete this.isUpdatingStatus[id]; this.loadInitialQuizzes(); }, error: () => { delete this.isUpdatingStatus[id]; alert('\u66f4\u65b0\u5931\u6557\u3002'); } }); }
  startQuiz(id: number): void { this.router.navigate(['/quiz/take', id]); }
  editQuiz(id: number): void { this.router.navigate(['/quiz/edit', id]); }
  viewStats(id: number): void { this.router.navigate(['/quiz/stats', id]); }
}



