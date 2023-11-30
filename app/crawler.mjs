
/** 
 * TODO: desctiption
 * */
// const playwright = require("playwright");
// const { GoogleSpreadsheet } = require("google-spreadsheet");
// const { JWT } = require ("google-auth-library")
import playwright from "playwright";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import jimp from "jimp";
import dotenv from "dotenv"
import { performance } from "perf_hooks";

dotenv.config();

const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
];

const jwt = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY,
    scopes: SCOPES,
});

// Create a document object using the ID of the spreadsheet - obtained from its URL.

const PREVIEW_IMAGE_COLUMN = 'E';

(async () => {
    const startTime = performance.now();
    let totalRows = 0;
    try {
        // Access Google sheet
        const doc = new GoogleSpreadsheet('16cpQtMOIHQbQ_Jfe9K6lnV8_DaXXP4enlrN2ZyXQMF8', jwt);
        await doc.loadInfo(); // loads document properties and worksheets
        const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] -- get first sheet in the document
        await sheet.loadCells(`${PREVIEW_IMAGE_COLUMN}1:${PREVIEW_IMAGE_COLUMN}${sheet.rowCount}`);
        const rows = await sheet.getRows(); // return the rows from the 1st sheet

        // for each row,
        const crawlPromises = rows.map(async (row) => {
            totalRows += 1;

            // open artists website in headless
            const url = row.get('Website URL')
            console.log('crawling ', url)

            const browser = await playwright.chromium.launch();
            const context = await browser.newContext({
                javaScriptEnabled: false
            });
            const page = await context.newPage();
            await page.setViewportSize({ width: 1280, height: 980 });
            await page.goto(url);

            // screenshot and save as <ARTISTNAME>.png (128 width, 108 height)
            const name = row.get('Full Name')
            const filename = `${name}.png`
            await page.screenshot({ path: `./public/${filename}` });

            // close browser
            await browser.close();

            // Use jimp to resize the screenshot
            const image = await jimp.read(`./public/${filename}`);
            await image.resize(200, jimp.AUTO, jimp.RESIZE_HERMITE);          
            // Save and overwrite the image
            await image.writeAsync(`./public/${filename}`);

            // edit row: Update (OVERWRITE) 'preview' with '<ARTISTNAME>.png'
            const cell = sheet.getCellByA1(`${PREVIEW_IMAGE_COLUMN}${row._rowNumber}`);
            cell.value = filename
            await sheet.saveUpdatedCells();
        });

        await Promise.all(crawlPromises)
        console.log('screenshot crawler finished')
    } catch (error) {
        console.log('screenshot crawler failed. Error: ', error)
    } finally {
        const endTime = performance.now();
        console.log(`Screenshot crawler took ${(endTime - startTime)/1000} seconds to complete ${totalRows} records`)
    }
})();

export {}