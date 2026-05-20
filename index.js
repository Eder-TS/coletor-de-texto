const { loadEnvFile } = require('node:process');
const { chromium } = require('playwright');
const { fs, access } = require('node:fs');

let pathToSave = '/home/ederts/Documentos/Cursos de Programação/DNC/Aula em Texto/by Coletor de Texto';
let content;

(async () => {
    loadEnvFile('./.env');

    const browser = await chromium.launch({headless: false, slowMo: 50});
    const page = await browser.newPage();
    
    await page.goto('https://app.itsdnc.com.br/login');

    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    await page.getByLabel(/email/i).fill(email);
    await page.getByRole('textbox', { name: 'Senha' }).fill(password);
    await page.getByRole('button', { name: 'Entrar' }).click();

    await page.getByRole('link', { name: 'Cursos' }).click();
    await page.getByRole('heading', { name: 'Engenheiro de Software' }).click();

    content = await iteratorToContent(page);
    
    //saver(content);

    console.log('All content was collected!');
    await browser.close();
})();

async function iteratorToContent(page) {
    const discipline = /MATÉRIA 1 \b/i;
    const classes = /\b1. \b/;

    await page.getByRole('button', { name: discipline }).click();
    await page.getByRole('button').locator('span').getByText(classes).click();
    try {
        await page.getByRole('tab', { name: 'Resumo' }).click({timeout: 250});
        content = await page.getByRole('tabpanel').innerHTML();
        return content;
    } catch (error) {
        console.log(error);
        return content = 0;
    }
}

function saver(content) {
    
    fs.writeFile(pathToSave, content, { flag: 'w+' }, err => {});
    return;
}