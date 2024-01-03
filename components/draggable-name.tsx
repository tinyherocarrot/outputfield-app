import { ContainerTypes, ItemTypes } from '@/ts/types/dnd.types';
import React, {CSSProperties} from 'react'
import { DragSourceMonitor, useDrag } from 'react-dnd';
import { useMultiDrag } from 'react-dnd-multi-backend';
import { getEmptyImage } from 'react-dnd-html5-backend';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import Image from 'next/image';

function getStyles(
  left: number,
  top: number,
  isDragging: boolean,
): CSSProperties | undefined {
  if (!left || !top) {
    // initial positioning
    return undefined
  } else {
    const transform = `translate3d(${left}px, ${top}px, 0)`
    return {
      position: 'absolute',
      transform,
      WebkitTransform: transform,
      // IE fallback: hide the real node using CSS when dragging
      // because IE will ignore our custom "empty image" drag preview.
      opacity: isDragging ? 0 : 1,
      height: isDragging ? 0 : '',
    }
  }
}

export interface DraggableNameProps {
  id: string
  title: string,
  previewImg: string,
  left: number
  top: number,
  list: ContainerTypes
}
  
  export const DraggableName: React.FC<DraggableNameProps> = React.memo(function DraggableName(
    props,
    ) {
      const { id, title, left, top, list } = props
      const [{ isDragging }, drag, preview] = useDrag(
        () => ({
          type: ItemTypes.BOX,
          item: { id, left, top, title, list },
          collect: (monitor: DragSourceMonitor) => ({
            isDragging: monitor.isDragging(),
          }),
          end: (item, monitor) => {
            const { id: droppedId, } = item
            const didDrop = monitor.didDrop()
            if (!didDrop) {
              console.log("'valid' drop", droppedId)
            }
          },
        }),
        [id, left, top, title],
      )
    
      React.useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true })
      }, [preview])
    
      return (
        <li
          ref={drag}
          style={getStyles(left, top, isDragging)}
        >
          <div
            className={`
              py-0.5
              px-0.5
              cursor-grab 
              active:cursor-grabbing 
              w-max
            `}
          >
            <HoverCard>
              <HoverCardTrigger className="text-7xl">
                <span className="hover:underline">{title}</span>
              </HoverCardTrigger>
              <HoverCardContent>
                <Image
                  src={`/${props.previewImg}`}
                  alt={`preview image of ${title}'s website`}
                  width="200"
                  height="150"
                />
              </HoverCardContent>
            </HoverCard>
          </div>
        </li>
      )
    })
    


// const DraggableName = ({ top, left, title }) => {
//   const [[{ isDragging }], {html5: [html5Props, html5Drag], touch: [touchProps, touchDrag]}] = useMultiDrag<DragContent, void, {isDragging: boolean}>({
//     type: 'box',
//     item: {title: title},
//     collect: (monitor) => {
//       return {
//         isDragging: monitor.isDragging(),
//       }
//     },
//   })

//   const containerStyle: CSSProperties = {
//     display: 'inline-block',
//     margin: '10px',
//   }
//   const html5DragStyle: CSSProperties = {
//     // backgroundColor: props.color,
//     opacity: html5Props.isDragging ? 0.5 : 1,
//     display: 'inline-block',
//     margin: '5px',
//     width: '90px',
//     height: '90px',
//     textAlign: 'center',
//     userSelect: 'none',
//   }
//   const touchDragStyle: CSSProperties = {
//     // backgroundColor: props.color,
//     opacity: touchProps.isDragging ? 0.5 : 1,
//     display: 'inline-block',
//     margin: '5px',
//     width: '90px',
//     height: '90px',
//     textAlign: 'center',
//     userSelect: 'none',
//   }
//   return (

//     <div style={getStyles(top, left, html5Props.isDragging)} ref={html5Drag}>{title}</div>

//   )
// }
    {/* <div style={html5DragStyle} ref={html5Drag}>HTML5 {title}</div>
    <div style={touchDragStyle} ref={touchDrag}>Touch {title}</div> */}

