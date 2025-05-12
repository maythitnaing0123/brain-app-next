"use client"

import { useAction } from "convex/react";
import { api } from "@c/convex/_generated/api";
import { Doc, Id } from "@c/convex/_generated/dataModel";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { LoadingButton } from "@/components/loadingButton";





export function SearchForm(
    {setRecords} 
    : {setRecords : 
        (records : typeof api.search.searchAction._returnType) => void;

}) {

    const searchAction = useAction(api.search.searchAction)

    const formSchema = z.object({
        search: z.string().min(1).max(250)

    })

    const askQuestion = useAction(api.document.askQuestion)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            search: "",

        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {

        // call convex
       await searchAction({search: values.search})
       .then((notes) => {
        
        setRecords(notes);

       })


      
        form.reset();
    }



    return (
        <Form {...form}  >
            <form 
             className="flex space-y-8  
             gap-1"
            onSubmit={form.handleSubmit(onSubmit)} 
           >

            <div className="flex-1">
                <FormField
               
                    control={form.control}
                    name="search"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel></FormLabel>
                            <FormControl className="flex-1">
                                <Input placeholder="Search over all your documents and notes" {...field} />
                            </FormControl>

                        </FormItem>
                    )}
                />

            </div>

            <div className="px-3 py-2">

                <LoadingButton

                    loadingText="searching..."
                    isLoading={form.formState.isSubmitting}>Search
                </LoadingButton>
            </div>



            </form>

            <FormMessage />

        </Form>
    )
}