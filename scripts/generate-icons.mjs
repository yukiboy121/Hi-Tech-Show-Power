/**
 * Generates PWA PNG icons from public/icons/icon.svg
 * Run: node scripts/generate-icons.mjs
 * Requires: npm install sharp (devDependency) or run after npm install
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const svgPath = join(root, "public", "icons", "icon.svg");
const outDir = join(root, "public", "icons");

async function main() {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.log("sharp not installed — copying SVG only. Run: npm install sharp && node scripts/generate-icons.mjs");
    return;
  }

  const svg = readFileSync(svgPath);
  for (const size of [192, 512, 180]) {
    const name = size === 180 ? "apple-touch-icon.png" : `icon-${size}.png`;
    await sharp(svg).resize(size, size).png().toFile(join(outDir, name));
    console.log(`Created ${name}`);
  }
}

main().catch(console.error);
