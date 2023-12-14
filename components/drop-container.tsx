import React, {CSSProperties, RefObject} from 'react'
import { useMultiDrop } from 'react-dnd-multi-backend';
import { Artist } from './artist-list';
import { DragContent } from '@/ts/types/dnd.types';
import { XYCoord } from 'react-dnd';
import { DraggableName } from './draggable-name';

export const DropContainer = ({ data }: {data: Artist[]}) => {
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

  const [_, {html5: [html5Props, html5Drop], touch: [touchProps, touchDrop]}] = useMultiDrop<DragContent, void, {isOver: boolean, canDrop: boolean}>({
    accept: 'box',
    drop: (item: DragContent, monitor) => {
        console.log(`Dropped: ${item.id}`)

        const delta = monitor.getDifferenceFromInitialOffset() as XYCoord
        const left = Math.round(item.left + delta.x)
        const top = Math.round(item.top + delta.y)
        moveBox(item.id, left, top)
        return undefined
    },
    collect: (monitor) => {
      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }
    },
  })

  
  const moveBox = React.useCallback(
    (id: string, left: number, top: number) => {
        const next = {...boxes}
        next[id].left = left
        next[id].top = top
        setBoxes(next)
    },
    [boxes],
  )

  // TODO: replace with autoprefixer+astroturf
  const containerStyle: CSSProperties = {
    border: '1px dashed black',
    display: 'inline-block',
    margin: '10px',
  }
  const html5DropStyle: CSSProperties = {
    backgroundColor: (html5Props.isOver && html5Props.canDrop) ? '#f3f3f3' : '#bbbbbb',
    display: 'inline-block',
    margin: '5px',
    width: '90px',
    height: '90px',
    textAlign: 'center',
    userSelect: 'none',
  }
  const touchDropStyle: CSSProperties = {
    backgroundColor: (touchProps.isOver && touchProps.canDrop) ? '#f3f3f3' : '#bbbbbb',
    display: 'inline-block',
    margin: '5px',
    width: '90px',
    height: '90px',
    textAlign: 'center',
    userSelect: 'none',
  }
  return (
    <div style={containerStyle}>
        {Object.keys(boxes).map((key) => (
        <DraggableName
          key={key}
          id={key}
          {...(boxes[key] as { top: number; left: number; title: string })}
        />
      ))}
      <div style={html5DropStyle} ref={html5Drop}>HTML5</div>
      <div style={touchDropStyle} ref={touchDrop}>Touch</div>
    </div>
  )
}