"use client"
import React, { CSSProperties, RefObject } from 'react'
// TODO: import { useMultiDrop } from 'react-dnd-multi-backend';
import { ItemTypes } from '@/ts/types/dnd.types';
import { useDrop } from 'react-dnd';
import { DraggableName } from './draggable-name';
import { DragItem } from '@/app/page';
import { ListTypes } from './artist-list-container';
import { cn } from '@/lib/utils';

const styles: CSSProperties = {
  minWidth: '90vw',
  // border: '1px solid black',
  // padding: '3rem 0rem',
  // margin: '1rem',
  position: 'relative',
  float: 'left',
}
  
export interface ContainerProps {
  data?: any, //FIXME:
  children?: React.ReactNode,
  transferCard: (item: DragItem, nextList: ListTypes, top: number, left: number) => void,
  repositionCard: (item: DragItem, top: number, left: number) => void,
  label: ListTypes,
  className?: string,
}

export const DropContainer: React.FC<ContainerProps> = (
  { data, label, children, transferCard, repositionCard, className }
) => {
  const positionRef = React.useRef<HTMLDivElement>(null);

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.BOX,
      drop(item: DragItem, monitor) {
          const didDrop = monitor.didDrop()

          // if drop already handled by child,
          if (didDrop) {
            return
          } else {
            //  if label doesnt match item label
            if (label !== item.list) {
              //    do transfer
              const { x: containerX, y: containerY } = positionRef?.current?.getBoundingClientRect() as DOMRect
              const sourceClientOffset = monitor.getSourceClientOffset() as {
                x: number
                y: number
              }
              let left = Math.round(sourceClientOffset.x - containerX)
              let top = Math.round(sourceClientOffset.y - containerY)
              transferCard(item, label, top, left)
              return
            } else {
              //    do reposition
              const delta = monitor.getDifferenceFromInitialOffset() as {
                  x: number
                  y: number
              }

              let left = Math.round(item.left + delta.x)
              let top = Math.round(item.top + delta.y)

              repositionCard(item, top, left)
              return undefined
            }
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
      }),
    }),
    [],
  )

  return (
    <div ref={drop} className={cn('relative float-left', className)}>
        <div
          ref={positionRef as RefObject<HTMLDivElement>}
          className='w-full flex flex-wrap'
        >
        {data && Object.keys(data).map((key, i) => {
          const { title, top, left, list, previewImg } = data[key]
          const _title = `${title}${(i + 1) !== Object.keys(data).length ? ', ': '.'}`
          return (
            <DraggableName
              key={key}
              id={key}
              title={_title}
              previewImg={previewImg}
              top={top}
              left={left}
              list={list}
            />
          )
        })}
        {children}
      </div>
    </div>  
  )
}
