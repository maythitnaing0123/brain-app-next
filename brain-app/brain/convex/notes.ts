import { ConvexError, v } from "convex/values";
import { internalAction, internalMutation, mutation, query } from "./_generated/server";
import { GoogleGenAI } from "@google/genai";
import { internal } from "./_generated/api";
import { hasOrgAccess } from "./document";
import { Id } from "./_generated/dataModel";

export const getNote = query({

    args: {
        noteId : v.id("notes")

    },
   
    async handler(ctx , args){

    const auth = (await ctx.auth.getUserIdentity())?.tokenIdentifier

    if(!auth){
        return null
    }

    try {
        const note = await ctx.db.get(args.noteId);
        if (!note) {
          throw new ConvexError("Note not found");
        }
        return note;
      } catch (err) {
        if (err instanceof Error && err.message.includes("ArgumentValidationError")) {
            console.error("Invalid argument passed to Convex function:", err);
            // You can show a specific user-friendly message
          } else {
            console.error("Unknown error:", err);
          }
        
  }}})



export const deleteNote = mutation({
    args: {
        noteId: v.id("notes")
    },
    handler : async(ctx , args) => {


        const auth = (await ctx.auth.getUserIdentity())?.tokenIdentifier

        if(!auth){
            throw new ConvexError("Unauthorized! , You must login")
        }


       const note = await ctx.db.get(args.noteId)
    
       if(!note){
        throw new ConvexError("Note not found!");
    }

    if(note.tokenIdentifier !== auth){
        throw new ConvexError("You don't have permission to delete!")
    }

    await ctx.db.delete(args.noteId)
    
    
    }
})


export const getNotes = query({
    args:{
        orgId : v.optional(v.string())
    },

    async handler(ctx , args){
    const auth = (await ctx.auth.getUserIdentity())?.tokenIdentifier

    
    if(!auth){
        return null
    }

   
    if (args.orgId) {
        const hasAccess = await hasOrgAccess(ctx, args.orgId);
  
        if (!hasAccess) {
          return null;
        }
  
        const notes = await ctx.db
          .query("notes")
          .withIndex("by_orgsId", (q) => q.eq("orgsId", args.orgId))
          .collect();
  
        return notes;
      } else {
        const notes = await ctx.db
          .query("notes")
          .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", auth))
          .order("desc")
          .collect();
  
        return notes;
      }
    },
  });




export async function embed(text: string){

    const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API });
    
    console.log("ai" , ai)
    
    const response =  await ai.models.embedContent({
        model: 'gemini-embedding-exp-03-07',
        contents: text
    });

    const embedding : number[] = response.embeddings?.[0]?.values ?? [];

    return embedding


}



export const setNoteEmdding = internalMutation({
    args: {
        noteId : v.id("notes"),
        embedding: v.array(v.number())
    },
    handler : async(ctx , args) => {

        console.log("embedding" , args.embedding)


        await ctx.db.patch(args.noteId , {
            embedding : args.embedding
        })
    }
})



export const createNoteEmdding = internalAction({
    args: {
        noteId : v.id("notes"),
        text: v.string()
    },
    handler : async(ctx , args) => {

        console.error("embedding" , embed(args.text))

        const embedding = await embed(args.text);


       

        await ctx.runMutation(internal.notes.setNoteEmdding , {
            noteId: args.noteId,
            embedding : embedding
        })

        
    }
})




//create notes
export const createNote = mutation({
    args: {
        text: v.string(),
        orgId: v.optional(v.string()),

    },
    handler : async(ctx , args) => {


        const auth = (await ctx.auth.getUserIdentity())?.tokenIdentifier

        if(!auth){
            throw new ConvexError("Unauthorized! , You must login")
        }

        console.log(auth)


        let noteId: Id<"notes">;


        if(args.orgId){

            const hasAccess = await hasOrgAccess(ctx , args.orgId)

    
            if(!hasAccess){
                return null;
            }
    
             noteId = await ctx.db.insert("notes" , {
                text: args.text,
                orgsId: args.orgId!,
                tokenIdentifier : auth
            })
        }else{

             noteId = await ctx.db.insert("notes" , {
                text: args.text,
                tokenIdentifier: auth, });
            
        }  


        if(!noteId){
            return null;
        }

        console.log("notes" , !noteId)

        await ctx.scheduler.runAfter(0, internal.notes.createNoteEmdding , {
            noteId,
            text: args.text,
          

        })

       
    }
})

