import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cookie } from '../../utils/cookie';

export type AdminUser = {
  name: string;
  email: string;
  avatar: string | null;
  role: 'SUPER_ADMIN' | 'ADMIN';
  permissions: string[];
};

// Storage keys
const COOKIE_KEY = 'admin_auth_session';          // persistent (remember me)

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  
  public  user:  AdminUser | null = null;
  public  token: string    | null = null;
  public  status: string          = 'loading';
  private http: HttpClient        = inject(HttpClient);

  // ----------- Lifecycle -----------

  /**
   * Initialize auth state before the app renders.
   * Use APP_INITIALIZER to call this and block bootstrap until it resolves.
   */
  async init(): Promise<void> {
    const cookie = Cookie.get(COOKIE_KEY) ?? {};   // {} if null
    const { user = null, token = null } = cookie as { user?: any; token?: string };
  
    this.user = user;
    this.token = token;
    this.status = user ? 'authenticated' : 'unauthenticated';

  }
  
  
  isAuthenticated(): boolean {
    return !!this.user;
  }

  // ----------- Actions -----------

  async login(email: string, password: string, remember: boolean): Promise<void> {

    return new Promise((resolve, reject) => {
      this
        .http
        .post('http://localhost:8000/api/admin/auth/login', { email, password, remember })
        .subscribe({
          next: (res:any) => {
            const { user, token, maxAge } = res.data
            this.user   = user
            this.token  = token
            this.status = 'authenticated' 

            Cookie.set(COOKIE_KEY, {user, token}, { maxAge })

            resolve()
          },
          error: ({error}) => {
            reject(error)
          }
        })
    })

  }

  async logout(): Promise<void> {
    this.clearAuthSession();
  }

  async logoutAll(): Promise<void> {
   
    this.clearAuthSession();
  }

  // ----------- Helpers -----------

  private clearAuthSession() {
    this.user   = null;
    this.token  = null;
    this.status = 'unauthenticated'

    Cookie.delete(COOKIE_KEY)
  }
}
