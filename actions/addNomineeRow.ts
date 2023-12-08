'use server'

import { GoogleSpreadsheet,  } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import dotenv from "dotenv"

dotenv.config();

const NOMINATION_GSHEET_ID = "645746189"

const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
];

const jwt = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY,
    scopes: SCOPES,
});

type NomineeRowData = {
    'name': string;
    'website': string;
    'genre': string;
    'location': string;
  }

export async function addNomineeRow(data: FormData) {
    try {
        console.log('adding nominee row', data)
        const name = data.get("name");
        const email = data.get("email");
        const websiteUrl = data.get("website");
        const genre = data.get("genre");
        const location = data.get("location");
        // Access Google sheet
        const doc = new GoogleSpreadsheet(process.env.OPF_ARTISTS_GSHEET_ID as string, jwt);
        await doc.loadInfo();
        const sheet = doc.sheetsById[NOMINATION_GSHEET_ID];
        // @ts-ignore: Type error
        await sheet.addRow({ name, email, websiteUrl, genre, location });

        console.log('Add nominee finished')
    } catch (error) {
        console.log('Add nominee failed. Error: ', error)
    // } finally {
    //     const endTime = performance.now();
    //     console.log(`Screenshot crawler took ${(endTime - startTime)/1000} seconds to complete ${totalRows} records`)
    }
}