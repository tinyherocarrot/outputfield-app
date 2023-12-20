"use client"
import React, {CSSProperties, RefObject} from 'react'
import { useMultiDrop } from 'react-dnd-multi-backend';
import { Artist } from './artist-list';
import { DragContent, ItemTypes } from '@/ts/types/dnd.types';
import { DropTargetMonitor, XYCoord, useDrop } from 'react-dnd';
import { DraggableName } from './draggable-name';
import { DragItem } from '@/app/page';
import { removeProperty } from '@/lib/utils';
import { ListTypes } from './artist-list-container';

const styles: CSSProperties = {
    minWidth: '100vw',
    minHeight: '300px',
    height: '50%',
    border: '1px solid black',
    margin: '1rem',
    position: 'relative',
    float: 'left'
  }
  
  export interface ContainerProps {
    data?: any,
    transferCard: (item: DragItem, nextList: ListTypes, top: number, left: number) => void,
    repositionCard: (item: DragItem, top: number, left: number) => void,
    label: ListTypes,
  }
  
  interface BoxMap {
    [key: string]: { top: number; left: number; title: string }
  }
  
  export const DropContainer: React.FC<ContainerProps> = ({ data, label, transferCard, repositionCard }) => {
    const [hasDropped, setHasDropped] = React.useState(false)
    const [hasDroppedOnChild, setHasDroppedOnChild] = React.useState(false)

  
    const [, drop] = useDrop(
      () => ({
        accept: ItemTypes.BOX,
        drop(item: DragItem, monitor) {
            console.log('- - - - -')
            const didDrop = monitor.didDrop()
            console.log('didDrop', label, monitor.didDrop(), monitor.getDropResult())

            setHasDropped(true)
            setHasDroppedOnChild(didDrop)

            // if didDrop (on Child), then remove from state
            // if (didDrop) {
            //     const next = removeProperty(boxes, item.id)
            //     setBoxes(next)
            //     return
            // }
            
            if (label !== item.list) {
                console.log(`${label} got a FOREIGN OBJECT, ${JSON.stringify(item)}`)
                console.log(
                  monitor.getClientOffset(),
                  monitor.getInitialSourceClientOffset(),
                  monitor.getSourceClientOffset(),
                  monitor.getInitialClientOffset()
                )
                
                const clientOffset = monitor.getClientOffset()
                const initialSourceClientOffset = monitor.getInitialSourceClientOffset()
                
                const sourceClientOffset = monitor.getSourceClientOffset()
                let left = Math.round(clientOffset.x - sourceClientOffset.x)
                let top = Math.round(clientOffset.y - sourceClientOffset.y)
                // let left = 0
                // let top = 0
                debugger
                transferCard(item, label, top, left)
                return
            } else {
                console.log('initiating move ', label)
                const delta = monitor.getDifferenceFromInitialOffset() as {
                    x: number
                    y: number
                }
        
                let left = Math.round(item.left + delta.x)
                let top = Math.round(item.top + delta.y)

                console.log('moving ' + JSON.stringify(item) + ' to ' + left + ' ' + top)
                repositionCard(item, top, left)

                return undefined
            }
        },
        collect: (monitor) => ({
          isOver: monitor.isOver(),
          isOverCurrent: monitor.isOver({ shallow: true }),
        }),
      }),
      [setHasDropped, setHasDroppedOnChild],
    )
  
    return (
      <div ref={drop} style={styles}>
        <h3>{label}</h3>
        {hasDropped && <span>dropped {hasDroppedOnChild && ' on child'}</span>}

        {data && Object.keys(data).map((key) => (
          <DraggableName
            key={key}
            id={key}
            {...(data[key] as { top: number; left: number; title: string })}
          />
        ))}
      </div>
    )
  }
  

// - - - - - - - - 

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
