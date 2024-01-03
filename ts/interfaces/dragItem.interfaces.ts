import { ContainerTypes } from "../types/dnd.types"

export interface DragItem {
    type: string
    id: string
    top: number
    left: number
    title: string,
    list: ContainerTypes
  }