import { Component } from '@angular/core';
// [1. 撘?之?艾???撌亙?
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarService } from './services/sidebar.service'; // 撘?????
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators'; // 撘 RxJS ??filter ??蝚?

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // [2. 閮??? 蝬???
  // ??蝢拐???isSidebarOpen$ 撅祆改?摰??銝??蝥??瑞????誨?准?
  isSidebarOpen$: Observable<boolean>;

  // [3. ???皜砍?? ?踵?頝舐霈?]
  // ?銝?????訾??脣???衣?餃/閮餃??????
  _isFullScreen: boolean = false;

  constructor(
    private router: Router,
    private sidebarService: SidebarService // [4. 撱箇???璅? 瘜典??]
  ) {
    // 撠??葉???誨?准?鞈血潛策??撅祆?
    this.isSidebarOpen$ = this.sidebarService.isOpen$;

    // [????蝝?] ???瑼Ｘ銝甈?URL嚗???晞楝?梁??????隞?
    this.router.events.pipe(
      // ??????芰??????隞?
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      // ?嗅??芰???嚗???靘炎?亦?? URL
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        // ?????汗???箏?Ｗ?
        this._isFullScreen = url === '/login' || url === '/register';
      }
    });
  }

  /**
   * 瑼Ｘ?嗅??臬??閬?Ｗ?憿舐內????
   * @returns boolean
   */
  isFullScreenPage(): boolean {
    return this._isFullScreen;
  }
}


