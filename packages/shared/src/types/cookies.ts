export type CookieOptions = {
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
  maxAge?: number; // seconds (preferred over expires)
  path?: string;
};

export type Cookies = {
  set(key: string, value: string, options?: CookieOptions): void;
  get(key: string): string | undefined;
  delete(key: string): void;
};
