import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getNote = query({

    args: {
        noteId : v.id("notes")

    },
   
    async handler(ctx , args){
    const auth = (await ctx.auth.getUserIdentity())?.tokenIdentifier

    if(!auth){
        return null
    }

    const note = await ctx.db.get(args.noteId);

    if(note?.tokenIdentifier !== auth){
        throw new ConvexError("You don't have permission to view this note!")
    }

    console.log

    return note;


   } 
})




export const getNotes = query({

    async handler(ctx){
    const auth = (await ctx.auth.getUserIdentity())?.tokenIdentifier

    if(!auth){
        return null
    }

    return await ctx.db.query("notes")
    .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", auth))
    .order("desc").collect();


   } 
})

export const createNote = mutation({
    args: {
        text: v.string()
    },
    handler : async(ctx , args) => {


        const auth = (await ctx.auth.getUserIdentity())?.tokenIdentifier

        if(!auth){
            throw new ConvexError("Unauthorized! , You must login")
        }


        return await ctx.db.insert("notes" , {
            text: args.text,
            tokenIdentifier: auth

        })
    }
})