// session.ts
type Entry<T = unknown> = { value: T; type: 'flash' | 'persistent' };
const STORAGE_KEY = 'session';

export class Session {
  private static get available() {
    return typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';
  }

  private static read(): Record<string, Entry> {
    if (!this.available) return {};
    try {
      const  raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Record<string, Entry>) : {};
    } catch {
      console.warn('Invalid session data detected; resetting.');
      return {};
    }
  }

  private static write(store: Record<string, Entry>) {
    if (!this.available) return;
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch {}
  }

  private static set<T>(key: string, value: T, type: Entry['type']) {
    const s = this.read();
    s[key] = { value, type };
    this.write(s);
  }

  static get<T = unknown>(key: string): T | undefined {
    const s = this.read();
    const e = s[key];
    if (!e) return undefined;
    if (e.type === 'flash') {
      delete s[key];
      this.write(s);
    }
    return e.value as T;
  }

  static put<T>(key: string, value: T)  { this.set(key, value, 'persistent'); }
  static flash<T>(key: string, value: T){ this.set(key, value, 'flash'); }

  static forget(key: string) {
    const s = this.read();
    if (key in s) { delete s[key]; this.write(s); }
  }
  static forgot(key: string) { this.forget(key); } // backwards-compat alias

  static has(key: string) { return this.read()[key] !== undefined; }

  static flush() { if (this.available) sessionStorage.removeItem(STORAGE_KEY); }
}
