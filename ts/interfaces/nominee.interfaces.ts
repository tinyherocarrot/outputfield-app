import { Location } from "../types/location.types";
import { NomineeStatus } from '../enums/nomineeStatus.enums';

export interface Nominee {
  name: string;
  email: string;
  website_url: string;
  genre: string[];
  date_created: Date;
  location: Location,
  status: NomineeStatus
}
