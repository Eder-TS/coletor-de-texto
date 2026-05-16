const { loadEnvFile } = require('node:process');
const { chromium } = require('playwright');
const fs = require('node:fs');

(async () => {
    loadEnvFile('./.env');

    const browser = await chromium.launch({headless: false, slowMo: 200});
    const page = await browser.newPage();
    
    await page.goto('https://app.itsdnc.com.br/login');

    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    await page.getByLabel(/email/i).fill(email);
    await page.getByRole('textbox', { name: 'Senha' }).fill(password);
    await page.getByRole('button', { name: 'Entrar' }).click();

    await page.getByRole('link', { name: 'Cursos' }).click();
    await page.getByRole('heading', { name: 'Engenheiro de Software' }).click();
    await page.getByRole('button', { name: 'MATÉRIA 1 1. Introdução ao' }).click();
    await page.getByRole('button', { name: '2. Introdução à Tecnologia' }).click();
    await page.getByRole('tab', { name: 'Resumo' }).click();
    
    const content = await page.getByRole('tabpanel').innerHTML();
    saver(content);
    await browser.close();
})();

function saver(content) {
    const path = '/home/ederts/Documentos/Cursos de Programação/DNC/Aula em Texto/by Coletor de Texto/aula 2'
    fs.writeFile(path, content, { flag: 'w+' }, err => {});
    // /home/ederts/Documentos/Cursos de Programação/DNC/Aula em Texto/
    return;
}