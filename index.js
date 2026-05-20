const { loadEnvFile } = require('node:process');
const { chromium } = require('playwright');
const fs = require('node:fs');

let pathToSave = '/home/ederts/Documentos/Cursos de Programação/DNC/Aula em Texto/by Coletor de Texto/';
let actualClasses = 1;
let content = 1;
let classTitle;

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

    while (content !== 0) {
        await page.getByRole('link', { name: 'Cursos' }).click();
        await page.getByRole('heading', { name: 'Engenheiro de Software' }).click();

        if (content === 1) {
            content = await iteratorToContent(page);
        } else {
            content = await iteratorToContent(page);
            saver(content);
        }
    }

    console.log('All content was collected!');
    await browser.close();
})();

async function iteratorToContent(page) {
    const discipline = /MATÉRIA 1 \b/i;
    const classes = new RegExp(`\\b${actualClasses}. \\b`);
    //console.log();

    await page.getByRole('button', { name: discipline }).click();
    try {
        await page.getByRole('button').locator('span').getByText(classes).click({timeout: 250});
        console.log('entrou na aula')
        return content = await internalIterator(page);
    } catch (error) {
        console.log(`Fim das aulas da ${discipline}`);
        return content = 0;
    }
}

async function internalIterator(page) {
    try {
        await page.getByRole('tab', { name: 'Resumo' }).click({timeout: 250});
        content = await page.getByRole('tabpanel').innerHTML();
console.log('copiou conteúdo ')
        classTitle = `Aula ${actualClasses}`;
        actualClasses = actualClasses + 1;
        return content;
    } catch (TimeoutError) {
        console.log('pulou aula')
        actualClasses = actualClasses + 1;
        return content = 1;
    }
}

function saver(content) {
    fs.writeFileSync(`${pathToSave}${classTitle}`, content, { flag: 'w+' }, err => {});
    return;
}