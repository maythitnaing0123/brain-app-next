"use client"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useMutation , useConvexAuth } from "convex/react"
import { api } from "@c/convex/_generated/api"

import { LoadingButton } from "@/components/loadingButton"
import toast from 'react-hot-toast';

import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { useAuth, useOrganization } from "@clerk/nextjs"

const formSchema = z.object({
  text: z.string().min(1).max(5000),
})


export default function UploadNotesForm({ onNoteUpload }: { onNoteUpload: () => void }) {
  
  const { isAuthenticated } = useConvexAuth();
  const { orgId } = useAuth()
  const createNodes = useMutation(api.notes.createNote)


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",

    },
  })


  async function onSubmit(values: z.infer<typeof formSchema>) {




    if(!isAuthenticated){

      toast.error("Please Login!");
     


      return 

    }
    try {


      await createNodes({ text: values.text , orgId : orgId!});
      
      toast.success("Successfully created!");
      
  } catch (e) {
     
          console.log("Caught a different type of error:", e);
          toast.error(e! as any);

      }

      onNoteUpload();

  }
  
  

  return (
    <>
   
    <Form {...form}  >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="my-2">Text</FormLabel>
              <FormControl>
                <Textarea 
                className="h-[200px]"
                placeholder="Your Notes" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />


       
        <LoadingButton

          loadingText="creating..."
          isLoading={form.formState.isSubmitting}>Create
        </LoadingButton>
      </form>
    </Form>
    </>
  )
}