import { Location } from "../types/location.types";
import { NomineeStatus } from '../enums/nomineeStatus.enums';
import { DocumentData, DocumentReference } from "firebase/firestore";

export interface Nominee {
  name: string
  email: string
  website_url: string
  genre: string[]
  date_created: Date
  location: Location
  status: NomineeStatus
  artistRef?: DocumentReference<unknown, DocumentData>
}

export type NomineeWithId = Nominee & { id: string }