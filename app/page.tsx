import * as React from "react"
import Image from 'next/image';

import MainNav from '@/components/main-nav';
import { getArtistsData } from '@/utils/get-artists';
import ArtistList from '@/components/artist-list';
import { useDrop, XYCoord } from 'react-dnd';
import Box, { ItemTypes } from "@/components/artist-draggable";

export interface DragItem {
  type: string
  id: string
  top: number
  left: number
}

export default async function Home() {
  const artists = await getArtistsData();
  const [boxes, setBoxes] = React.useState<{
    [key: string]: {
      top: number
      left: number
      title: string
    }
  }>({
    a: { top: 20, left: 80, title: 'Drag me around' },
    b: { top: 180, left: 20, title: 'Drag me too' },
  })

  const moveBox = React.useCallback(
    (id: string, left: number, top: number) => {
      setBoxes(
        update(boxes, {
          [id]: {
            $merge: { left, top },
          },
        }),
      )
    },
    [boxes, setBoxes],
  )

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.BOX,
      drop(item: DragItem, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset() as XYCoord
        const left = Math.round(item.left + delta.x)
        const top = Math.round(item.top + delta.y)
        moveBox(item.id, left, top)
        return undefined
      },
    }),
    [moveBox],
  )

  return (
    <>
      <main className="flex min-h-screen flex-col items-center p-12">
        <MainNav />
        <ArtistList data={artists} />      
      </main>
    </>
  )
}
