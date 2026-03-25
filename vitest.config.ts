import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode ?? "test", process.cwd(), "");
  return {
    test: {
      include: ["tests/**/*.test.ts"],
      testTimeout: 600000, // 10 minutes — some tests generate media
      hookTimeout: 30000,
      env,
    },
  };
});
