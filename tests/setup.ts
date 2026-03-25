/**
 * Shared test setup — provides a configured ActaLumenClient and test PDF buffer.
 *
 * Required env vars:
 *   ACTALUMEN_API_KEY   — A valid API key (al_...) scoped to a project
 *
 * Optional:
 *   ACTALUMEN_API_URL   — Base URL (default: http://localhost:3000)
 *   ACTALUMEN_TEST_PDF  — Path to a PDF file for testing (default: tests/fixtures/nsf-proposal-example.pdf)
 *   ACTALUMEN_TEMPLATE_ID — Template ID for verification tests
 */

import { ActaLumenClient } from "../src/client.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface TestEnv {
  client: ActaLumenClient;
  pdfBuffer: Buffer;
  apiKey: string;
  baseUrl: string;
  templateId?: number;
}

export function getTestEnv(): TestEnv {
  const apiKey = process.env.ACTALUMEN_API_KEY;
  if (!apiKey) throw new Error("ACTALUMEN_API_KEY is required");

  const baseUrl = process.env.ACTALUMEN_API_URL || "http://localhost:3000";
  const templateId = process.env.ACTALUMEN_TEMPLATE_ID ? Number(process.env.ACTALUMEN_TEMPLATE_ID) : undefined;

  const client = new ActaLumenClient({
    baseUrl,
    apiKey,
    retry: { maxRetries: 0 },
    timeoutMs: 60000,
  });

  // Resolve test PDF — use env var, or fall back to bundled fixture
  const pdfPath = process.env.ACTALUMEN_TEST_PDF || path.resolve(__dirname, "fixtures/nsf-proposal-example.pdf");
  if (!fs.existsSync(pdfPath)) throw new Error(`Test PDF not found at ${pdfPath}`);

  return {
    client,
    pdfBuffer: fs.readFileSync(pdfPath),
    apiKey,
    baseUrl,
    templateId,
  };
}
