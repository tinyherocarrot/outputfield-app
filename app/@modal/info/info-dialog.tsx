"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog" 
import { useRouter } from 'next/navigation'

const InfoDialog: React.FC = () => {
    const router = useRouter();
    return (
        <Dialog open onOpenChange={() => router.push('/')}>
            <DialogTrigger>INFO</DialogTrigger>
            <DialogContent className="text-black max-h-[100vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>ABOUT OPF</DialogTitle>
                    <DialogDescription>
                        [TODO: FILL FROM SANITY IO]
                    </DialogDescription>
                    Rerum perferendis at consequatur. Nam et sed velit iure rerum. Nisi ipsam aut dolores rerum impedit ut. Perspiciatis sapiente tempora qui id autem. Quia non error quo in vel. Aut iste consequuntur occaecati iusto perferendis quod provident.
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default InfoDialog
