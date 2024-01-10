import "server-only";
import {
	collection,
	onSnapshot,
	query,
	getDocs,
	doc,
	getDoc,
	updateDoc,
	orderBy,
	Timestamp,
	runTransaction,
	where,
	addDoc,
} from "firebase/firestore";

import { adminsColl, artistsColl, nomineeColl } from "./composables/useDb";
import { DocumentData } from 'firebase/firestore';

export async function getArtists() {
	let q = query(artistsColl);
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
            date_added: data.date_added.toDate(),
            preview_img: data.preview_img,
        })
	});
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