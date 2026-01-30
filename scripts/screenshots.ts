/**
 * Script de Playwright para capturar screenshots de todas las pantallas
 *
 * Uso:
 *   npm run screenshots
 *   npm run screenshots -- --state=empty
 *   npm run screenshots -- --state=configured
 *
 * Requisitos:
 *   npm install -D playwright @playwright/test
 *   npx playwright install chromium
 */

import { chromium, Browser, Page } from "playwright";
import * as fs from "fs";
import * as path from "path";

// Configuración
const BASE_URL = process.env.BASE_URL || "http://localhost:5173";
const OUTPUT_DIR = path.join(process.cwd(), "screenshots");
const VIEWPORT = { width: 1440, height: 900 };

// Pantallas a capturar
const SCREENS = [
  { path: "/preview", name: "dashboard", title: "Dashboard" },
  { path: "/preview/screens", name: "gallery", title: "Gallery" },
];

// Pantallas individuales (desde la galería)
// El id debe coincidir con screen.id y el name con screen.name de preview.screens.tsx
const APP_SCREENS = [
  { id: "dashboard", name: "Dashboard" },
  { id: "home-setup", name: "Home Setup" },
  { id: "content", name: "Contenido" },
  { id: "payments", name: "Pagos" },
  { id: "shipping", name: "Envíos" },
  { id: "stores", name: "Tiendas" },
  { id: "legal", name: "Legal" },
  { id: "reviews", name: "Reviews" },
  { id: "favorites", name: "Favoritos" },
  { id: "newsletter", name: "Newsletter" },
  { id: "notifications", name: "Notificaciones" },
  { id: "deep-links", name: "Deep Links" },
  { id: "guide", name: "Guía" },
];

interface ScreenshotOptions {
  state: "empty" | "configured" | "both";
  screens: string[];
  format: "png" | "jpeg";
  quality: number;
}

async function captureScreenshot(
  page: Page,
  url: string,
  outputPath: string,
  options: { waitFor?: string; clickBefore?: string } = {}
) {
  console.log(`  📸 Capturing: ${outputPath}`);

  await page.goto(url, { waitUntil: "networkidle" });

  // Wait for specific element if needed
  if (options.waitFor) {
    await page.waitForSelector(options.waitFor, { timeout: 5000 }).catch(() => {});
  }

  // Click something before screenshot (e.g., to change state)
  if (options.clickBefore) {
    await page.click(options.clickBefore).catch(() => {});
    await page.waitForTimeout(500);
  }

  // Wait for animations to complete
  await page.waitForTimeout(300);

  await page.screenshot({
    path: outputPath,
    fullPage: true,
  });
}

async function captureGalleryScreens(
  page: Page,
  state: "empty" | "no-data" | "configured",
  outputDir: string
) {
  const stateDir = path.join(outputDir, state);
  fs.mkdirSync(stateDir, { recursive: true });

  // Go to gallery
  await page.goto(`${BASE_URL}/preview/screens`, { waitUntil: "networkidle" });

  // Set state - buttons now have emoji prefixes
  const stateButtonText = state === "empty" ? "Pendiente" : state === "no-data" ? "Sin datos" : "Configurado";
  await page.click(`button:has-text("${stateButtonText}")`).catch(() => {});
  await page.waitForTimeout(500);

  // Capture each screen
  for (let i = 0; i < APP_SCREENS.length; i++) {
    const screen = APP_SCREENS[i];

    // Click on screen in sidebar using the exact button name
    await page.click(`button:has-text("${screen.name}")`).catch(() => {
      // Try by index if text doesn't match
      page.click(`button >> nth=${i + 2}`).catch(() => {});
    });

    await page.waitForTimeout(300);

    // Capture the screen content area
    const screenElement = await page.$(`#screen-${screen.id}`);
    if (screenElement) {
      await screenElement.screenshot({
        path: path.join(stateDir, `${screen.id}.png`),
      });
    } else {
      // Fallback to full page
      await page.screenshot({
        path: path.join(stateDir, `${screen.id}.png`),
        fullPage: false,
      });
    }

    console.log(`  ✓ ${screen.id} (${state})`);
  }
}

