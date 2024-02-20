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
  href: string,
  previewImg: string,
  left: number
  top: number,
  list: ContainerTypes
}
  
  export const DraggableName: React.FC<DraggableNameProps> = React.memo(function DraggableName(
    props,
    ) {
      const { id, title, href, left, top, list } = props
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
              px-1
              cursor-grab 
              active:cursor-grabbing 
              md:w-max
              sm:max-w-screen-sm
            `}
          >
            <HoverCard>
              <HoverCardTrigger className="text-5xl" asChild>
                <a
                  className="hover:underline"
                  href={href}
                  target='_blank'
                >
                  {title}
                </a>
              </HoverCardTrigger>
              <HoverCardContent>
                <Image
                  src={props.previewImg}
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
    