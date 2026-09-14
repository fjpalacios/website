import { describe, expect, it } from "vitest";

import { LocalStorageMock, setupLocalStorage, type StorageHost } from "./setup";

describe("test localStorage setup", () => {
  it("preserves an existing localStorage implementation", () => {
    const existingStorage = new LocalStorageMock();
    const host: StorageHost = { localStorage: existingStorage };

    setupLocalStorage(host);

    expect(host.localStorage).toBe(existingStorage);
  });

  it("installs the fallback when localStorage is unavailable", () => {
    const host: StorageHost = {};

    setupLocalStorage(host);

    expect(host.localStorage).toBeInstanceOf(LocalStorageMock);
    host.localStorage?.setItem("key", "value");
    expect(host.localStorage?.getItem("key")).toBe("value");
  });
});
