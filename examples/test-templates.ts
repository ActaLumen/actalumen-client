/**
 * Test script for template operations via V1 API.
 *
 * Usage:
 *   ACTALUMEN_API_KEY=al_xxx npx tsx examples/test-templates.ts
 */

import { ActaLumenClient, ActaLumenError } from "../src/index.js";

async function main() {
  const apiKey = process.env.ACTALUMEN_API_KEY;
  const baseUrl = process.env.ACTALUMEN_API_URL || "http://localhost:3000";

  if (!apiKey) {
    console.error("Error: ACTALUMEN_API_KEY environment variable is required");
    process.exit(1);
  }

  const client = new ActaLumenClient({
    baseUrl,
    apiKey,
    retry: { maxRetries: 3 },
  });

  console.log("=== ActaLumen Templates Test (V1 API) ===\n");
  console.log(`Base URL: ${baseUrl}\n`);

  try {
    // List all templates — global/shared return counts, org returns full details
    console.log("Fetching templates...\n");
    const result = await client.v1ListTemplates({ type: "all" });

    if (result.globalTemplates) {
      console.log(`Global templates: ${result.globalTemplates.count} available`);
    }
    if (result.sharedTemplates) {
      console.log(`Shared templates: ${result.sharedTemplates.count} available`);
    }

    if (result.orgTemplates && result.orgTemplates.length > 0) {
      console.log(`\nYour templates (${result.orgTemplates.length}):\n`);
      result.orgTemplates.forEach((template, index) => {
        console.log(`  ${index + 1}. ${template.name}`);
        console.log(`     ID: ${template.id}`);
        console.log(`     Version: ${template.version}`);
        console.log(`     Category: ${template.category || "(none)"}`);
        console.log(`     Criteria: ${template.criteriaCount || "N/A"}`);
        if (template.description) {
          console.log(`     Description: ${template.description.substring(0, 100)}${template.description.length > 100 ? "..." : ""}`);
        }
        console.log();
      });
    } else {
      console.log("\nNo org templates found.");
    }

    console.log("=== Test Complete ===");
  } catch (error) {
    if (error instanceof ActaLumenError) {
      console.error(`\nActaLumen Error: ${error.message}`);
      console.error(`  Status: ${error.statusCode}`);
      console.error(`  Code: ${error.code}`);
    } else {
      console.error("\nError:", error);
    }
    process.exit(1);
  }
}

main();
