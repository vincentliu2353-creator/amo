import { access, mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawn } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);
const outputDir = path.join(projectRoot, "public", "downloads");
const pdfPath = path.join(outputDir, "AMO_B2B_Sales_Deck.pdf");
const htmlPath = path.join(outputDir, "AMO_B2B_Sales_Deck.html");
const host = process.env.SALES_DECK_HOST ?? "127.0.0.1";
const port = process.env.SALES_DECK_PORT ?? "3000";
const baseUrl = process.env.SALES_DECK_BASE_URL ?? `http://${host}:${port}`;
const executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH;
const deckUrl = `${baseUrl}/sales-deck?print=1`;
const requestTimeoutMs = 120000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function canReach(url) {
  try {
    const response = await fetch(url, { redirect: "manual" });
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForUrl(url, timeoutMs) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (await canReach(url)) {
      return;
    }

    await sleep(1000);
  }

  throw new Error(`Timed out waiting for ${url}`);
}

function startNextServer() {
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

  return spawn(npmCommand, ["run", "dev", "--", "--hostname", host, "--port", port], {
    cwd: projectRoot,
    env: process.env,
    stdio: "inherit",
  });
}

async function loadPlaywright() {
  const externalNodeModules = process.env.PLAYWRIGHT_NODE_MODULES;
  const searchPaths = [projectRoot];

  if (externalNodeModules) {
    searchPaths.unshift(externalNodeModules);
  }

  try {
    const resolvedPath = require.resolve("playwright", { paths: searchPaths });
    const module = await import(pathToFileURL(resolvedPath).href);
    return module.default ?? module;
  } catch {
    console.error("Playwright is not installed.");
    console.error("Install it with:");
    console.error("  npm install -D playwright");
    console.error("  npx playwright install chromium");
    console.error("Or point this script at an external install:");
    console.error("  PLAYWRIGHT_NODE_MODULES=/absolute/path/to/node_modules npm run export:sales-deck");
    process.exit(1);
  }
}

async function main() {
  await mkdir(outputDir, { recursive: true });

  let serverProcess = null;

  if (!(await canReach(deckUrl))) {
    console.log(`Starting local Next.js server at ${baseUrl} ...`);
    serverProcess = startNextServer();
    await waitForUrl(deckUrl, requestTimeoutMs);
  }

  const { chromium } = await loadPlaywright();
  const browser = await chromium.launch({
    executablePath,
    headless: true,
  });

  try {
    const page = await browser.newPage({
      deviceScaleFactor: 1,
      viewport: { height: 720, width: 1280 },
    });

    await page.goto(deckUrl, { waitUntil: "networkidle" });
    await page.locator("[data-sales-deck-ready='true']").waitFor({ state: "visible" });
    await page.evaluate(() => {
      for (const image of Array.from(document.images)) {
        image.loading = "eager";
      }

      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(1200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.evaluate(async () => {
      if (document.fonts) {
        await document.fonts.ready;
      }

      await Promise.all(
        Array.from(document.images).map(async (image) => {
          if (image.complete) {
            return;
          }

          if (typeof image.decode === "function") {
            try {
              await image.decode();
              return;
            } catch {
              return;
            }
          }

          await new Promise((resolve) => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", resolve, { once: true });
          });
        }),
      );
    });

    const response = await fetch(deckUrl);
    const html = await response.text();
    await writeFile(htmlPath, html, "utf8");

    await page.pdf({
      landscape: true,
      margin: { bottom: "0", left: "0", right: "0", top: "0" },
      path: pdfPath,
      preferCSSPageSize: true,
      printBackground: true,
    });

    await access(pdfPath);
    const pdfStats = await stat(pdfPath);
    const htmlStats = await stat(htmlPath);

    console.log(`Saved PDF: ${pdfPath} (${Math.round(pdfStats.size / 1024)} KB)`);
    console.log(`Saved HTML snapshot: ${htmlPath} (${Math.round(htmlStats.size / 1024)} KB)`);
  } finally {
    await browser.close();

    if (serverProcess) {
      serverProcess.kill("SIGTERM");
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
