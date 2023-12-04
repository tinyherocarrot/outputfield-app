"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"  
import { useState } from "react"
import { NominateForm } from "./nominate-form"

export default function MainNav() {
    const [nominateOpen, setNominateOpen] = useState(false)

    return(
        <nav className='flex w-full justify-between mb-12'>
            <span>Output Field</span>
            <span className='flex space-x-4'>
            <Dialog>
                <DialogTrigger>INFO</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>ABOUT OPF</DialogTitle>
                        <DialogDescription>
                            [TODO: FILL FROM SANITY IO]
                        </DialogDescription>
                        Rerum perferendis at consequatur. Nam et sed velit iure rerum. Nisi ipsam aut dolores rerum impedit ut. Perspiciatis sapiente tempora qui id autem. Quia non error quo in vel. Aut iste consequuntur occaecati iusto perferendis quod provident.
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <Dialog open={nominateOpen} onOpenChange={setNominateOpen}>
                <DialogTrigger>SUGGEST</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>SUGGEST</DialogTitle>
                        <DialogDescription>
                            support your friends
                        </DialogDescription>
                    </DialogHeader>
                    <NominateForm onClose={() => setNominateOpen(false)} />
                </DialogContent>
            </Dialog>
            <a href="">DISCORD</a>
            <a href="">IG</a>
            </span>
        </nav>
    )
}