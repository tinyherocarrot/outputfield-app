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

type SortOptions = 'alphabetical' | 'date' | 'location'

export default function ArtistList({ data }) {
    const [sort, setSort] = useState<SortOptions>('date')

    const sortedData = useMemo(() => {
        switch (sort) {
            case "date":
                return data.sort((a, b) => new Date(a.date_added) < new Date(b.date_added))
            case "alphabetical":
                return data.sort((a, b) => a.name > b.name)
            case "location":
                  navigator.geolocation.getCurrentPosition(
                    (position: GeolocationPosition) => {
                        console.log(position);
                        return data.sort((a, b) => {
                            const { coords: { latitude: user_lat, longitude: user_lon } } = position;
                            const [a_lat, a_lon] = a.location.split(',');
                            const [b_lat, b_lon] = b.location.split(',');
                            return distance(user_lat, user_lon, a_lat, a_lon) > distance(user_lat, user_lon, b_lat, b_lon)
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
          <Select onValueChange={(value) => setSort(value)}>
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
            <HoverCard key={artist.id}>
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