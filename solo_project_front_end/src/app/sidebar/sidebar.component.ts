import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SidebarService } from '../services/sidebar.service';
import { Observable, Subscription } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { User } from '../entity/user';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    MatTooltipModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  isSidebarOpen$: Observable<boolean>;
  currentUser: User | null = null;
  private userSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private sidebarService: SidebarService,
    private cdr: ChangeDetectorRef // 注入 ChangeDetectorRef
  ) {
    this.isSidebarOpen$ = this.sidebarService.isOpen$;
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(authData => {
      this.currentUser = authData ? authData.user : null;
      this.cdr.detectChanges(); // 強制觸發變更檢測
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  toggleSidebar(): void {
    this.sidebarService.toggle();
  }

  logout(): void {
    this.authService.logout();
  }
}
