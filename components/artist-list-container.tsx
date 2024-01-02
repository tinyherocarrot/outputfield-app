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
Dialog,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader,
DialogTitle,
DialogTrigger,
} from "@/components/ui/dialog"
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
import { DraggableName } from './draggable-name';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

type Reset = {
    type: 'RESET'
}
  
type MoveNameAction = Transfer | Reposition | Reset

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
            switch (action.type) {
                case 'TRANSFER':
                    _state[action.item.id].left = action.left
                    _state[action.item.id].top = action.top
                    _state[action.item.id].list = action.nextList
                    return _state
                case 'REPOSITION':
                    _state[action.item.id].left = action.left
                    _state[action.item.id].top = action.top
                    return _state
                case 'RESET':
                    return Object.fromEntries(
                        Object.entries(_state).map(([key, item]) => {
                            // only reset main items
                            if (item.list === 'main') {
                                return [key, {
                                ...item,
                                top: 0,
                                left: 0
                            }]
                            } else {
                                return [key, item]
                            }
                    }))
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

    const handleReset = React.useCallback(() => dispatch({ type: 'RESET'}), [])
    React.useEffect(() => handleReset(), [sort, handleReset])

    const handleRepositionCard = React.useCallback((item: DragItem, top: number, left: number) => {
        dispatch({ type: 'REPOSITION', item, top, left })
    }, [dispatch])

    const handleTransferCard = React.useCallback((item: DragItem, nextList: ListTypes, top: number, left: number) => {
        dispatch({ type: 'TRANSFER', item, nextList, top, left })
    }, [dispatch])

    const mainItems = React.useMemo(() => Object.fromEntries(Object.entries(state)
        .filter(([key, val]) => val.list === 'main'))
    , [state])

    const drawerItems = React.useMemo(() => {
        return Object.values(state)
        .filter((val) => val.list === 'drawer')
        .map((artist, i, arr) => {
            const { email, title, top, left, list, previewImg } = artist
            const _title = `${title}${(i + 1) !== arr.length ? ', ': '.'}`
            return (
                <DraggableName
                    key={email}
                    id={email}
                    title={_title}
                    previewImg={previewImg}
                    top={top}
                    left={left}
                    list={list}
                />
            )
            })
    }
    , [state])


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
  
      const content = React.useMemo(() => {
        // let active = true
        if (mainItems === undefined) return
        let artistsArray = Object.values(mainItems)
        let sortedData: DraggableNameType[] | ArtistsByGenre = artistsArray
        switch (sort) {
            case "genre":
                sortedData = toSortedByGenre(artistsArray)
                return Object.entries(sortedData as ArtistsByGenre).map(([genre, artists]) => {
                    const noShow = artists.every(({ top, left }) => (top !== 0) && (left !== 0))
                    const names = artists.map((artist, i, arr) => {
                        const { email, title, top, left, list, previewImg } = artist
                        const _title = `${title}${(i + 1) !== arr.length ? ', ': '.'}`
                        return (
                          <DraggableName
                            key={email}
                            id={email}
                            title={_title}
                            previewImg={previewImg}
                            top={top}
                            left={left}
                            list={list}
                          />
                        )})
                    if (noShow) {
                        return names
                    } else {
                        return (
                            <section key={genre} className='mb-14 w-full'>
                                <h2>{genre}</h2>
                                {names}
                            </section>
                        )
                    }
                  })
            case "date":
                sortedData = toSortedByDate(artistsArray)
                break
            case "alphabetical":
                sortedData = toSortedByName(artistsArray)
                break
            // case "location":
            //     calculateDistance()

            
        }return sortedData.map((artist, i) => {
                const { email, title, top, left, list, previewImg } = artist
                const _title = `${title}${(i + 1) !== Object.keys(sortedData).length ? ', ': '.'}`
                return (
                    <DraggableName
                        key={email}
                        id={email}
                        title={_title}
                        previewImg={previewImg}
                        top={top}
                        left={left}
                        list={list}
                    />
                )
                })
  
        // async function calculateDistance() {
        //     const position: GeolocationPosition = await new Promise((resolve, reject) => {
        //         navigator.geolocation.getCurrentPosition(resolve, reject);
        //     });
        //     const res = toSortedByDistance(position, artistsArray)
        //     if (!active) { return }
        //     setSortedData(res)
        // }


      }, [sort, mainItems])

    return (
        <>
            <Select onValueChange={(value) => setSort(value as SortOption)}>
                <SelectTrigger className="w-full mb-12">
                    <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="alphabetical">A - Z</SelectItem>
                    {/* <SelectItem value="location">
                     <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline"></Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                            <DialogTitle>Edit profile</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile here. Click save when you're done.
                            </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                Name
                                </Label>
                                <Input id="name" value="Pedro Duarte" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right">
                                Username
                                </Label>
                                <Input id="username" value="@peduarte" className="col-span-3" />
                            </div>
                            </div>
                            <DialogFooter>
                            <Button type="submit">Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                        </Dialog> 
                    </SelectItem> */}
                    <SelectItem value="genre">Genre</SelectItem>
                </SelectContent>
            </Select>
            <DropContainer
                label='main'
                repositionCard={handleRepositionCard}
                transferCard={handleTransferCard}
                items={content}
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
                            items={drawerItems}
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