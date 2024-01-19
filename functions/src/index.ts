/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {firestore} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript


import {onDocumentCreated} from "firebase-functions/v2/firestore";
import admin = require("firebase-admin");
import {Storage} from "@google-cloud/storage";
import playwright = require("playwright");
import jimp = require("jimp");
import {DocumentData} from "@google-cloud/firestore";

admin.initializeApp();

const storage = new Storage();

exports.processNewArtist = onDocumentCreated("artists/{artistId}",
  async (event) => {
    const artistData = event?.data?.data() as DocumentData;
    const websiteUrl = artistData?.website_url;

    // Your code to process the website URL and generate an image
    console.log("crawling ", websiteUrl);

    const browser = await playwright.chromium.launch();
    const playwrightContext = await browser.newContext({
      javaScriptEnabled: false,
    });
    const page = await playwrightContext.newPage();
    await page.setViewportSize({width: 1280, height: 980});
    await page.goto(websiteUrl);

    // screenshot and save as <ARTISTNAME>.png (128 width, 108 height)
    // const name = artistData.name;
    // const filename = `${name}.png`
    const screenshot = await page.screenshot();

    // Placeholder for image data, replace this with the actual image data
    const buffer = Buffer.from(screenshot);
    const imageData = buffer.toString("base64");

    const image = await jimp.read(imageData);
    image.resize(200, jimp.AUTO, jimp.RESIZE_HERMITE);

    // Specify the destination path in Firebase Cloud Storage
    const storagePath = `artists/${event.params.artistId}/image.jpg`;

    // Upload the image to Firebase Cloud Storage (default bucket)
    const storageBucket = storage.bucket("output-field.appspot.com");

    const file = storageBucket.file(storagePath);
    await file.save(imageData, {contentType: "image/jpeg"});

    // Update the document with the image URL
    const imageUrl = `gs://${storageBucket.name}/${storagePath}`;
    await event?.data?.ref.update({preview_img: imageUrl});

    console.log(`Image saved to ${imageUrl}`);
  });
