"use client"
import React, {CSSProperties, RefObject} from 'react'
import { useMultiDrop } from 'react-dnd-multi-backend';
import { Artist } from './artist-list';
import { DragContent, ItemTypes } from '@/ts/types/dnd.types';
import { DropTargetMonitor, XYCoord, useDrop } from 'react-dnd';
import { DraggableName } from './draggable-name';
import { DragItem } from '@/app/page';

// export const DropContainer = ({ data }: {data: Artist[]}) => {
//     const [boxes, setBoxes] = React.useState<{
//     [key: string]: {
//       top: number
//       left: number
//       title: string
//     }
//   }>({
//     a: { top: 20, left: 80, title: 'Drag me around' },
//     b: { top: 180, left: 20, title: 'Drag me too' },
//   })

//   const [_, {html5: [html5Props, html5Drop], touch: [touchProps, touchDrop]}] = useMultiDrop<DragContent, void, {isOver: boolean, canDrop: boolean}>({
//     accept: 'box',
//     drop: (item: DragContent, monitor) => {
//         console.log(`Dropped: ${item.id}`)

//         const delta = monitor.getDifferenceFromInitialOffset() as XYCoord
//         const left = Math.round(item.left + delta.x)
//         const top = Math.round(item.top + delta.y)
//         moveBox(item.id, left, top)
//         return undefined
//     },
//     collect: (monitor) => {
//       return {
//         isOver: monitor.isOver(),
//         canDrop: monitor.canDrop(),
//       }
//     },
//   })

  
//   const moveBox = React.useCallback(
//     (id: string, left: number, top: number) => {
//         console.log('movebox')
//         const next = {...boxes}
//         next[id].left = left
//         next[id].top = top
//         setBoxes(next)
//     },
//     [boxes],
//   )

//   // TODO: replace with autoprefixer+astroturf
//   const containerStyle: CSSProperties = {
//     border: '1px dashed black',
//     display: 'inline-block',
//     margin: '10px',
//     height: 300,
//     width: 300,
//   }
//   const html5DropStyle: CSSProperties = {
//     backgroundColor: (html5Props.isOver && html5Props.canDrop) ? '#f3f3f3' : '#bbbbbb',
//     display: 'inline-block',
//     margin: '5px',
//     width: '90px',
//     height: '90px',
//     textAlign: 'center',
//     userSelect: 'none',
//   }
//   const touchDropStyle: CSSProperties = {
//     backgroundColor: (touchProps.isOver && touchProps.canDrop) ? '#f3f3f3' : '#bbbbbb',
//     display: 'inline-block',
//     margin: '5px',
//     width: '90px',
//     height: '90px',
//     textAlign: 'center',
//     userSelect: 'none',
//   }
//   return (
//     <div style={containerStyle}>
//         <div style={html5DropStyle} ref={html5Drop}>
//         {Object.keys(boxes).map((key) => (
//             <DraggableName
//             key={key}
//             id={key}
//             {...(boxes[key] as { top: number; left: number; title: string })}
//             />
//         ))}

//       </div>
//       {/* <div style={touchDropStyle} ref={touchDrop}>Touch</div> */}
//     </div>
//   )
// }


// - - - - - - - - 


const styles: CSSProperties = {
    width: '90vw',
    height: '70vh',
    border: '1px solid black',
    position: 'relative',
  }
  
  export interface ContainerProps {
    data?: any
  }
  
  interface BoxMap {
    [key: string]: { top: number; left: number; title: string }
  }
  
  export const DropContainer: React.FC<ContainerProps> = ({ data }) => {
    const [boxes, setBoxes] = React.useState<BoxMap>({
      a: { top: 20, left: 80, title: 'Drag me around' },
      b: { top: 180, left: 20, title: 'Drag me too' },
    })

    React.useEffect(() => {
        console.log(data)
        if (data) {
            const artistBoxes = data.reduce((acc, curr) => {
                return {
                    ...acc,
                    [curr.email]: {
                        top: 0,
                        left: 0,
                        title: curr.name
                    }
                }
            }, {})
            setBoxes(artistBoxes)
        }
    }, [data])
  
    const moveBox = React.useCallback(
        (id: string, left: number, top: number) => {
            console.log('movebox')
            const next = {...boxes}
            next[id].left = left
            next[id].top = top
            setBoxes(next)
        },
        [boxes],
    )
  
    const [, drop] = useDrop(
      () => ({
        accept: ItemTypes.BOX,
        drop(item: DragItem, monitor) {
          
          const delta = monitor.getDifferenceFromInitialOffset() as {
            x: number
            y: number
          }
  
          let left = Math.round(item.left + delta.x)
          let top = Math.round(item.top + delta.y)

          console.log('moving ' + JSON.stringify(item) + ' to ' + left + ' ' + top)
          moveBox(item.id, left, top)
          return undefined
        },
      }),
      [moveBox],
    )
  
    return (
      <div ref={drop} style={styles}>
        {Object.keys(boxes).map((key) => (
          <DraggableName
            key={key}
            id={key}
            {...(boxes[key] as { top: number; left: number; title: string })}
          />
        ))}
      </div>
    )
  }
  