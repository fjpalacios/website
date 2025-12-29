#!/usr/bin/env node

/**
 * Kill any running development servers before running E2E tests
 * This ensures tests run against fresh build artifacts, not stale dev server content
 */

import { execSync } from "child_process";

const processesToKill = [
  { name: "astro dev", pattern: "astro dev" },
  { name: "vite", pattern: "vite" },
  { name: "astro preview", pattern: "astro preview" },
];

console.log("🔍 Checking for running development servers...");

let killedAny = false;

for (const proc of processesToKill) {
  try {
    // Use pkill with -f to match full command line (cross-platform compatible)
    execSync(`pkill -f "${proc.pattern}"`, { stdio: "ignore" });
    console.log(`   ✅ Killed ${proc.name}`);
    killedAny = true;
  } catch {
    // pkill returns non-zero exit code if no processes found
    // This is expected and not an error
  }
}

if (!killedAny) {
  console.log("   ℹ️  No development servers running");
}

console.log("✨ Ready to run E2E tests with fresh build\n");
