import { JWT } from 'google-auth-library'
import { GoogleSpreadsheet } from "google-spreadsheet";

type ArtistRowData = {
    'Full Name': string;
    'Website URL': string;
    'Location': string;
    'Date Added': string;
    'Preview': string;
  }
  
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
  const doc = new GoogleSpreadsheet('16cpQtMOIHQbQ_Jfe9K6lnV8_DaXXP4enlrN2ZyXQMF8', jwt);
  
  export async function getArtistsData() {
    try {
      // google sheets
      await doc.loadInfo(); // loads document properties and worksheets
      const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] -- get first sheet in the document
      const rows = await sheet.getRows<ArtistRowData>(); // return the rows from the 1st sheet
      const allArtistsPromises = rows.map(async (row) => {
        const url = row.get('Website URL')
        return {
          id: row._rowNumber, // FIXME:generate an id here
          name: row.get('Full Name'),
          url,
          location: row.get('Location'),
          date_added: row.get('Date Added'),
          preview: row.get('Preview'),
        };
      });
  
      return await Promise.all(allArtistsPromises);
    } catch (error) {
      //   log any errors to the console
      console.log(error);
    }
  }