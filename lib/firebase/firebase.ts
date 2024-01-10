import "server-only";
import { artistsColl, firestore } from "./composables/useDb";
import { DocumentData } from '@google-cloud/firestore';

export const getLinks = async () => {
    const documentRefs = await artistsColl.listDocuments()
    const documentSnapshots = await firestore.getAll(...documentRefs)

    for (let documentSnapshot of documentSnapshots) {
        if (documentSnapshot.exists) {
          console.log(`Found document with data: ${documentSnapshot.id}`);
        } else {
          console.log(`Found missing document: ${documentSnapshot.id}`);
        }
     }

    const documents = documentSnapshots.map((artist) => {
        if (artist.exists) {
            const data = artist.data() as DocumentData
            return ({
                id: artist.id,
                name: data.name,
                email: data.email,
                website_url: data.website_url,
                genre: data.genre,
                location: {
                    description: data.location.description,
                    coordinates: {
                        latitude: data.location.coordinates.latitude,
                        longitude: data.location.coordinates.longitude,
                    }
                },
                date_added: data.date_added.toDate(),
                preview_img: data.preview_img,
            })
        }
    });
    
    return documents
};