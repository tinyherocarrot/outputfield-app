"use client"
import * as React from 'react';
import { DropContainer } from './drop-container';
import { DragItem } from '@/app/page';
import { Artist } from './artist-list';


export interface ContainerProps {
    artists?: any,
}

type Transfer = {
    type: 'TRANSFER',
    item: DragItem,
    // prevContainer: string,
    // nextContainer: string,
  }
  
type Reposition = {
    type: 'REPOSITION',
    item: DragItem,
}
  
type MoveNameAction = Transfer | Reposition
  
interface MoveNameState {
    [key: string]: Artist & { list: "main" | "drawer" };
}

export const ArtistListContainer: React.FC<ContainerProps> = ({ artists }) => {
    const [state, dispatch] = React.useReducer(
        (state: MoveNameState, action: MoveNameAction): MoveNameState => {
            const _state = { ...state }
            const {id, left, top} = action.item
            switch (action.type) {
                case 'TRANSFER':
                    const { list } = _state[id]
                    _state[id].list = (list === 'drawer' ? 'main' : 'drawer')
                    return _state
                case 'REPOSITION':
                    _state[id].left = left
                    _state[id].top = top
                    return _state
            }
        },
        {},
        // TODO: initializer fn assigns "list " property to "main" in each value of props.artists
    )

    const handleRepositionCard = () => {
        dispatch({ type: 'REPOSITION', ... })
    }

    const handleTransferCard = () => {
        dispatch({ type: 'TRANSFER', ... })
    }

    return (
        <>
        <DropContainer label='main' id='main' repositionCard={} data={} />
        <DropContainer label='drawer' id='drawer' data={} />
        </>
    )
}