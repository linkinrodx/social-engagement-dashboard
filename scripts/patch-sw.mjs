import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// Resolve the output browser directory
const browserDir = join(projectRoot, 'dist', 'social-engagement-dashboard', 'browser');
const swPath = join(browserDir, 'ngsw-worker.js');

let swContent = readFileSync(swPath, 'utf-8');

const customHandler = `

// ---- PWA manifest theming ----
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.endsWith('/manifest.webmanifest')) {
    event.respondWith(handleManifestRequest(event.request));
  }
});

async function handleManifestRequest(request) {
  const cookies = request.headers.get('Cookie') || '';
  const isDark = cookies.includes('theme=dark');

  const bgColor = isDark ? '#1e1e1e' : '#f5f5f5';

  const manifest = {
    name: 'Social Engagement Dashboard',
    short_name: 'SE Dashboard',
    description: 'Dashboard para monitorear la actividad del bot de engagement social',
    start_url: './',
    display: 'standalone',
    background_color: bgColor,
    theme_color: bgColor,
    scope: './',
    icons: [
      { src: 'icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: 'icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: 'icon-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };

  return new Response(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
  });
}
`;

writeFileSync(swPath, swContent + customHandler, 'utf-8');
console.log('Patched ngsw-worker.js with custom manifest handler.');
