"use client"

import * as React from 'react';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerFooter,
  } from "@/components/ui/drawer"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { DropContainer } from '@/components/drop-container';
import { DragItem } from '@/app/page';
import { Artist } from './artist-list';
import { Button } from '@/components/ui/button';
import { CopyIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ArtistsByGenre, toSortedByDate, toSortedByDistance, toSortedByGenre, toSortedByName } from '@/lib/utils';
export interface ContainerProps {
    artists?: Artist[],
}

type SortOption = 'alphabetical' | 'date' | 'location' | 'genre'

export type ListTypes = "main" | "drawer"

type Transfer = {
    type: 'TRANSFER',
    item: DragItem,
    nextList: ListTypes
    top: number,
    left: number,
}
  
type Reposition = {
    type: 'REPOSITION',
    item: DragItem,
    top: number,
    left: number,
}
  
type MoveNameAction = Transfer | Reposition

export type DraggableNameType = Artist & DragItem & { list: "main" | "drawer" };
export interface MoveNameState {
    [key: string]: DraggableNameType
}

export const ArtistListContainer: React.FC<ContainerProps> = ({ artists }) => {
    const { toast } = useToast()
    const [open, setOpen] = React.useState(false)
    const [sort, setSort] = React.useState<SortOption>('date')
    const [state, dispatch] = React.useReducer(
        (state: MoveNameState, action: MoveNameAction): MoveNameState => {
            const _state = { ...state }
            const { id } = action.item
            switch (action.type) {
                case 'TRANSFER':
                    _state[id].left = action.left
                    _state[id].top = action.top
                    _state[id].list = action.nextList
                    return _state
                case 'REPOSITION':
                    _state[id].left = action.left
                    _state[id].top = action.top
                    return _state
            }
        },
        artists || [],
        (initialArg) => {
            return initialArg?.reduce(
                (a, c) => (
                    {
                        ...a,
                        [c.email]: {
                            ...c,
                            title: c.name,
                            top: 0,
                            left: 0,
                            list: "main"
                        }
                    }
                )
            , {})
        }
    )

    const mainItems = React.useMemo(() => Object.fromEntries(Object.entries(state)
        .filter(([key, val]) => val.list === 'main'))
    , [state])

    const drawerItems = React.useMemo(() => Object.values(state)
        .filter((val) => val.list === 'drawer')
    , [state])

    const handleRepositionCard = React.useCallback((item: DragItem, top: number, left: number) => {
        dispatch({ type: 'REPOSITION', item, top, left })
    }, [dispatch])

    const handleTransferCard = React.useCallback((item: DragItem, nextList: ListTypes, top: number, left: number) => {
        dispatch({ type: 'TRANSFER', item, nextList, top, left })
    }, [dispatch])

    const [sortedData, setSortedData] = React.useState<DraggableNameType[] | ArtistsByGenre>()

    const handleCopyArtists = React.useCallback(
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

      React.useEffect(() => {
        let active = true
        if (mainItems === undefined) setSortedData([]);
        let artistsArray = Object.values(mainItems)
        switch (sort) {
            case "date":
                setSortedData(toSortedByDate(artistsArray));
                break;
            case "alphabetical":
                setSortedData(toSortedByName(artistsArray));
                break;
            case "genre":
                setSortedData(toSortedByGenre(artistsArray));
                break;
            case "location":
                calculateDistance()
                break;
            default:
                setSortedData(artistsArray)
                break
        }
  
        async function calculateDistance() {
            const position: GeolocationPosition = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            const res = toSortedByDistance(position, artistsArray)
            if (!active) { return }
            setSortedData(res)
        }
        return () => { active = false }
    }, [sort, mainItems])
  
    //   const content = React.useMemo(() => {
    //     if (sortedData.constructor === Array) {
    //       return [...sortedData as Artist[]].map((artist, i, arr) => (
    //         <span key={artist.email} onClick={() => dispatch({ type: "ADD", key: artist.email, artist })}>
    //           <ArtistName name={artist.name} previewImg={artist.previewImg} />
    //           <span className='text-7xl'>{(i + 1) !== arr.length ? ', ': '.'}</span>
    //         </ span>
    //       ))
    //     } else {
    //       return Object.entries(sortedData as ArtistsByGenre).map(([genre, artists]) => (
    //         <section key={genre} className='mb-14'>
    //           <h2>{genre}</h2>
    //           {artists.map((artist, i, arr) => (
    //             <span key={artist.email} onClick={() => dispatch({ type: "ADD", key: artist.email, artist })}>
    //               <ArtistName name={artist.name} previewImg={artist.previewImg} />
    //               <span className='text-7xl'>{(i + 1) !== arr.length ? ', ': '.'}</span>
    //             </span>
    //           ))}
    //         </section>
    //       ))
    //     }
    //   }, [sortedData])

    return (
        <>
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
            <DropContainer
                label='main'
                repositionCard={handleRepositionCard}
                transferCard={handleTransferCard}
                data={sortedData}
                className='h-full'
            >
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTrigger asChild className='fixed bottom-6 right-6'>
                        <p
                            className="w-[300px] p-3 text-right border border-dashed"
                            onClick={() => setOpen(true)}
                            onDragEnter={() => setOpen(true)}
                        >
                            Share
                        </p>
                    </DrawerTrigger>
                    <DrawerContent className='h-full md:h-2/3'>
                        <DrawerHeader>
                            <DrawerTitle>Share Artists</DrawerTitle>
                            <DrawerDescription>Copy artists to clipboard</DrawerDescription>
                        </DrawerHeader>

                        <DropContainer
                            label='drawer'
                            repositionCard={handleRepositionCard}
                            transferCard={handleTransferCard}
                            data={drawerItems}
                            className='h-full'
                        />

                        <DrawerFooter>
                            <Button variant="outline" onClick={handleCopyArtists}>
                                <CopyIcon className="h-4 w-4 m-2" />
                                Copy
                            </Button>
                        <DrawerClose>
                            Close
                        </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </DropContainer>
        </>
    )
}