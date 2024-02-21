'use server'

import { doc, updateDoc, addDoc, getDoc, deleteDoc, DocumentReference } from "firebase/firestore"
import puppeteer from 'puppeteer';
import Jimp from 'jimp';

import { artistsColl, nomineeColl } from "@/lib/firebase/composables/useDb"
import { NomineeStatus } from "@/ts/enums/nomineeStatus.enums"
import { revalidatePath } from "next/cache"
import { Nominee } from "@/ts/interfaces/nominee.interfaces"
import { Artist } from "@/ts/interfaces/artist.interfaces"
import { getStorage } from "firebase-admin/storage";

export const updateNomineeStatus = async (nomineeId: string, formData: FormData) => {
    const status = formData.get('status') as NomineeStatus
    console.log(`Updating nominee ${nomineeId} with status: ${status}`)
    try {
        const nomineeRef = doc(nomineeColl, nomineeId)

        const nomineeSnap = await getDoc(nomineeRef)
        const { status: prevStatus } = nomineeSnap.data() as Nominee
        if (status === prevStatus){
            return
        }

        if (nomineeRef) {
            await updateDoc(nomineeRef, { status })
            revalidatePath("/admin")
        }
        if (status === 'Approved') {
            await approveNominee(nomineeId)
        } else {
            await rejectNominee(nomineeId)
        }
        console.log(`Successfully updated nominee ${nomineeId} with status: ${status}`)
    } catch (error) {
        console.error('Update nominee status failed. Error: ', error)
    }
}

// On "Approved", copy nominee to artists collection
async function approveNominee(id: string) {
    try {
        const nomineeRef = doc(nomineeColl, id)
        const nomineeSnap = await getDoc(nomineeRef)
        const {
            name,
            email,
            website_url,
            genre,
            location,
        } = nomineeSnap.data() as Nominee
        const artistRef = await addDoc(artistsColl, {
            name, email, website_url, genre, location,
            date_added: new Date(),
            preview_img: '',
        })

        // Add a reference to the new artist from the nominee doc
        await updateDoc(nomineeRef, { artistRef: artistRef })

        const artistSnap = await getDoc(artistRef)
        const artist = artistSnap.data() as Artist
        await processNewArtist(artistSnap.id, artist)

        revalidatePath("/")
        console.log(`Added artist with id: ${artistRef.id}`);
    } catch (error) {
        console.log('Approve nominee failed. Error: ', error)
        throw new Error(`approveNominee failed. Error: ${error}`);
    }
}

// On "Rejected", check for nominee in artists collection.
// If exists, remove. 
async function rejectNominee(id: string) {
    try {
        const nomineeRef = doc(nomineeColl, id)
        const nomineeSnap = await getDoc(nomineeRef)
        const {
            artistRef
        } = nomineeSnap.data() as Nominee
        const artistSnap = await getDoc(artistRef as DocumentReference)
        if (artistSnap.exists()) {
            console.log('Rejecting artist id: ', artistSnap.id)
            
            // Delete artist doc and remove reference on nominee doc
            await deleteDoc(artistRef as DocumentReference)
            await updateDoc(nomineeRef, { artistRef: '' })

            revalidatePath("/")
            console.log(`Removed artist with id: ${artistRef?.id}`);
        }
    } catch (error) {
        console.log('Reject nominee failed. Error: ', error)
    }
}

export async function addNomineeRow(data: Nominee) {
    try {
        const documentRef = await addDoc(nomineeColl, data)
        revalidatePath("/admin")
        console.log(`Added nominee with id: ${documentRef.id}`);
    } catch (error) {
        console.log('Add nominee failed. Error: ', error)
    }
}

// Process the website URL and generate an image
async function processNewArtist(artistId: string, artist: Artist) {
    try {
        const websiteUrl = artist.website_url;
        console.log("crawling ", websiteUrl);

        // Launch Puppeteer
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();

        // Navigate to the URL
        await page.goto(websiteUrl);

        // Take a screenshot
        const screenshot = await page.screenshot();

        // Close Puppeteer
        await browser.close();
    
        // Placeholder for image data, replace this with the actual image data
        const processedImage = await Jimp.read(screenshot);
        processedImage.resize(200, Jimp.AUTO, Jimp.RESIZE_HERMITE);
        const processedImageBuffer = await processedImage.getBufferAsync(Jimp.MIME_PNG)
        console.log('screenshot processed...')

        // Specify the destination path in Firebase Cloud Storage
        const storagePath = `artists/${artistId}/website.png`;

        // Upload the image to Firebase Cloud Storage
        const storageBucket = getStorage().bucket(); // Use the default bucket
        const file = storageBucket.file(storagePath);
        await file.save(processedImageBuffer, { contentType: 'image/png' });
        await file.makePublic()

        // Update the artist document with the image URL
        const preview_img = `${storagePath}`;

        const artistRef = doc(artistsColl, artistId)
        await updateDoc(artistRef, { preview_img })

        console.log(`Image saved to ${preview_img}`);
    } catch (error) {
        throw new Error(`processNewArtist failed. ${error}`);
    }
};
