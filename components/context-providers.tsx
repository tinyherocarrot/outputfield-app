"use client"

import * as React from 'react'
import { DndProvider } from 'react-dnd'
import { MultiBackend } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch' // or any other pipeline
import { HTML5Backend } from 'react-dnd-html5-backend'

export default function ContextProvider({ children }: { children: React.ReactNode[] }) {
    return(
        <DndProvider
            backend={HTML5Backend}
            // backend={MultiBackend}
            // options={HTML5toTouch}
        >
            {children}
        </DndProvider>
    )
}