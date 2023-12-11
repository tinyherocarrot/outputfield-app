import { Artist } from "@/components/artist-list"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

export function toSortedByDate(data: Artist[]) {
  return [...data].sort(
    (a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
  )
}

export function toSortedByName(data: Artist[]) {
  return [...data].sort(
    (a, b) => a.name < b.name ? -1 : 1
  )
}

export function toSortedByDistance(data: Artist[]) {
  navigator.geolocation.getCurrentPosition(
    (position: GeolocationPosition) => {
        return [...data].sort((a, b) => {
            const { coords: { latitude: user_lat, longitude: user_lon } } = position;
            const [a_lat, a_lon] = a.location__coordinates.split(',');
            const [b_lat, b_lon] = b.location__coordinates.split(',');
            const distanceToA = distance(user_lat, user_lon, Number(a_lat), Number(a_lon));
            const distanceToB = distance(user_lat, user_lon, Number(b_lat), Number(b_lon));
            return distanceToA - distanceToB;
        })
    },
    (error: any) => {
        console.log(error);
        return data
    }
  );
}
interface ArtistsByGenre {
  [key: string]: Artist[]
}

export function toSortedByGenre(data: Artist[]) {
  const result: ArtistsByGenre = {}
  data.forEach((artist) => {
    const genre_parsed = artist.genre.split(', ')
    genre_parsed.forEach((genre) => {
      if (!result[genre]) {
        result[genre] = [artist]
      } else {
        result[genre].push(artist)
      }
    })
  })
  return result
}