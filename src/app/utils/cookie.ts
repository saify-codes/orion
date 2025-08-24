// cookie.ts
export type SameSite = 'Strict' | 'Lax' | 'None';

export interface CookieOptions {
  path?: string;                 // default '/'
  domain?: string;
  expires?: Date | number;       // Date, or number of days from now
  maxAge?: number;               // seconds
  secure?: boolean;
  sameSite?: SameSite;           // 'Lax' (default if not provided)
  partitioned?: boolean;         // Chrome partitioned cookies
}

export class Cookie {
  // ---------- public API ----------
  static set(name: string, value: unknown, opts: CookieOptions = {}): void {
    if (!this.available()) return;

    const v = this.stringify(value);
    const parts: string[] = [`${encodeURIComponent(name)}=${encodeURIComponent(v)}`];

    // expiry
    if (opts.expires !== undefined) {
      const d =
        opts.expires instanceof Date
          ? opts.expires
          : new Date(Date.now() + Number(opts.expires) * 864e5); // days -> ms
      parts.push(`Expires=${d.toUTCString()}`);
    }
    if (opts.maxAge !== undefined) parts.push(`Max-Age=${Math.floor(opts.maxAge)}`);

    // attrs
    parts.push(`Path=${opts.path ?? '/'}`);
    if (opts.domain) parts.push(`Domain=${opts.domain}`);
    const same = opts.sameSite;
    if (same) parts.push(`SameSite=${same}`);
    if (opts.secure || same === 'None') parts.push('Secure'); // SameSite=None must be Secure
    if (opts.partitioned) parts.push('Partitioned');

    document.cookie = parts.join('; ');
  }

  static delete(name: string, opts: Omit<CookieOptions, 'expires' | 'maxAge'> = {}): void {
    if (!this.available()) return;
    // Best effort: delete at given path/domain (default '/')
    this.set(name, '', { ...opts, expires: new Date(0), maxAge: 0 });
  }

  static update<T = unknown>(
    name: string,
    next: T | ((prev: T | null) => T),
    opts?: CookieOptions
  ): void {
    const prev = this.get<T>(name);
    const value = typeof next === 'function' ? (next as any)(prev) : next;
    this.set(name, value, opts);
  }

  static flush(opts: Omit<CookieOptions, 'expires'|'maxAge'> = {}): void {
    if (!this.available()) return;
    const keys = Object.keys(this.all());
    for (const k of keys) this.delete(k, opts);
    // Also try current path deletion (in case cookies were set on non-root path)
    if (!opts.path && location?.pathname && location.pathname !== '/') {
      for (const k of keys) this.delete(k, { ...opts, path: location.pathname });
    }
  }

  // ---------- handy extras ----------
  static get<T = string>(name: string): T | null {
    if (!this.available()) return null;
    const map = this.all();
    if (!(name in map)) return null;
    return this.tryParse(map[name]) as T;
  }

  static has(name: string): boolean {
    if (!this.available()) return false;
    return Object.prototype.hasOwnProperty.call(this.all(), name);
  }

  static all(): Record<string, string> {
    if (!this.available()) return {};
    const out: Record<string, string> = {};
    const raw = document.cookie || '';
    if (!raw) return out;
    for (const pair of raw.split(';')) {
      const idx = pair.indexOf('=');
      const k = decodeURIComponent(pair.slice(0, idx).trim());
      const v = decodeURIComponent(pair.slice(idx + 1).trim());
      if (k) out[k] = v;
    }
    return out;
  }

  // ---------- internals ----------
  private static available(): boolean {
    return typeof document !== 'undefined' && typeof document.cookie === 'string';
  }

  private static stringify(val: unknown): string {
    if (val === undefined || val === null) return '';
    if (typeof val === 'string') return val;
    try { return JSON.stringify(val); } catch { return String(val); }
  }

  private static tryParse(raw: string): unknown {
    if (!raw) return '';
    // Attempt JSON parse if it looks like JSON
    const t = raw.trim();
    if ((t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'))) {
      try { return JSON.parse(t); } catch { /* fall through */ }
    }
    return raw;
  }
}
