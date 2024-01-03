"use client"
import type { CSSProperties, FC } from 'react'
import type { XYCoord } from 'react-dnd'
import { useDragLayer } from 'react-dnd'

import { ItemTypes } from '@/ts/types/dnd.types'

const layerStyles: CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
}

function getItemStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    }
  }

  let { x, y } = currentOffset

  const transform = `translate(${x}px, ${y}px)`
  return {
    transform,
    WebkitTransform: transform,
  }
}

export interface CustomDragLayerProps {
  snapToGrid?: boolean
}

export const CustomDragLayer: FC<CustomDragLayerProps> = (props) => {
  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer((monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }))

  function renderItem() {
    switch (itemType) {
      case ItemTypes.BOX:
        return (
          <div
            style={{
              display: 'inline-block',
              transform: 'rotate(-7deg)',
              WebkitTransform: 'rotate(-7deg)',
            }}
            className='text-7xl'
          >
            {item.title}
          </div>
        )
      default:
        return null
    }
  }

  if (!isDragging) {
    return null
  }
  return (
    <div style={layerStyles}>
      <div
        style={getItemStyles(initialOffset, currentOffset)}
      >
        {renderItem()}
      </div>
    </div>
  )
}
