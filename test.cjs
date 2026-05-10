const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('response', response => {
    if (!response.ok()) {
      console.log('PAGE RESPONSE ERROR:', response.status(), response.url());
    }
  });

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  } catch (err) {
    console.error('Error visiting 5173:', err.message);
    try {
      await page.goto('http://localhost:5175', { waitUntil: 'networkidle2' });
    } catch (err2) {
      console.error('Error visiting 5175:', err2.message);
    }
  }

  await browser.close();
})();
