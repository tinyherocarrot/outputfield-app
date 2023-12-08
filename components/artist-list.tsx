"use client"

import Image from 'next/image';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useMemo, useState } from 'react';
import { distance } from '@/lib/utils';

type SortOption = 'alphabetical' | 'date' | 'location'

export type Location = Record<"location" | "coordinates", string>
export interface Artist {
  name: string;
  email: string;
  date_added: string;
  location: Location;
  preview: string;
}

export default function ArtistList({ data }: { data: Artist[] }) {
    const [sort, setSort] = useState<SortOption>('date')

    const sortedData = useMemo(() => {
        if (data === undefined) return [];
        switch (sort) {
            // TODO: #18: extract these to util fns, and write unit tests
            case "date":
                return data.sort((a, b) => new Date(a.date_added).getTime() - new Date(b.date_added).getTime())
            case "alphabetical":
                return data.sort((a, b) => a.name > b.name ? -1 : 1)
            case "location":
                  navigator.geolocation.getCurrentPosition(
                    (position: GeolocationPosition) => {
                        console.log(position);
                        return data.sort((a, b) => {
                            const { coords: { latitude: user_lat, longitude: user_lon } } = position;
                            const [a_lat, a_lon] = a.location.coordinates.split(',');
                            const [b_lat, b_lon] = b.location.coordinates.split(',');
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
            default:
                return data
        }
    }, [data, sort])

    return (
        <div>
          <Select onValueChange={(value) => setSort(value as SortOption)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="alphabetical">A - Z</SelectItem>
              <SelectItem value="location">Near Me</SelectItem>
            </SelectContent>
          </Select>
          {sortedData?.map((artist, i, arr) => (
            <HoverCard key={artist.email}>
              <HoverCardTrigger className="text-[75px]">
                <span className="hover:underline">{artist.name}</span>
                {(i + 1) !== arr.length ? ', ': '.'}
              </HoverCardTrigger>
              <HoverCardContent>
                <Image
                  src={`/${artist.preview}`}
                  alt={`preview image of ${artist.name}'s website`}
                  width="200"
                  height="150"
                />
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
    )
}