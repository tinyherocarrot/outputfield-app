"use client"

import * as React from 'react'
import { DndProvider } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'

export default function ContextProvider({ children }: { children: React.ReactNode[] }) {
    return (
        <DndProvider
            options={HTML5toTouch}
        >
            {children}
        </DndProvider>
    )
}