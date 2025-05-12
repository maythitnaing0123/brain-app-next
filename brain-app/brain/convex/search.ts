import { v } from "convex/values";
import { action } from "./_generated/server";
import { embed } from "./notes";
import { api } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";

export const searchAction = action({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      return null;
    }

    const embedding = await embed(args.search);

    const results = await ctx.vectorSearch("notes", "by_embedding", {
      vector: embedding,
      limit: 5,
      filter: (q) => q.eq("tokenIdentifier", userId),
    });

    const documents = await ctx.vectorSearch("documents", "by_embedding", {
      vector: embedding,
      limit: 5,
      filter: (q) => q.eq("tokenIdentifier", userId),
    });



    const records : ({score: number , type : 'note' ; record : Doc<"notes">} | 
    {score: number , type :  'document' ; record : Doc<"documents">})[] = []

      await Promise.all(
        results?.map(async (result) => {
          const note = await ctx.runQuery(api.notes.getNote , {
            noteId: result._id
          })

          if(!note){
            return null;
          }
          // create object []
          records.push({ score: result._score , type : "note" , record : note});

        })
      ) ;


      await Promise.all(
        documents?.map(async (result) => {
          const document = await ctx.runQuery(api.document.getDocumentByID , {
            documentId: result._id
          })

          if(!document){
            return null;
          }
          // create object []
          records.push({score: result._score, type : "document" , record : document});

        })
      ) 


      return records.sort((a,b) => b.score - a.score);



   
  },
});
