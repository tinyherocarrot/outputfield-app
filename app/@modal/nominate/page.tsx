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
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'OPF | Nominate',
}

export default function Page() {
    const router = useRouter();
    return (
        <Dialog
            open
            onOpenChange={() => router.back()}
        >
            <DialogTrigger>Nominate</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-black">Nominate</DialogTitle>
                    <DialogDescription>
                        Know someone you&apos;d like to connect to OPF? Suggest them here.
                    </DialogDescription>
                </DialogHeader>
                <NominateForm />
            </DialogContent>
        </Dialog>
    )
}