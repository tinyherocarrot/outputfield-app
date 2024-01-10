import { DraggableNameType } from "@/components/artist-list-container"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function removeProperty(obj: any, propertyName: string) {
  const { [propertyName]: _, ...result } = obj
  return result
}

/**
 * finds distance between two lat/lng coords
 * @param lat1 
 * @param lon1 
 * @param lat2 
 * @param lon2 
 * @returns distance (km)
 */
export function distance(lat1: number, lon1: number, lat2: number, lon2: number) {
  var radlat1 = Math.PI * lat1/180
  var radlat2 = Math.PI * lat2/180
  var theta = lon1-lon2
  var radtheta = Math.PI * theta/180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist)
  dist = dist * 180/Math.PI
  dist = dist * 60 * 1.1515
  // Km
  dist = dist * 1.609344
  return dist
}

export function toSortedByDate(data: DraggableNameType[]) {
  return [...data].sort(
    (a, b) => a.date_added.getTime() - b.date_added.getTime()
  )
}

export function toSortedByName(data: DraggableNameType[]) {
  return [...data].sort(
    (a, b) => a.name < b.name ? -1 : 1
  )
}

export function toSortedByDistance(position: any, data: DraggableNameType[]) {
  return [...data].sort((a, b) => {
    const { coords: { latitude: user_lat, longitude: user_lon } } = position;
    const { latitude: a_lat, longitude: a_lon } = a.location.coordinates;
    const { latitude: b_lat, longitude: b_lon } = b.location.coordinates;
    const distanceToA = distance(user_lat, user_lon, Number(a_lat), Number(a_lon));
    const distanceToB = distance(user_lat, user_lon, Number(b_lat), Number(b_lon));
    return distanceToA - distanceToB;
  })
}
export interface ArtistsByGenre {
  [key: string]: DraggableNameType[]
}

export function toSortedByGenre(data: DraggableNameType[]) {
  const result: ArtistsByGenre = {}
  data.forEach((artist) => {
    artist.genre.forEach((genre) => {
      if (!result[genre]) {
        result[genre] = [artist]
      } else {
        result[genre].push(artist)
      }
    })
  })
  return result
}

// Function to get latitude and longitude from a ZIP code using Google Maps Geocoding API
export async function getLatLngFromZip (zipCode: string) {
  // Construct the API URL
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;

  try {
    // Make an HTTP request
    const response = await fetch(apiUrl);
    
    // Parse the JSON response
    const data = await response.json();

    // Check if the API request was successful
    if (data.status === 'OK' && data.results.length > 0) {
      // Extract latitude and longitude
      const location = data.results[0].geometry.location;
      const latitude = location.lat;
      const longitude = location.lng;

      // Log or use the latitude and longitude
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      return [latitude, longitude]
    } else {
      // Handle the error
      console.error(`Error: Unable to get coordinates for ZIP code ${zipCode}`);
    }
  } catch (error) {
    // Handle fetch or parsing errors
    console.error('Error:', error);
  }
}
