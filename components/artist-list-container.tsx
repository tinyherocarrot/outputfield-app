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
import { DropContainer } from '@/components/drop-container';
import { DragItem } from '@/app/page';
import { Artist } from './artist-list';
import { Button } from './ui/button';
import { CopyIcon } from 'lucide-react';
export interface ContainerProps {
    artists?: Artist[],
}

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
  
export interface MoveNameState {
    [key: string]: Artist & DragItem & { list: "main" | "drawer" };
}

export const ArtistListContainer: React.FC<ContainerProps> = ({ artists }) => {
    const [open, setOpen] = React.useState(false)
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

    const drawerItems = React.useMemo(() => Object.fromEntries(Object.entries(state)
    .filter(([key, val]) => val.list === 'drawer'))
    , [state])

    const handleRepositionCard = React.useCallback((item: DragItem, top: number, left: number) => {
        dispatch({ type: 'REPOSITION', item, top, left })
    }, [dispatch])

    const handleTransferCard = React.useCallback((item: DragItem, nextList: ListTypes, top: number, left: number) => {
        dispatch({ type: 'TRANSFER', item, nextList, top, left })
    }, [dispatch])

    return (
        <DropContainer
            label='main'
            repositionCard={handleRepositionCard}
            transferCard={handleTransferCard}
            data={mainItems}
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
                        <Button variant="outline">
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
    )
}