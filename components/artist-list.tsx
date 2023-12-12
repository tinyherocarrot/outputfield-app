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
import { useEffect, useMemo, useState } from 'react';
import { ArtistsByGenre, toSortedByDate, toSortedByDistance, toSortedByGenre, toSortedByName } from '@/lib/utils';

type SortOption = 'alphabetical' | 'date' | 'location' | 'genre'

export type Location = Record<"location" | "coordinates", string>
export interface Artist {
  name: string;
  email: string;
  genre: string;
  dateAdded: string;
  location__description: string;
  location__coordinates: string;
  previewImg: string;
}

export default function ArtistList({ data }: { data: Artist[] }) {
    const [sort, setSort] = useState<SortOption>('date')
    const [sortedData, setSortedData] = useState<Artist[] | ArtistsByGenre>(data)

    useEffect(() => {
      let active = true
      if (data === undefined) setSortedData([]);
        switch (sort) {
            case "date":
                setSortedData(toSortedByDate(data));
                break;
            case "alphabetical":
                setSortedData(toSortedByName(data));
                break;
            case "genre":
                setSortedData(toSortedByGenre(data));
                break;
            case "location":
                calculateDistance()
                break;
            default:
                setSortedData(data)
                break
        }

        async function calculateDistance() {
          const position: GeolocationPosition = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          const res = toSortedByDistance(position, data)
          if (!active) { return }
          setSortedData(res)
        }
        return () => { active = false }
    }, [sort, data])

    const content = useMemo(() => {
      if (sortedData.constructor === Array) {
        return [...sortedData as Artist[]].map((artist, i, arr) => (
          <HoverCard key={artist.email}>
            <HoverCardTrigger className="text-[75px]">
              <span className="hover:underline">{artist.name}</span>
              {(i + 1) !== arr.length ? ', ': '.'}
            </HoverCardTrigger>
            <HoverCardContent>
              <Image
                src={`/${artist.previewImg}`}
                alt={`preview image of ${artist.name}'s website`}
                width="200"
                height="150"
              />
            </HoverCardContent>
          </HoverCard>
        ))
      } else {
        return Object.entries(sortedData as ArtistsByGenre).map(([genre, artists]) => (
          <section key={genre} className='mb-14'>
            <h2>{genre}</h2>
            {artists.map((artist, i, arr) => (
              <HoverCard key={artist.email}>
                <HoverCardTrigger className="text-[75px]">
                  <span className="hover:underline">{artist.name}</span>
                  {(i + 1) !== arr.length ? ', ': '.'}
                </HoverCardTrigger>
                <HoverCardContent>
                  <Image
                    src={`/${artist.previewImg}`}
                    alt={`preview image of ${artist.name}'s website`}
                    width="200"
                    height="150"
                  />
                </HoverCardContent>
              </HoverCard>
            ))}
          </section>
        ))
      }
    }, [sortedData])

    return (
        <div className='w-full'>
          <Select onValueChange={(value) => setSort(value as SortOption)}>
            <SelectTrigger className="w-full mb-12">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="alphabetical">A - Z</SelectItem>
              <SelectItem value="location">Near Me</SelectItem>
              <SelectItem value="genre">Genre</SelectItem>
            </SelectContent>
          </Select>
          {content}
        </div>
    )
}