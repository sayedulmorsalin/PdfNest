import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

// Read sitemap to get URLs
const sitemapPath = path.resolve(distDir, 'sitemap.xml');
let sitemapXml;
try {
  sitemapXml = fs.readFileSync(sitemapPath, 'utf8');
} catch (err) {
  console.error('Error reading sitemap.xml. Ensure you have built the project first.', err);
  process.exit(1);
}

// Extract URLs from sitemap
const urls = [];
const regex = /<loc>(.*?)<\/loc>/g;
let match;
while ((match = regex.exec(sitemapXml)) !== null) {
  urls.push(match[1]);
}

if (urls.length === 0) {
  console.error('No URLs found in sitemap.xml.');
  process.exit(1);
}

const siteUrl = 'https://pdfnest.shop';
const paths = urls.map(url => url.replace(siteUrl, '') || '/');

console.log(`Found ${paths.length} routes to prerender.`);

// Start static server
const app = express();
const port = 4000;
app.use(express.static(distDir));
// For SPA routing, fallback to index.html
app.use((req, res) => {
  res.sendFile(path.resolve(distDir, 'index.html'));
});

const server = app.listen(port, async () => {
  console.log(`Static server listening on port ${port}`);

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    for (const route of paths) {
      console.log(`Prerendering ${route}...`);
      const page = await browser.newPage();
      
      // Capture any console errors from the page
      page.on('console', msg => {
        if (msg.type() === 'error') {
          console.log(`Page Error (${route}): ${msg.text()}`);
        }
      });

      // Go to the page and wait for network to be idle to ensure JS has executed
      await page.goto(`http://localhost:${port}${route}`, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      // Give it a tiny bit more time for any last-minute React renders (e.g. Helmet async updates)
      await new Promise(resolve => setTimeout(resolve, 500));

      const html = await page.content();
      await page.close();

      // Determine where to save the file
      const routePath = route === '/' ? '/index.html' : `${route}/index.html`;
      const filePath = path.resolve(distDir, routePath.replace(/^\//, ''));
      
      // Ensure directory exists
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      
      // Save HTML
      fs.writeFileSync(filePath, html);
      console.log(`Saved ${filePath}`);
    }

    await browser.close();
    console.log('Prerendering completed successfully.');
  } catch (err) {
    console.error('Error during prerendering:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
