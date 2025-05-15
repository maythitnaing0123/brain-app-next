import { ConvexError, v } from "convex/values";
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";
import { api, internal } from "./_generated/api";
import { GoogleGenAI } from "@google/genai";
import { Id } from "./_generated/dataModel";
import { embed } from "./notes";

//to upload url.
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});


export async function hasOrgAccess(ctx : MutationCtx | QueryCtx , orgId: string) {
  
  const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

  if(!userId){
    return false;
  }

  const members = await ctx.db.query("memberships"). 
  withIndex("by_orgsId_by_users" , q => q.eq("orgsId" , orgId).eq("users" , userId)).first()


  console.log("members" , members)

  return !!members;



} 

// one table - accept all fun.
//get,update,delete.

export const getDocument = query({

  args: {orgId : v.optional(v.string())},

  async handler(ctx , args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      return null;
    }
    

    if(args.orgId){

      //has members.
      const isMember = await hasOrgAccess(ctx,args.orgId)

      if(!isMember){
        return null;
      }
      
      return await ctx.db
      .query("documents")
      .withIndex("by_orgsId", (q) => q.eq("orgsId", args.orgId))
      .collect();
   

    }else{

      return await ctx.db
      .query("documents")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", userId))
      .collect();

    }



    
  },
});

export async function hasAccessToDocument(
  ctx: MutationCtx | QueryCtx,
  documentId: Id<"documents">
) {
  const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

  if (!userId) {
    return null;
  }

  const document = await ctx.db.get(documentId);

  if (!document || document.tokenIdentifier !== userId) {
    return null;
  }

  return { document, userId };
}

export const hasAccessToDocumentQuery = internalQuery({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    return await hasAccessToDocument(ctx, args.documentId);
  },
});

export const getDocumentByID = query({
  args: {
    documentId: v.id("documents"),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    const accessObject = await hasAccessToDocument(ctx, args.documentId);

    if (!accessObject) {
      return null;
    }

    const { document } = accessObject!;
    return { ...document, fileUrl: await ctx.storage.getUrl(document.fileId) };
  },
});

//fill/update Description
export const fillInDescription = internalAction({
  args: {
    documentId: v.id("documents"),
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const file = await ctx.storage.get(args.fileId);

    if (!file) {
      throw new ConvexError("File not found!");
    }

    const fileText = await file?.text().then((data) => data);

    if (!file) {
      throw new ConvexError("File not found!");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: ` please respond 1 sentence description based on the provided text.Donot quote directly. Instead provide answer in a conversation tone`,
        config: {
          systemInstruction: `Here is a text file ${fileText} ,
`,
        },
      });

      let responseBySystem = response.text ?? "Can't generate a response...";

   

      let embedding = await embed(responseBySystem);

      await ctx.runMutation(internal.document.updateDocumentDescription, {
        documentId: args.documentId,
        description: responseBySystem,
        embedding 
      });


    } catch (error) {
      console.log(error);
    }
  },
});

export const updateDocumentDescription = internalMutation({
  args: {
    documentId: v.id("documents"),
    description: v.string(),
    embedding : v.array(v.number())
  },
  handler: async (ctx, args) => {
    return ctx.db.patch(args.documentId , {
      description: args.description,
      embedding : args.embedding 
    });
  },
});

//create function to import db. (server side fun)
export const createDocument = mutation({
  args: {
    title: v.string(),
    fileId: v.id("_storage"),
    orgId: v.optional(v.string()),

  },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      throw new ConvexError("Not Authenticated");

      
    }

    let documentId : Id<"documents">;

      if(args.orgId){
    
                const hasAccess = await hasOrgAccess(ctx , args.orgId)
    
        
                if(!hasAccess){
                    return null;
                }
                 documentId =  await ctx.db.insert("documents", {
                  title: args.title,
                  orgsId: args.orgId,
                  tokenIdentifier: userId,
                  fileId: args.fileId,
                  description: "",
                });
            }else{
    
               documentId =  await ctx.db.insert("documents", {
                title: args.title,
                tokenIdentifier: userId,
                fileId: args.fileId,
                description: "",
              });
                
            }  
    

 

    if(!documentId){
      return null
    }

    await ctx.scheduler.runAfter(0 , internal.document.fillInDescription , {
      documentId,
      fileId: args.fileId
    })
  },
});





export const askQuestion = action({
  args: {
    question: v.string(),
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const accessObject = await ctx.runQuery(
      internal.document.hasAccessToDocumentQuery,
      {
        documentId: args.documentId,
      }
    );

    if (!accessObject) {
      throw new ConvexError("You don't have access to this document!");
    }

    const { document, userId } = accessObject!;

    const file = await ctx.storage.get(document?.fileId);

    const fileText = await file?.text().then((data) => data);

    if (!file) {
      throw new ConvexError("File not found!");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: args.question,
        config: {
          systemInstruction: `Here is a text file ${fileText} ,
       please respond based on the provided text.Donot quote directly. Instead provide answer in a conversation tone`,
        },
      });

      let responseBySystem = response.text ?? "Can't generate a response...";

      await ctx.runMutation(internal.chats.createChatRecord, {
        documentId: document._id,
        tokenIdentifier: document?.tokenIdentifier,
        text: args.question,
        isHuman: true,
      });

      await ctx.runMutation(internal.chats.createChatRecord, {
        documentId: document._id,
        tokenIdentifier: document?.tokenIdentifier,
        text: responseBySystem,
        isHuman: false,
      });

      return responseBySystem;
    } catch (error) {
      console.log("error", error);
    }
  },
});

export const deleteDocument = mutation({
  args: {
    documentId : v.id("documents")
  },
  handler: async(ctx , args) => {
    const accessObject = await hasAccessToDocument(ctx , args.documentId)
  
  
    if(!accessObject){
      throw new ConvexError("You do have access to this documents")
    }

    await ctx.storage.delete(accessObject.document.fileId)

    return await ctx.db.delete(args.documentId)
  
  }
})
