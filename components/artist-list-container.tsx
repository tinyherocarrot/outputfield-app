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
    const [state, dispatch] = React.useReducer(
        (state: MoveNameState, action: MoveNameAction): MoveNameState => {
            const _state = { ...state }
            const { id } = action.item
            switch (action.type) {
                case 'TRANSFER':
                    _state[id].left = action.left
                    _state[id].top = action.top
                    // _state[id].list = action.nextList === 'main' ? 'drawer' : 'main'
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
        // .reduce((a, [key, val]) => (val.list === 'main' ? { ...a, [key]: val } : { ...a }), {})
    , [state])

    const drawerItems = React.useMemo(() => Object.fromEntries(Object.entries(state)
    .filter(([key, val]) => val.list === 'drawer'))
        // .reduce((a, [key, val]) => (val.list === 'drawer' ? { ...a, [key]: val } : { ...a }), {})
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
        >
            {/* <Drawer>
                <DrawerTrigger>Share</DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                    <DrawerTitle>Are you sure absolutely sure?</DrawerTitle>
                    <DrawerDescription>This action cannot be undone.</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                    <Button>Submit</Button>
                    <DrawerClose>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer> */}
            <DropContainer
                label='drawer'
                repositionCard={handleRepositionCard}
                transferCard={handleTransferCard}
                data={drawerItems}
            />
        </DropContainer>
    )
}