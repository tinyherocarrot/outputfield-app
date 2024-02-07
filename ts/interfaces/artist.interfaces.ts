import { Location } from "../types/location.types";

export interface Artist {
  id?: string;
  name: string;
  email: string;
  website_url: string;
  genre: string[];
  date_added: Date;
  location: Location
  preview_img: string;
}
