/**
 * Build-time prerendering script using Puppeteer
 * 
 * This script runs after the Vite build and generates static HTML
 * for specified routes, capturing the fully rendered page including
 * react-helmet meta tags.
 * 
 * Usage: Run after `vite build` via `bun run prerender`
 */

import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distPath = join(__dirname, '..', 'dist');

// Routes to prerender - add new routes here
const ROUTES_TO_PRERENDER = [
  '/',
  '/trasa/warszawa-krakow',
  '/trasa/gdansk-warszawa',
  '/trasa/wroclaw-poznan',
  '/trasa/katowice-lodz',
  '/trasa/poznan-warszawa',
  '/trasa/lublin-krakow',
  '/trasa/szczecin-gdansk',
  '/trasa/bialystok-warszawa',
  '/trasa/krakow-praga',
  '/trasa/warszawa-berlin',
  '/trasa/krakow-wieden',
  '/trasa/wroclaw-drezno',
  '/kontakt',
  '/polityka-prywatnosci',
  '/regulamin',
];

// Simple static file server
function createStaticServer(directory: string, port: number): Promise<ReturnType<typeof createServer>> {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let filePath = join(directory, req.url === '/' ? 'index.html' : req.url!);
      
      // For SPA routes, serve index.html
      if (!existsSync(filePath) || !filePath.includes('.')) {
        filePath = join(directory, 'index.html');
      }

      try {
        const content = readFileSync(filePath);
        const ext = filePath.split('.').pop();
        const mimeTypes: Record<string, string> = {
          'html': 'text/html',
          'js': 'application/javascript',
          'css': 'text/css',
          'json': 'application/json',
          'png': 'image/png',
          'jpg': 'image/jpeg',
          'svg': 'image/svg+xml',
          'ico': 'image/x-icon',
        };
        res.writeHead(200, { 'Content-Type': mimeTypes[ext!] || 'text/plain' });
        res.end(content);
      } catch {
        res.writeHead(404);
        res.end('Not found');
      }
    });

    server.listen(port, () => {
      console.log(`📦 Static server running on http://localhost:${port}`);
      resolve(server);
    });
  });
}

async function prerenderRoute(browser: puppeteer.Browser, route: string, baseUrl: string): Promise<string> {
  const page = await browser.newPage();
  
  // Set a reasonable viewport
  await page.setViewport({ width: 1280, height: 800 });
  
  // Navigate to the route
  const url = `${baseUrl}${route}`;
  console.log(`  🔄 Rendering: ${route}`);
  
  await page.goto(url, { 
    waitUntil: 'networkidle0',
    timeout: 30000 
  });

  // Wait for main content container to be present
  await page.waitForSelector('main', { timeout: 10000 }).catch(() => {
    console.log(`  ⚠️ Warning: <main> element not found for ${route}`);
  });

  // Wait for react-helmet to update the head
  await page.waitForFunction(() => {
    const helmet = document.querySelector('[data-rh="true"]');
    const hasTitle = document.title !== '' && document.title !== 'Vite + React + TS';
    return helmet !== null || hasTitle;
  }, { timeout: 10000 }).catch(() => {
    console.log(`  ⚠️ Warning: Helmet tags might not be fully loaded for ${route}`);
  });

  // Wait for any dynamic content to settle
  await page.waitForNetworkIdle({ timeout: 5000 }).catch(() => {});

  // Get the full HTML
  const html = await page.content();
  
  await page.close();
  
  return html;
}

async function main() {
  console.log('\n🚀 Starting prerender process...\n');

  // Check if dist exists
  if (!existsSync(distPath)) {
    console.error('❌ Error: dist/ directory not found. Run `vite build` first.');
    process.exit(1);
  }

  const PORT = 4173;
  const server = await createStaticServer(distPath, PORT);
  const baseUrl = `http://localhost:${PORT}`;

  // Launch Puppeteer
  console.log('🌐 Launching browser...\n');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    for (const route of ROUTES_TO_PRERENDER) {
      const html = await prerenderRoute(browser, route, baseUrl);
      
      // Determine output path
      let outputPath: string;
      if (route === '/') {
        outputPath = join(distPath, 'index.html');
      } else {
        const routeDir = join(distPath, route);
        mkdirSync(routeDir, { recursive: true });
        outputPath = join(routeDir, 'index.html');
      }

      // Write the prerendered HTML
      writeFileSync(outputPath, html);
      console.log(`  ✅ Saved: ${outputPath.replace(distPath, 'dist')}`);
    }

    console.log('\n🎉 Prerendering complete!\n');
  } catch (error) {
    console.error('❌ Prerender error:', error);
    process.exit(1);
  } finally {
    await browser.close();
    server.close();
  }
}

main();
