import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Cookie } from '../../utils/cookie';
import { environment } from '../../../environments/environment';

export type User = {
  name: string;
  email: string;
  avatar: string | null;
  type: 'ADMIN' | 'STAFF';
  additionalData: any;
};

// Storage keys
const COOKIE_KEY = 'merchant_auth_session';

@Injectable({ providedIn: 'root' })
export class MerchantAuthService {
  public user: User | null = null;
  public token: string | null = null;
  public status: string = 'loading';
  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);

  // ----------- Lifecycle -----------

  /**
   * Initialize auth state before the app renders.
   * Use APP_INITIALIZER to call this and block bootstrap until it resolves.
   */
  init() {
    const cookie = Cookie.get(COOKIE_KEY) ?? {}; // {} if null
    const { user = null, token = null } = cookie as {
      user?: any;
      token?: string;
    };

    this.user = user;
    this.token = token;
    this.status = user ? 'authenticated' : 'unauthenticated';
  }

  isAuthenticated(): boolean {
    return !!this.user;
  }

  // ----------- Actions -----------

  async login(
    username: string,
    password: string,
    remember: boolean
  ): Promise<void> {
    try {
      const response = await fetch(`${environment.baseURL}/login`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'something went wrong');
      }

      const { data: user, token, maxAge } = data;
      this.user = user;
      this.token = token;
      this.status = 'authenticated';

      Cookie.set(COOKIE_KEY, { user, token }, { maxAge });

      this.router.navigate(['/']);
    } catch (error) {
      throw new Error('Json parse error');
    }
  }

  async logout(): Promise<void> {
    this.clearAuthSession();
    this.router.navigate(['/login']);
  }

  // ----------- Helpers -----------
  private clearAuthSession() {
    this.user = null;
    this.token = null;
    this.status = 'unauthenticated';
    Cookie.delete(COOKIE_KEY);
  }
}
