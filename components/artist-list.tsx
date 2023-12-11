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
import { toSortedByDate, toSortedByDistance, toSortedByName } from '@/lib/utils';

type SortOption = 'alphabetical' | 'date' | 'location'

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

    const sortedData = useMemo(() => {
        if (data === undefined) return [];
        switch (sort) {
            case "date":
                return toSortedByDate(data)
            case "alphabetical":
                return toSortedByName(data)
            case "location":
                return toSortedByDistance(data)
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
                  src={`/${artist.previewImg}`}
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