async function main() {
  // Parse arguments
  const args = process.argv.slice(2);
  const stateArg = args.find(a => a.startsWith("--state="))?.split("=")[1] || "both";

  console.log("\n🎬 Shopify Setup Wizard - Screenshot Generator\n");
  console.log(`  Base URL: ${BASE_URL}`);
  console.log(`  Output: ${OUTPUT_DIR}`);
  console.log(`  State: ${stateArg}\n`);

  // Create output directory
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Launch browser
  console.log("🚀 Launching browser...\n");
  const browser: Browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2, // Retina quality
  });

  const page = await context.newPage();

  try {
    // Capture preview pages
    console.log("📄 Capturing preview pages...\n");

    for (const screen of SCREENS) {
      await captureScreenshot(
        page,
        `${BASE_URL}${screen.path}`,
        path.join(OUTPUT_DIR, `${screen.name}.png`)
      );
    }

    // Capture gallery screens in different states
    if (stateArg === "all" || stateArg === "empty") {
      console.log("\n📂 Capturing empty state screens...\n");
      await captureGalleryScreens(page, "empty", OUTPUT_DIR);
    }

    if (stateArg === "all" || stateArg === "no-data") {
      console.log("\n📂 Capturing no-data state screens...\n");
      await captureGalleryScreens(page, "no-data", OUTPUT_DIR);
    }

    if (stateArg === "all" || stateArg === "configured") {
      console.log("\n📂 Capturing configured state screens...\n");
      await captureGalleryScreens(page, "configured", OUTPUT_DIR);
    }

    // Generate index HTML
    console.log("\n📝 Generating index.html...\n");
    await generateIndexHtml(OUTPUT_DIR, stateArg as "empty" | "no-data" | "configured" | "all");

    console.log("✅ Done! Screenshots saved to:", OUTPUT_DIR);
    console.log("   Open screenshots/index.html to view all screenshots.\n");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

async function generateIndexHtml(outputDir: string, state: "empty" | "no-data" | "configured" | "all") {
  const states = state === "all" ? ["empty", "no-data", "configured"] : [state];

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Screenshots - Shopify Setup Wizard</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #1a1a1a;
      color: #fff;
      padding: 40px;
    }
    h1 { font-size: 28px; margin-bottom: 8px; }
    .subtitle { color: #888; margin-bottom: 32px; }
    .state-tabs { display: flex; gap: 8px; margin-bottom: 24px; }
    .state-tab {
      padding: 10px 20px;
      background: #333;
      border: none;
      border-radius: 8px;
      color: #fff;
      cursor: pointer;
      font-size: 14px;
    }
    .state-tab.active { background: #5a9a5a; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 24px;
    }
    .card {
      background: #222;
      border-radius: 12px;
      overflow: hidden;
    }
    .card img {
      width: 100%;
      height: auto;
      display: block;
    }
    .card-info {
      padding: 16px;
    }
    .card-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .card-path {
      color: #888;
      font-size: 12px;
    }
    .hidden { display: none; }
  </style>
</head>
<body>
  <h1>📸 Screenshots</h1>
  <p class="subtitle">Shopify Setup Wizard - Generado el ${new Date().toLocaleString("es-ES")}</p>

  <div class="state-tabs">
    ${states.map(s => `<button class="state-tab${s === states[0] ? ' active' : ''}" onclick="showState('${s}')">${s === 'empty' ? 'Pendiente' : s === 'no-data' ? 'Sin datos' : 'Configurado'}</button>`).join("")}
  </div>

  ${states.map(s => `
    <div id="state-${s}" class="grid${s !== states[0] ? ' hidden' : ''}">
      ${APP_SCREENS.map(screen => `
        <div class="card">
          <a href="${s}/${screen.id}.png" target="_blank">
            <img src="${s}/${screen.id}.png" alt="${screen.id}" loading="lazy">
          </a>
          <div class="card-info">
            <div class="card-title">${screen.name}</div>
            <div class="card-path">/app/${screen.id}</div>
          </div>
        </div>
      `).join("")}
    </div>
  `).join("")}

  <script>
    function showState(state) {
      document.querySelectorAll('.grid').forEach(g => g.classList.add('hidden'));
      document.querySelectorAll('.state-tab').forEach(t => t.classList.remove('active'));
      document.getElementById('state-' + state).classList.remove('hidden');
      event.target.classList.add('active');
    }
  </script>
</body>
</html>`;

  fs.writeFileSync(path.join(outputDir, "index.html"), html);
}

// Run
main().catch(console.error);
