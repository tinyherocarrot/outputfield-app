"use client"

import Image from 'next/image';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { ArtistsByGenre, removeProperty, toSortedByDate, toSortedByDistance, toSortedByGenre, toSortedByName } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast"
import { CaretSortIcon, CopyIcon, MagicWandIcon, MinusCircledIcon } from '@radix-ui/react-icons';

type SortOption = 'alphabetical' | 'date' | 'location' | 'genre'

export type Location = Record<"location" | "coordinates", string>
export interface Artist {
  name: string;
  email: string;
  url: string;
  genre: string;
  dateAdded: string;
  location__description: string;
  location__coordinates: string;
  previewImg: string;
}

type Add = {
  type: 'ADD',
  key: string,
  artist: Artist
}

type Delete = {
  type: 'DELETE',
  key: string,
}

type UploadWorksAction = Add | Delete

interface UploadWorksState {
  [key: string]: Artist;
}

export default function ArtistList({ data }: { data: Artist[] }) {
    const [sort, setSort] = useState<SortOption>('date')
    const [sortedData, setSortedData] = useState<Artist[] | ArtistsByGenre>(data)
    const [isSelecting, setIsSelecting] = useState(false)
    const { toast } = useToast()

    const [state, dispatch] = useReducer(
      (state: UploadWorksState, action: UploadWorksAction): UploadWorksState => {
        const _state = { ...state }
        switch (action.type) {
        case 'ADD':
          toast({ description: `Added ${action.artist.name}`})
          return { ..._state, [action.key]: action.artist }
        case 'DELETE':
          return removeProperty(_state, `${action.key}`)
        }
      }, {}
    );

    const handleCopyArtists = useCallback(
      async () => {
        const text = Object.values(state).reduce(
          (acc, curr) => acc.concat(`${curr.name} (${curr.genre})
${curr.url}
${curr.email}

`)
        , '')
        await navigator.clipboard.writeText(text)
        toast({ description: "Copied!" })
      },
      [toast, state],
    )
    
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
          <span key={artist.email} onClick={() => dispatch({ type: "ADD", key: artist.email, artist })}>
            <ArtistName name={artist.name} previewImg={artist.previewImg} />
            <span className='text-7xl'>{(i + 1) !== arr.length ? ', ': '.'}</span>
          </ span>
        ))
      } else {
        return Object.entries(sortedData as ArtistsByGenre).map(([genre, artists]) => (
          <section key={genre} className='mb-14'>
            <h2>{genre}</h2>
            {artists.map((artist, i, arr) => (
              <span key={artist.email} onClick={() => dispatch({ type: "ADD", key: artist.email, artist })}>
                <ArtistName name={artist.name} previewImg={artist.previewImg} />
                <span className='text-7xl'>{(i + 1) !== arr.length ? ', ': '.'}</span>
              </span>
            ))}
          </section>
        ))
      }
    }, [sortedData])

    return (
        <div className='w-full flex flex-col h-screen'>
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
          <div className="grow">
          {content}

          </div>

          {/* <Button size="icon" className='fixed right-10 top-1/2' onClick={() => setIsSelecting(!isSelecting)}>
            <MagicWandIcon className="h-4 w-4" />
          </Button> */}
          
          <Collapsible className='sticky bottom-0 z-30 bg-white py-4 border-t border-dotted'>
            <div className="flex items-center justify-end space-x-4 px-4">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  Share Artists
                  <CaretSortIcon className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="flex items-center justify-center space-x-4 px-4">
                <Button variant="outline" size="icon" onClick={handleCopyArtists}>
                  <CopyIcon className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-col">
                  {Object.values(state).map((artist) => (
                    <div className="flex justify-between items-center w-full py-2" key={artist.email} >
                      <div className='min-w-content'>
                        <p className='italic'>{artist.name} ({artist.genre})</p>
                        <p className='break-keep'>{artist.url}</p>
                        <p>{artist.email}</p>
                      </div>
                      <div className="justify-self-end">
                        <Button variant="outline" onClick={() => dispatch({ type: "DELETE", key: artist.email })}>
                          <MinusCircledIcon className='h-4 w-4'/>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
    )
}

const ArtistName = ({ name, previewImg }: { name: string, previewImg: string }) => {
  return (
    <HoverCard>
      <HoverCardTrigger className="text-7xl cursor-copy">
        <span className="hover:underline">{name}</span>
      </HoverCardTrigger>
      <HoverCardContent>
        <Image
          src={`/${previewImg}`}
          alt={`preview image of ${name}'s website`}
          width="200"
          height="150"
        />
      </HoverCardContent>
    </HoverCard>
  )
}