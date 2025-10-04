import { Injectable, inject } from '@angular/core';
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

  private user: User | null = null;
  private token: string | null = null;
  private status: string = 'loading';
  private router: Router = inject(Router);

  // ----------- Lifecycle -----------

  /**
   * Initialize auth state before the app renders.
   * Use APP_INITIALIZER to call this and block bootstrap until it resolves.
   */
  init() {
    const cookie = Cookie.get(COOKIE_KEY) ?? {}; // {} if null
    const { user = null, token = null } = cookie as {user?: any, token?: string};

    this.user   = user;
    this.token  = token;
    this.status = user ? 'authenticated' : 'unauthenticated';
  }

  isAuthenticated(): boolean {
    return this.status === 'authenticated';
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  // ----------- Actions -----------

  async login(
    username: string,
    password: string,
    remember: boolean = false
  ): Promise<void> {
    
    const res  = await fetch(`${environment.baseURL}/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username, password, remember })
    });
    
    const json = await res.json();
    if (!res.ok) throw new Error(json.message ?? 'Something went wrong');
    
    const { data: { user, token, maxAge } } = json;
    
    Object.assign(this, { user, token, status: 'authenticated' });
    Cookie.set(COOKIE_KEY, { user, token }, { maxAge });
    
    this.router.navigate(['/'])
  }

  async logout(): Promise<void> {
    this.clearAuthSession();
    this.router.navigate(['/signin']);
  }

  // ----------- Helpers -----------
  private clearAuthSession() {
    this.user   = null;
    this.token  = null;
    this.status = 'unauthenticated';
    Cookie.delete(COOKIE_KEY);
  }
}
