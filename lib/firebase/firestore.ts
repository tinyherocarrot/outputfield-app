import {
    DocumentData,
	query,
	getDocs,
} from "firebase/firestore";
import { getStorage } from 'firebase-admin/storage';
import { adminsColl, artistsColl, nomineeColl } from "./composables/useDb";
import { initAdmin } from "./firebase-admin";

initAdmin()

export async function getArtists() {
	let q = query(artistsColl);
	const results = await getDocs(q);
    const artists = await Promise.all(results.docs.map(
        async (doc) => {
            let data = doc.data() as DocumentData

            let publicUrl = ''
            if (data.preview_img) {
                const filePath = `artists/${doc.id}/${data.preview_img}`;
                const bucket = getStorage().bucket()
                // await bucket.file(filePath).makePublic();
                publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`
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
                preview_img: publicUrl,
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
