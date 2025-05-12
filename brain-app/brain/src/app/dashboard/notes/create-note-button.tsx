"use client"

import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@c/convex/_generated/api";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import UploadDocumentForm from "./create-note-form";
import { useState } from "react";
import { NotebookTabs, Plus } from "lucide-react";
import { btnIconStyles, btnStyles} from "../../../../styles/styles"


export function UploadNoteButton() {

const [isOpen , setIsOpen] = useState(false)

    return <>

        <Dialog onOpenChange={setIsOpen} open={isOpen}>
            <DialogTrigger asChild>
                <Button className={btnStyles}> <Plus  className={btnIconStyles}/>Upload Notes</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Note</DialogTitle>
                    <DialogDescription>
                        Upload a team notes for you to search over in the future.
                                          
                        </DialogDescription>
                        <UploadDocumentForm 
                        onNoteUpload={() => setIsOpen(false)}/>  
                </DialogHeader>


            </DialogContent>
        </Dialog>

    </>
}