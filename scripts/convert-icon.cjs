const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const outDir = path.resolve(__dirname, '..', 'public');
const svgPath = path.resolve(outDir, 'icons', 'option2.svg');

const sizes = [
  { size: 192, file: 'icon-192x192.png' },
  { size: 512, file: 'icon-512x512.png' },
  { size: 512, file: 'icon-maskable-512x512.png' },
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const { size, file } of sizes) {
    await page.setViewportSize({ width: size, height: size });
    await page.goto('file://' + svgPath, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, file) });
    console.log(`✓ ${file} (${size}x${size})`);
  }

  await browser.close();
  console.log('\n✅ All icons generated');
})();
