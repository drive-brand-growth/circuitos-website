#!/usr/bin/env node
/**
 * Postbuild guard. Dynamic routes read content/*.yaml at request time, so the
 * content tree must be listed in their trace files or they 500 on Vercel.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const ROUTES = ["admin/page", "keystatic/[[...params]]/page"];
const REQUIRED = "content/site.yaml";

let failed = false;
for (const route of ROUTES) {
  const file = join(ROOT, ".next/server/app", `${route}.js.nft.json`);
  if (!existsSync(file)) {
    console.error(`content-trace: missing trace file ${file}`);
    failed = true;
    continue;
  }
  const { files } = JSON.parse(readFileSync(file, "utf8"));
  if (!files.some((f) => f.replaceAll("\\", "/").endsWith(REQUIRED))) {
    console.error(`content-trace: /${route} does not trace ${REQUIRED}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log(`content-trace: ${ROUTES.length} dynamic routes trace ${REQUIRED}`);
