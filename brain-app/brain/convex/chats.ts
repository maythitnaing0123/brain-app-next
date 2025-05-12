import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

export const getChatsForDocument = query({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const auth = (await ctx.auth.getUserIdentity())?.tokenIdentifier

    if (!auth) {
      return null;
    }

    return await ctx.db
      .query("chats")
      .withIndex("by_documentId_tokenIdentifier", (q) =>
        q
          .eq("documentId", args.documentId)
          .eq("tokenIdentifier", auth)
      )
      .collect();
  },
});

export const createChatRecord = internalMutation({
  args: {
    documentId: v.id("documents"),
    tokenIdentifier: v.string(),
    text: v.string(),
    isHuman: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("chats", {
      documentId: args.documentId,
      tokenIdentifier: args.tokenIdentifier,
      text: args.text,
      isHuman: args.isHuman,
    });
  },
});
