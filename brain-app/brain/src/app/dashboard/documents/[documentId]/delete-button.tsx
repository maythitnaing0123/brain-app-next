"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2Icon } from "lucide-react"
import { btnIconStyles, btnStyles } from "../../../../../styles/styles"
import { useMutation } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import { Id } from "../../../../../convex/_generated/dataModel"
import { useState } from "react"
import { LoadingButton } from "@/components/loadingButton"
import { useRouter } from "next/navigation"

export function DeleteButtonComponent({documentId} : {documentId : Id<"documents">}) {

    const deleteDocument = useMutation(api.document.deleteDocument)
    const [isOpen , setIsOpen] = useState(false)
    const [isLoading , setIsLoading] = useState(false);
    const router = useRouter();
   
     return (
        <AlertDialog onOpenChange={() => setIsOpen(!isOpen)}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive"
                    className={`${btnStyles} cursor-pointer`}>
                    <Trash2Icon className={btnIconStyles} />
                    Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure you want to delete this documents?</AlertDialogTitle>
                    <AlertDialogDescription>
                    This document can't be recovered after it's been deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <LoadingButton 
                        onClick={() => {
                        
                        setIsLoading(true)
                        deleteDocument({documentId})
                        .then(() => {
                            router.push("/dashboard/documents")

                        }).finally(( ) => {
                            setIsLoading(false);
                            setIsOpen(false)
                        });
                       
                    }} 
                        isLoading={isLoading} loadingText="Deleting...">
                            Delete
                        </LoadingButton>
                 
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}