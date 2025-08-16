import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export type AdminUser = {
  name: string;
  email: string;
  avatar: string | null;
  role: 'SUPER_ADMIN' | 'ADMIN';
  permissions: string[];
};

type AuthState = { token: string; user: AdminUser } | null;
type LoginResponse = { token: string; user: AdminUser };

// Storage keys
const LS_KEY = 'admin_auth';          // persistent (remember me)
const SS_KEY = 'admin_auth_session';  // tab/session-only

@Injectable({ providedIn: 'root' })

export class AuthService {
  public user: AdminUser | null = null;
  public token: string | null = null;

  private http = inject(HttpClient);

  // ----------- Lifecycle -----------

  /**
   * Initialize auth state before the app renders.
   * Use APP_INITIALIZER to call this and block bootstrap until it resolves.
   */
  async init(): Promise<void> {
    const saved = this.loadPersisted();
    if (!saved?.token) return;

    this.token = saved.token;
    this.user = saved.user;

  }

  isAuthenticated(): boolean {
    return !!this.user && !!this.token;
  }

  // ----------- Actions -----------

  async login(email: string, password: string, remember: boolean): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<LoginResponse>(this.url('/admin/login'), { email, password, remember })
    );
    this.user = res.user;
    this.token = res.token;
    this.persist({ token: res.token, user: res.user }, remember);
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.http.post(this.url('/admin/logout'), {}, { headers: this.authHeaders() }));
    } catch { /* ignore network/server errors on logout */ }
    this.clearAuth();
  }

  async logoutAll(): Promise<void> {
    try {
      await firstValueFrom(this.http.post(this.url('/admin/logout-all'), {}, { headers: this.authHeaders() }));
    } catch { /* ignore */ }
    this.clearAuth();
  }

  // ----------- Helpers -----------

  private url(path: string): string {
    const base = environment.apiBaseUrl?.replace(/\/$/, '') || '';
    return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders(this.token ? { Authorization: `Bearer ${this.token}` } : {});
  }

  private persist(state: AuthState, remember: boolean) {
    // Clear both, then write to chosen storage
    localStorage.removeItem(LS_KEY);
    sessionStorage.removeItem(SS_KEY);
    const json = JSON.stringify(state);
    (remember ? localStorage : sessionStorage).setItem(remember ? LS_KEY : SS_KEY, json);
  }

  private loadPersisted(): AuthState {
    try {
      const raw = localStorage.getItem(LS_KEY) ?? sessionStorage.getItem(SS_KEY);
      return raw ? (JSON.parse(raw) as AuthState) : null;
    } catch {
      localStorage.removeItem(LS_KEY);
      sessionStorage.removeItem(SS_KEY);
      return null;
    }
  }

  private clearAuth() {
    this.user = null;
    this.token = null;
    localStorage.removeItem(LS_KEY);
    sessionStorage.removeItem(SS_KEY);
  }
}
