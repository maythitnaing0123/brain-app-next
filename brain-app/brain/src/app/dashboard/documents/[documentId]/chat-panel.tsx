import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAction, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { QuestionForm } from "./question-form";

export default function ChatPanel({ documentId }
    : { documentId: Id<"documents"> }) {

    const chats = useQuery(api.chats.getChatsForDocument, {
        documentId
    });


    return (
        <div className=" bg-gray-900 flex 
        p-5 pb-0
        flex-col gap-3">

            <div className="h-[270px]
            overflow-y-auto space-y-2">

                <div className="bg-slate-950 rounded p-3">
                    Ask any question using AI about this document
                    below:
                </div>

                {
                    chats?.map(chat => (
                        <div key={chat._id} className={cn(
                            {
                                "bg-slate-700": chat.isHuman,
                                "text-right" : chat.isHuman
                            }, `rounded p-2 whitespace-pre-line mb-3`
                        )}>
                           {chat.isHuman ? "You : " : "AI : "} {chat.text}
                        </div>
                    ))
                }



            </div>

            <div>
            <QuestionForm documentId={documentId}/>
            </div>


        </div>
    )
}