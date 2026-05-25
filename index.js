import { loadEnvFile } from 'node:process';
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

let pathToSave = '/home/ederts/Documentos/Cursos de Programação/DNC/Aula em Texto/Matéria 8/';
let disciplineToCopy = 'Matéria 8'
let actualClasses = 1;
let content;
let classTitle;

(async () => {
    loadEnvFile('./.env');

    const browser = await chromium.launch({headless: false, slowMo: 400});
    const page = await browser.newPage();
    
    await page.goto('https://app.itsdnc.com.br/login');
    console.log('welcome to ', page.url());

    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;
    await page.getByLabel(/email/i).fill(email);
    await page.getByRole('textbox', { name: 'Senha' }).fill(password);
    await page.getByRole('button', { name: 'Entrar' }).click();
    console.log('you are logged in')

    await classesIterator(page);

    console.log('All content was collected!');
    await browser.close();
})();

async function classesIterator(page) {
    const discipline = new RegExp(`\\b${disciplineToCopy}\\b`,"i");
    let end = false;

    while (!end) {
        const classes = new RegExp(`\\b${actualClasses}. \\b`);

        console.log('browsing...');
        await page.getByRole('link', { name: /\bCursos\b/ }).click();
        await page.getByRole('heading', { name: 'Engenheiro de Software' }).click();
        await page.getByRole('button', { name: discipline }).click();
        console.log('into discipline...');

        try {
            await page.getByRole('button').locator('span').getByText(classes).click({timeout: 250});
            await tryTab(page);
        } catch (error) {
            console.log(`End of classes of ${disciplineToCopy}`);
            end = true;
        }
    }
    return;
}

async function tryTab(page) {
    try {
        console.log('waiting for tab...')
        await page.getByRole('tab', { name: /\bResumo\b/ }).waitFor({state: 'visible'});
        console.log('try tab')
        await page.getByRole('tab', { name: /\bResumo\b/ }).click({timeout: 250});
        console.log('tab ok, go to panel')
        content = await page.getByRole('tabpanel').innerHTML();

        let title = 'title';
        if (await page.getByRole('tabpanel').getByRole('heading').nth(0).isVisible()) {
            console.log('catching title...')
            title = await page.getByRole('tabpanel').getByRole('heading').nth(0).innerHTML();
        }

        classTitle = `Aula ${actualClasses} - ${title}`;
        console.log(`go to save ${classTitle}`)
        saver(content);
        actualClasses = actualClasses + 1;
        return;
    } catch (TimeoutError) {
        console.log(`jump ${actualClasses}`)
        actualClasses = actualClasses + 1;
        return;
    }
}

function saver(content) {
    console.log('securing falename...');
    const secureFileName = sanitizeFileName(classTitle);

    console.log('saving...');
    writeFileSync(`${pathToSave}${secureFileName}`, content, { flag: 'w+' }, err => {
        console.log(err);
    });
    return;
}

function sanitizeFileName(classTitle) {
    const secureFileName = classTitle.replace(/[\\/:*?"<>|]/g, '-');
    return secureFileName;
}