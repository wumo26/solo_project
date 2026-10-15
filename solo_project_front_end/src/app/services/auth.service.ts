import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../entity/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = '/api';
  private readonly USER_KEY = 'currentUser';
  private currentUserSubject = new BehaviorSubject<any | null>(this.getCurrentUser());
  currentUser$ = this.currentUserSubject.asObservable();
  constructor(private http: HttpClient, private router: Router) {}
  get currentUserValue(): any | null { return this.currentUserSubject.value; }
  register(user: User): Observable<any> { return this.http.post(`${this.apiUrl}/users/register`, user, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }); }
  login(credentials: any): Observable<any> { return this.http.post<any>(`${this.apiUrl}/login`, credentials, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }).pipe(tap(response => { if (response?.token) { localStorage.setItem(this.USER_KEY, JSON.stringify(response)); this.currentUserSubject.next(response); } })); }
  getProfile(): Observable<User> { return this.http.get<User>(`${this.apiUrl}/users/me`); }
  getMyResponses(): Observable<any[]> { return this.http.get<any[]>(`${this.apiUrl}/users/me/responses`); }
  updateProfile(profile: Partial<User>): Observable<User> { return this.http.put<User>(`${this.apiUrl}/users/me`, profile).pipe(tap(updated => { const current = this.currentUserValue; if (current) { const next = { ...current, user: { ...current.user, ...updated } }; localStorage.setItem(this.USER_KEY, JSON.stringify(next)); this.currentUserSubject.next(next); } })); }
  isAuthenticated(): boolean { const user = this.currentUserValue; return !!user?.token; }
  logout(): void { localStorage.removeItem(this.USER_KEY); this.currentUserSubject.next(null); this.router.navigate(['/login']); }
  getCurrentUser(): any | null { const value = localStorage.getItem(this.USER_KEY); return value ? JSON.parse(value) : null; }
  getToken(): string | null { return this.currentUserValue?.token ?? null; }
}