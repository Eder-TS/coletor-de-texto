import { loadEnvFile } from 'node:process';
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

let pathToSave = '/home/ederts/Documentos/Cursos de Programação/DNC/Aula em Texto/by Coletor de Texto/';
let actualClasses = 1;
let content;
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

    await classesIterator(page);

    console.log('All content was collected!');
    await browser.close();
})();

async function classesIterator(page) {
    const discipline = /MATÉRIA 1 \b/i;
    let end = false;
    while (!end) {
        const classes = new RegExp(`\\b${actualClasses}. \\b`);

        await page.getByRole('link', { name: 'Cursos' }).click();
        await page.getByRole('heading', { name: 'Engenheiro de Software' }).click();
        await page.getByRole('button', { name: discipline }).click();

        try {
            await page.getByRole('button').locator('span').getByText(classes).click({timeout: 250});
            await tryTab(page);
        } catch (error) {
            console.log(`Fim das aulas da ${discipline}`);
            end = true;
        }
    }
    end = false;
    return;
}

async function tryTab(page) {
    try {
        await page.getByRole('tab', { name: 'Resumo' }).click({timeout: 250});
        content = await page.getByRole('tabpanel').innerHTML();
        console.log('copiou conteúdo ')
        classTitle = `Aula ${actualClasses}`;
        saver(content);
        actualClasses = actualClasses + 1;
        return;
    } catch (error) {
        console.log(`pulou aula ${actualClasses}`)
        actualClasses = actualClasses + 1;
        return;
    }
}

function saver(content) {
    writeFileSync(`${pathToSave}${classTitle}`, content, { flag: 'w+' }, err => {
        console.log(err);
    });
    return;
}