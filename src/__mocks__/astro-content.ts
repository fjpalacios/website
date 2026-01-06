/**
 * Mock for astro:content virtual module
 * Used in tests to avoid dependency on Astro runtime
 */

import { vi } from "vitest";

export const getCollection = vi.fn();
export const getEntry = vi.fn();
export const getEntries = vi.fn();
