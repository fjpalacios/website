// This is the setup file for Vitest
// Add global test utilities and configurations here

import { beforeEach } from "vitest";

/**
 * localStorage mock for tests
 * happy-dom provides localStorage but sometimes it needs to be properly initialized
 */
class LocalStorageMock {
  private store: Record<string, string> = {};

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  get length(): number {
    return Object.keys(this.store).length;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
}

// Set up localStorage mock globally
global.localStorage = new LocalStorageMock() as Storage;

// Clear localStorage before each test
beforeEach(() => {
  global.localStorage.clear();
});
