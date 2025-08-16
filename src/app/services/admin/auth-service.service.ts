import { computed, signal } from '@angular/core';

export type User = { id: string; email: string; roles: string[]; token: string; exp?: number };

export class AuthService {

  private _user = signal<User | null>(this.loadUser());
  user       = computed(() => this._user());
  isLoggedIn = computed(() => !!this._user());
  roles      = computed(() => this._user()?.roles ?? []);
  token      = computed(() => this._user()?.token ?? null);

  login(user: User) {
    localStorage.setItem('auth_user', JSON.stringify(user));
    this._user.set(user);
  }

  logout() {
    localStorage.removeItem('auth_user');
    this._user.set(null);
  }

  hasRole(role: string) { return this.roles().includes(role); }
  hasAnyRole(required: string[]) { return required.some(r => this.hasRole(r)); }

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem('auth_user');
      return raw ? JSON.parse(raw) as User : null;
    } catch { return null; }
  }
}
