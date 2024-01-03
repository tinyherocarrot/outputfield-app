"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog" 
import { NominateForm } from "@/components/nominate-form"
import { useRouter } from 'next/navigation'

export default function Page() {
    const router = useRouter();
    return (
        <Dialog
            open
            onOpenChange={() => router.back()}
        >
                <DialogTrigger>SUGGEST</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>SUGGEST</DialogTitle>
                        <DialogDescription>
                            support your friends
                        </DialogDescription>
                    </DialogHeader>
                    <NominateForm
                    // onClose={() => setNominateOpen(false)}
                    // onClose={() => router.back()}
                    />
                </DialogContent>
            </Dialog>
    )
}