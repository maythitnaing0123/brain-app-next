"use client"

import { useAction } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
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





export function QuestionForm({ documentId }: { documentId: Id<"documents"> }) {

    const formSchema = z.object({
        text: z.string().min(1).max(250)

    })

    const askQuestion = useAction(api.document.askQuestion)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            text: "",

        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {

        // call convex
        documentId && await askQuestion({
            question: values.text,
            documentId

        }).then(e => console.log("Answer", e)).catch(e => console.log(e)

        )

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
                    name="text"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel></FormLabel>
                            <FormControl className="flex-1">
                                <Input placeholder="Ask to ai" {...field} />
                            </FormControl>

                        </FormItem>
                    )}
                />

            </div>

            <div className="px-3 py-2">

                <LoadingButton

                    loadingText="Submiting..."
                    isLoading={form.formState.isSubmitting}>Submit
                </LoadingButton>
            </div>



            </form>

            <FormMessage />

        </Form>
    )
}