"use client"

import { DndProvider } from 'react-dnd'
import { MultiBackend } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch' // or any other pipeline

export default function ContextProvider({ children }: { children: React.ReactNode[] }) {
    return(
        <DndProvider backend={MultiBackend} options={HTML5toTouch}>
            {children}
        </DndProvider>
    )
}