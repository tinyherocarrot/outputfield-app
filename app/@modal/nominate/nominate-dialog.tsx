"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog" 
import NominateForm from "@/components/nominate-form"
import { useRouter } from 'next/navigation'
import { Nominee } from "@/ts/interfaces/nominee.interfaces"

type NominateFormProps = {
    handleAddNominee: (n: Nominee) => Promise<void>
}

const NominateDialog: React.FC<NominateFormProps> = (
    { handleAddNominee }
  ) => {
    const router = useRouter();
    return (
        <Dialog
            open
            onOpenChange={() => router.push('/')}
        >
            <DialogTrigger>Nominate</DialogTrigger>
            <DialogContent className="text-black max-h-[100vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>Nominate</DialogTitle>
                    <DialogDescription>
                        Know someone you&apos;d like to connect to OPF? Suggest them here.
                    </DialogDescription>
                </DialogHeader>
                <NominateForm handleAddNominee={handleAddNominee} />
            </DialogContent>
        </Dialog>
    )
}

export default NominateDialog
