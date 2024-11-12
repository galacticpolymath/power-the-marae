'use client';
class PersistedService {
  setItem(key: string, value: any) {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  }
  getItem<T>(key: string): T | null {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
      return null;
    }
    const item = localStorage.getItem(key);

    return typeof item !== 'undefined' && item !== null ? (JSON.parse(item) as T) : null;
  }

  getItemOrDefault<T>(key: string, defaultValue: T): T {
    const item = this.getItem<T>(key);
    return typeof item !== 'undefined' && item !== null ? item : defaultValue;
  }

  getCachedFunction<T>(key: string, func: () => T): T {
    const cachedValue = this.getItem<T>(key);
    if (cachedValue) {
      return cachedValue;
    }
    const value = func();
    this.setItem(key, value);
    return value;
  }
}

export const persistedService = new PersistedService();
