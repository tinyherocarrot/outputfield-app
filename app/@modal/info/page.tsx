import * as React from "react"
import type { Metadata } from 'next'
import InfoDialog from "./info-dialog"

export const metadata: Metadata = {
  title: 'OPF | Info',
}

export default function Info() {
    return <InfoDialog />
}