/**
 * Build-time prerendering script using Puppeteer
 * 
 * Generates static HTML for all SEO routes after `vite build`.
 * Each output file contains fully rendered content (headings, text, meta tags)
 * so pages work without JavaScript on static hosting.
 * 
 * Usage: bun run build && bun run scripts/prerender.ts
 */

import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distPath = join(__dirname, '..', 'dist');

// Hardcoded route slugs (avoids importing .ts file which Node can't handle)
const ROUTE_SLUGS = [
  'warszawa-krakow',
  'gdansk-warszawa',
  'wroclaw-poznan',
  'katowice-lodz',
  'poznan-warszawa',
  'lublin-krakow',
  'szczecin-gdansk',
  'bialystok-warszawa',
  'krakow-praga',
  'warszawa-berlin',
  'krakow-wieden',
  'wroclaw-drezno',
  'krakow-katowice',
  'poznan-wroclaw',
  'warszawa-gdansk',
];

const ROUTES_TO_PRERENDER = [
  '/',
  ...ROUTE_SLUGS.map(s => `/trasa/${s}`),
  '/kontakt',
  '/polityka-prywatnosci',
  '/regulamin',
];

// Simple static file server for SPA
function createStaticServer(directory: string, port: number): Promise<ReturnType<typeof createServer>> {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const url = req.url?.split('?')[0] || '/';
      let filePath = join(directory, url === '/' ? 'index.html' : url);
      
      // For SPA routes (no file extension), serve index.html
      if (!existsSync(filePath) || !filePath.includes('.')) {
        filePath = join(directory, 'index.html');
      }

      try {
        const content = readFileSync(filePath);
        const ext = filePath.split('.').pop();
        const mimeTypes: Record<string, string> = {
          'html': 'text/html; charset=utf-8',
          'js': 'application/javascript',
          'css': 'text/css',
          'json': 'application/json',
          'png': 'image/png',
          'jpg': 'image/jpeg',
          'webp': 'image/webp',
          'svg': 'image/svg+xml',
          'ico': 'image/x-icon',
          'woff2': 'font/woff2',
          'woff': 'font/woff',
        };
        res.writeHead(200, { 'Content-Type': mimeTypes[ext!] || 'application/octet-stream' });
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

async function prerenderRoute(browser: any, route: string, baseUrl: string): Promise<string> {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  const url = `${baseUrl}${route}`;
  console.log(`  🔄 Rendering: ${route}`);
  
  await page.goto(url, { 
    waitUntil: 'networkidle0',
    timeout: 30000 
  });

  // Wait for React to render content
  await page.waitForSelector('main', { timeout: 10000 }).catch(() => {
    console.log(`  ⚠️ Warning: <main> not found for ${route}`);
  });

  // Wait for Helmet to inject meta tags
  await page.waitForFunction(() => {
    const title = document.title;
    return title && title !== '' && title !== 'Vite + React + TS';
  }, { timeout: 10000 }).catch(() => {
    console.log(`  ⚠️ Warning: title may not be set for ${route}`);
  });

  // Extra settle time for dynamic content
  await new Promise(r => setTimeout(r, 1000));

  // Get full rendered HTML
  let html = await page.content();

  // Clean up Puppeteer/React artifacts that aren't needed in static output
  // Remove data-reactroot etc. but keep the rendered DOM
  
  await page.close();
  return html;
}

async function main() {
  console.log('\n🚀 Starting prerender process...\n');
  console.log(`📋 Routes to prerender: ${ROUTES_TO_PRERENDER.length}\n`);

  if (!existsSync(distPath)) {
    console.error('❌ Error: dist/ directory not found. Run `vite build` first.');
    process.exit(1);
  }

  const PORT = 4173;
  const server = await createStaticServer(distPath, PORT);
  const baseUrl = `http://localhost:${PORT}`;

  console.log('🌐 Launching browser...\n');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let successCount = 0;
  let failCount = 0;

  try {
    for (const route of ROUTES_TO_PRERENDER) {
      try {
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

        writeFileSync(outputPath, html, 'utf-8');
        
        // Verify the output contains real content (not just SPA shell)
        const hasContent = html.includes('<h1') || html.includes('<h2');
        const hasTitle = !html.includes('<title></title>') && !html.includes('Vite + React + TS');
        const contentLength = html.length;
        
        if (hasContent && contentLength > 5000) {
          console.log(`  ✅ Saved: ${outputPath.replace(distPath, 'dist')} (${(contentLength / 1024).toFixed(1)} KB)`);
          successCount++;
        } else {
          console.log(`  ⚠️ Saved but may be incomplete: ${outputPath.replace(distPath, 'dist')} (${(contentLength / 1024).toFixed(1)} KB, hasContent=${hasContent}, hasTitle=${hasTitle})`);
          successCount++;
        }
      } catch (err) {
        console.error(`  ❌ Failed: ${route}`, err);
        failCount++;
      }
    }

    console.log(`\n🎉 Prerendering complete! ${successCount} succeeded, ${failCount} failed.\n`);
    
    // List all generated files
    console.log('📂 Generated files:');
    for (const route of ROUTES_TO_PRERENDER) {
      const filePath = route === '/' 
        ? 'dist/index.html' 
        : `dist${route}/index.html`;
      console.log(`   ${filePath}`);
    }
    console.log('');
    
  } catch (error) {
    console.error('❌ Prerender error:', error);
    process.exit(1);
  } finally {
    await browser.close();
    server.close();
  }
}

main();
