"use client"

import { api } from "@c/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@c/convex/_generated/dataModel";
import { use } from "react";
import ChatPanel from "./chat-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteButtonComponent } from "./delete-button";


export default function DocumentPage({ params }:
    { params: Promise<{ documentId: Id<"documents"> }> }) {
    const { documentId } = use(params);


    const document = useQuery(api.document.getDocumentByID, {
        documentId
    })



    return (
        <main className=" pb-0 space-y-8 ">

            {
                document === undefined && !Array.isArray(document) &&
                <div className="p-6 flex flex-col space-y-3">

                    <Skeleton className="h-[40px] w-[500px]" />

                    <div className="flex gap-3">
                        <Skeleton className="h-[20px] w-[150px] " />

                        <Skeleton className="h-[20px] w-[100px] " />
                    </div>

                    <Skeleton className="h-[500px] w-full " />

                </div>
            }
            {
                document && (

                    <>

                        <div className="flex justify-between items-center">
                            <h1 className="text-4xl font-bold">{document?.title}</h1>

                            <DeleteButtonComponent documentId={document._id} />

                        </div>

                        <div className="flex gap-12">


                            <Tabs defaultValue="document" className="w-full" >
                                <TabsList className="mb-2">
                                    <TabsTrigger value="document" className="w-fit">Document</TabsTrigger>
                                    <TabsTrigger value="chat">Chat</TabsTrigger>
                                </TabsList>
                                <TabsContent value="document" className="w-full">
                                    <div className="flex flex-1 bg-slate-900 h-[600px]
                             p-4 rounded-md">

                                        {document?.fileUrl && (
                                            <iframe className="w-full whitespace-pre-line"
                                                src={document.fileUrl} />

                                        )}
                                    </div>
                                </TabsContent>
                                <TabsContent value="chat">
                                    {document && <ChatPanel documentId={document?._id} />}
                                </TabsContent>
                            </Tabs>





                            {/* end */}



                        </div>

                    </>

                )
            }


        </main>
    )



}