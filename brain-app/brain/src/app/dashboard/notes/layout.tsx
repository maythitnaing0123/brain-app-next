"use client"


import { api } from "@c/convex/_generated/api";
import { UploadNoteButton } from "./create-note-button";
import { useQuery } from "convex/react";
import Link from "next/link";
import { ReactNode } from "react";
import { useParams } from "next/navigation";
import { Id } from "@c/convex/_generated/dataModel";
import { cn } from "@c/src/lib/utils";

export default function NodeLayouts({ children }: { children: ReactNode }) {

    const getNotes = useQuery(api.notes.getNotes);
    const {noteId} = useParams<{noteId : Id<"notes">}>();


    return <main className="space-y-8">

        <div className="flex justify-between 
          items-center">

            <h1 className="text-4xl font-bold">Notes</h1>
            <UploadNoteButton />
        </div>


       <div className="flex gap-10">

        <ul className="space-y-2">
            {getNotes === undefined && <div className="flex justify-center mt-5 items-center">Loading</div>}
            {getNotes?.map(note => (
            <li key={note._id} className={cn(`text-lg hover:text-cyan-200`, {
                'text-cyan-200': note._id === noteId
            })}>
                <Link href={`/dashboard/notes/${note._id}`}>
                    { note.text.substring(0, 20) + "..."}
                </Link>
            </li>

        )
        )}
        </ul>
        {getNotes != undefined && getNotes?.length > 0 && <div className="bg-slate-900 rounded p-4 w-full">{children}</div>}
        </div>

    </main>
}