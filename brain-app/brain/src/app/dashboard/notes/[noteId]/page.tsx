"use client";

import { useQuery } from "convex/react";
import { api } from "@c/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@c/convex/_generated/dataModel";
import { DeleteButtonNote } from "./delete-note-button";
import { useEffect, useState } from "react";




export default function NotePages() {

    const { noteId } = useParams<{ noteId: Id<"notes"> }>();


  

        const note = useQuery(api.notes.getNote, {
            noteId: noteId as Id<"notes">
        })

        if (note === undefined) {
            return <div className="flex justify-center items-center ">Loading...</div>

        }


        if (!note) {
            return <div className="flex justify-center items-center">There is no note</div>

        }

        return (


            <div className="relative">
                <DeleteButtonNote noteId={note._id} />

                <div className="pr-6">{note.text}</div>
            </div>

        )




    





}