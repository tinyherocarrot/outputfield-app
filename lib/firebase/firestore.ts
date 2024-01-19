import {
    DocumentData,
	query,
	getDocs,
} from "firebase/firestore";
import { getStorage, getDownloadURL } from 'firebase-admin/storage';
import { adminsColl, artistsColl, nomineeColl } from "./composables/useDb";
import { initAdmin } from "./firebase-admin";

initAdmin()

export async function getArtists() {
	let q = query(artistsColl);
	const results = await getDocs(q);
    const artists = await Promise.all(results.docs.map(
        async (doc) => {
            let data = doc.data() as DocumentData

            let downloadURL = ''
            if (data.preview_img) {
                const fileRef = getStorage().bucket('output-field.appspot.com').file(data.preview_img);
                downloadURL= await getDownloadURL(fileRef);
            }

            return ({
                id: doc.id,
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
                preview_img: downloadURL,
            })
        }
    ))
    return artists
}

export const getNominees = async () => {
    let q = query(nomineeColl);
	const results = await getDocs(q);
	return results.docs.map((doc) => {
        let data = doc.data() as DocumentData
		return ({
            id: doc.id,
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
            date_created: data.date_created.toDate(),
            status: data.status,
        })
	});
};

export const getAdmins = async () => {
    let q = query(adminsColl);
	const results = await getDocs(q);
	return results.docs.map((doc) => {
        let data = doc.data() as DocumentData
		return ({
            id: doc.id,
            email: data.email,
        })
	});
}
