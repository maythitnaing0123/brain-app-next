"use client";

import {useQuery } from "convex/react";
import { api } from "@c/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@c/convex/_generated/dataModel";

export default function NotePages(){

    const {noteId} = useParams<{noteId : Id<"notes">}>();
    
    const note = useQuery(api.notes.getNote , {
        noteId: noteId
    });

    if(note === undefined){
        return <div className="flex justify-center items-center mt-20">Loading...</div>

    }


    if(!note){
        return <div className="flex justify-center items-center mt-10">There is no note</div>

    }

    return(
        <div>{note.text}</div>

    )
}