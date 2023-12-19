"use client"
import * as React from 'react';
import { DropContainer } from '@/components/drop-container';
import { DragItem } from '@/app/page';
import { Artist } from './artist-list';
export interface ContainerProps {
    artists?: Artist[],
}

type Transfer = {
    type: 'TRANSFER',
    item: DragItem,
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
                    const { list } = _state[id]
                    _state[id].list = (list === 'drawer' ? 'main' : 'drawer')
                    debugger
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

    const mainItems = React.useMemo(() => Object.entries(state)
        .reduce((a, [key, val]) => (val.list === 'main' ? { ...a, [key]: val } : { ...a })
    , {}), [state])

    const drawerItems = React.useMemo(() => Object.entries(state)
        .reduce((a, [key, val]) => (val.list === 'drawer' ? { ...a, [key]: val } : { ...a })
    , {}), [state])

    const handleRepositionCard = React.useCallback((item: DragItem, top: number, left: number) => {
        dispatch({ type: 'REPOSITION', item, top, left })
    }, [dispatch])

    const handleTransferCard = React.useCallback((item: DragItem) => {
        dispatch({ type: 'TRANSFER', item })
    }, [dispatch])

    return (
        <>
            <DropContainer
                label='main'
                id='main'
                repositionCard={handleRepositionCard}
                transferCard={handleTransferCard}
                data={mainItems}
            />
            <DropContainer
                label='drawer'
                id='drawer'
                repositionCard={handleRepositionCard}
                transferCard={handleTransferCard}
                data={drawerItems}
            />
        </>
    )
}