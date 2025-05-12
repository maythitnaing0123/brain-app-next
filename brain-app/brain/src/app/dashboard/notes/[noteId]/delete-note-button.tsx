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
import { Trash, Trash2Icon } from "lucide-react"
import { btnIconStyles, btnStyles } from "../../../../../styles/styles"
import { useMutation } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import { Id } from "../../../../../convex/_generated/dataModel"
import { useState } from "react"
import { LoadingButton } from "@/components/loadingButton"
import { useRouter } from "next/navigation"

export function DeleteButtonNote({noteId} : {noteId : Id<"notes">}) {
    const deleteNode = useMutation(api.notes.deleteNote)
    const [isOpen , setIsOpen] = useState(false)
    const [isLoading , setIsLoading] = useState(false);
    const router = useRouter();
   
     return (
        <AlertDialog onOpenChange={() => setIsOpen(!isOpen)}>
            <AlertDialogTrigger asChild>
            <Button 
            className="absolute bg-red-500 fill-white -top-4 -right-4"
        
            size="icon"><Trash/></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure you want to delete this notes?</AlertDialogTitle>
                    <AlertDialogDescription>
                    This note can't be recovered after it's been deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <LoadingButton 
                        onClick={async() => {

                            try{  
                              

                                setIsLoading(true)

                                await deleteNode({noteId})
                               
                                router.push("/dashboard/notes")
        
                                

                            }catch(error){
                                console.log(error)
                            }finally{
                                setIsLoading(false);
                                setIsOpen(false)
                            };
                        
                     
                       
                    }} 
                        isLoading={isLoading} loadingText="Deleting...">
                            Delete
                        </LoadingButton>
                 
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}