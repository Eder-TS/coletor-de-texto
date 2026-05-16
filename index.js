const assert = require('node:assert');
const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({headless: false, slowMo: 50});
    const page = await browser.newPage();
    
    await page.goto('https://app.itsdnc.com.br/login');

    await browser.close();
})();