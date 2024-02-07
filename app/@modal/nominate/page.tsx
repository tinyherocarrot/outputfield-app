"use server"
import * as React from "react"
import type { Metadata } from 'next'
import NominateDialog from "./nominate-dialog"
import { addNomineeRow } from "@/app/actions"

export async function generateMetadata(): Promise<Metadata> {
    return {
      title: 'OPF | Nominate'
    };
}

export default async function Page() {
    <NominateDialog handleAddNominee={addNomineeRow} />
}