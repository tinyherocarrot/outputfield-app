"use client"
import React from 'react'
import { ContainerTypes, ItemTypes } from '@/ts/types/dnd.types';
import { useDrop } from 'react-dnd';
import { cn } from '@/lib/utils';
import { DragItem } from '@/ts/interfaces/dragItem.interfaces';
  
export interface ContainerProps {
  children?: React.ReactNode,
  transferCard: (item: DragItem, nextList: ContainerTypes, top: number, left: number) => void,
  label: ContainerTypes,
  className?: string,
}

export const DropTarget: React.FC<ContainerProps> = (
  { label, children, transferCard, className }
) => {
  const [{ isOver } , drop] = useDrop(
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
              const left = Math.floor(Math.random() * (innerWidth * 0.6))
              const top = Math.floor(Math.random() * (innerHeight * 0.6))
              console.log('dropping at ', left, top)
              transferCard(item, label, top, left)
              return
            } 
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
      }),
    }),
    [],
  )

  return (
    <div ref={drop} className={cn(
      'relative float-left',
      isOver && 'bg-slate-300',
      className)
    }>
        <div
          className='w-full'
        >
          {children}
      </div>
    </div>  
  )
}
