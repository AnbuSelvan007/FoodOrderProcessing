/**
 * Type-safe localStorage wrapper.
 *
 * All reads and writes go through a single abstraction, so if we ever
 * need to migrate to sessionStorage, IndexedDB, or an encrypted store,
 * only this file changes.
 */

const TOKEN_KEY = 'foodieguy_access_token';
const REFRESH_TOKEN_KEY = 'foodieguy_refresh_token';

/** Generic typed getter with JSON parsing. */
function getItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    console.warn(`[Storage] Failed to parse key "${key}". Removing.`);
    localStorage.removeItem(key);
    return null;
  }
}

/** Generic typed setter with JSON serialization. */
function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[Storage] Failed to set key "${key}":`, error);
  }
}

/** Removes a single key. */
function removeItem(key: string): void {
  localStorage.removeItem(key);
}

/** Clears ALL application-scoped storage. */
function clear(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// ─── Token-specific helpers ─────────────────────────────────

function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setAccessToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export const storage = {
  getItem,
  setItem,
  removeItem,
  clear,
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  setRefreshToken,
  clearTokens,
} as const;
