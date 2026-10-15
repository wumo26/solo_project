import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isOpen = new BehaviorSubject<boolean>(true); // 預設為打開
  public isOpen$ = this.isOpen.asObservable();

  toggle(): void {
    this.isOpen.next(!this.isOpen.value);
  }
}
