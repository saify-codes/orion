import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cookie } from '../../utils/cookie';
import { Router } from '@angular/router';

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
  private router: Router          = inject(Router)

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
        .post('https://orion-backend-main-l6ntcw.laravel.cloud/api/admin/auth/login', { email, password, remember })
        .subscribe({
          next: (res:any) => {
            const { user, token, maxAge } = res.data
            this.user   = user
            this.token  = token
            this.status = 'authenticated' 
            
            Cookie.set(COOKIE_KEY, {user, token}, { maxAge })
            
            this.router.navigate(['admin/'])

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
    this.router.navigate(['admin/auth/login'])
  }

  async logoutAll(): Promise<void> {
   
    this.clearAuthSession();
    this.router.navigate(['admin/auth/login'])

  }

  // ----------- Helpers -----------

  private clearAuthSession() {
    this.user   = null;
    this.token  = null;
    this.status = 'unauthenticated'

    Cookie.delete(COOKIE_KEY)
  }
}
