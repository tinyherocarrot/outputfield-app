import { Location } from '@/components/artist-list';
import { JWT } from 'google-auth-library'
import { GoogleSpreadsheet } from "google-spreadsheet";

require('dotenv').config()

type ArtistRowData = {
    'name': string;
    'email': string;
    'websiteUrl': string;
    'location__description': string;
    'location__coordinates': string;
    'dateAdded': string;
    'preview': string;
  }

  export async function getArtistsData() {
    try {
      // google sheets
      const jwt = new JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY?.split(String.raw`\n`).join('\n'),
        scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive.file',
        ],
      });
      jfjfjfjfj
      // Create a document object using the ID of the spreadsheet - obtained from its URL.
      const doc = new GoogleSpreadsheet(process.env.OPF_ARTISTS_GSHEET_ID as string, jwt);

      await doc.loadInfo(); // loads document properties and worksheets
      const sheet = doc.sheetsById[0]; // or use doc.sheetsById[id] -- get first sheet in the document
      const rows = await sheet.getRows<ArtistRowData>(); // return the rows from the 1st sheet
      const allArtistsPromises = rows.map(async (row) => {
        const url = row.get('websiteUrl') as string
        return {
          // id: row._rowNumber, // FIXME: generate an id here
          name: row.get('name') as string,
          email: row.get('email') as string,
          url,
          location__description: row.get('location__description'),
          location__coordinates: row.get('location__coordinates'),
          date_added: row.get('dateAdded') as string,
          preview: row.get('preview') as string,
        };
      });
  
      return await Promise.all(allArtistsPromises);
    } catch (error) {
      //   log any errors to the console
      console.log(error);
      throw error
    }
  }