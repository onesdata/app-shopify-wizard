import { test, expect } from "@playwright/test";

const SCREENS = [
  { path: "/preview", name: "dashboard" },
  { path: "/preview/screens", name: "gallery" },
];

test.describe("Visual Regression Tests", () => {
  test.describe("Preview Pages", () => {
    for (const screen of SCREENS) {
      test(`${screen.name} matches snapshot`, async ({ page }) => {
        await page.goto(screen.path);
        await page.waitForLoadState("networkidle");
        await expect(page).toHaveScreenshot(`${screen.name}.png`, {
          fullPage: true,
          maxDiffPixelRatio: 0.01,
        });
      });
    }
  });

  test.describe("Screen States", () => {
    test("dashboard - empty state", async ({ page }) => {
      await page.goto("/preview");
      await page.click('button:has-text("Vacío")');
      await page.waitForTimeout(500);
      await expect(page).toHaveScreenshot("dashboard-empty.png", {
        fullPage: true,
      });
    });

    test("dashboard - partial state", async ({ page }) => {
      await page.goto("/preview");
      await page.click('button:has-text("Parcial")');
      await page.waitForTimeout(500);
      await expect(page).toHaveScreenshot("dashboard-partial.png", {
        fullPage: true,
      });
    });

    test("dashboard - complete state", async ({ page }) => {
      await page.goto("/preview");
      await page.click('button:has-text("Completo")');
      await page.waitForTimeout(500);
      await expect(page).toHaveScreenshot("dashboard-complete.png", {
        fullPage: true,
      });
    });
  });

  test.describe("Gallery Screenshots", () => {
    const APP_SCREENS = [
      "dashboard",
      "home-setup",
      "content",
      "payments",
      "shipping",
      "reviews",
      "guide",
    ];

    for (const screenId of APP_SCREENS) {
      test(`${screenId} - configured`, async ({ page }) => {
        await page.goto("/preview/screens");
        await page.click('button:has-text("Configurado")');

        // Navigate to screen
        const buttonText = screenId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        await page.click(`button:has-text("${buttonText}")`).catch(() => {});
        await page.waitForTimeout(300);

        const screenElement = await page.$(`#screen-${screenId}`);
        if (screenElement) {
          await expect(screenElement).toHaveScreenshot(`screen-${screenId}-configured.png`);
        }
      });

      test(`${screenId} - empty`, async ({ page }) => {
        await page.goto("/preview/screens");
        await page.click('button:has-text("Vacío")');

        // Navigate to screen
        const buttonText = screenId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        await page.click(`button:has-text("${buttonText}")`).catch(() => {});
        await page.waitForTimeout(300);

        const screenElement = await page.$(`#screen-${screenId}`);
        if (screenElement) {
          await expect(screenElement).toHaveScreenshot(`screen-${screenId}-empty.png`);
        }
      });
    }
  });
});

test.describe("Responsive Tests", () => {
  const viewports = [
    { width: 1440, height: 900, name: "desktop" },
    { width: 1024, height: 768, name: "tablet" },
    { width: 768, height: 1024, name: "tablet-portrait" },
  ];

  for (const viewport of viewports) {
    test(`dashboard at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("/preview");
      await expect(page).toHaveScreenshot(`dashboard-${viewport.name}.png`, {
        fullPage: true,
      });
    });
  }
});
