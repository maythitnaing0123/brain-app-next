import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  memberships: defineTable({

    orgsId : v.string(),
    users: v.string()

  }).index("by_orgsId_by_users" , ["orgsId" , "users"])
  ,
  documents: defineTable({
     title: v.string(),
     description: v.optional(v.string()),
     tokenIdentifier: v.string(),
     fileId : v.id("_storage"),
     orgsId: v.optional(v.string()),
     embedding: v.optional(v.array(v.float64())),
    }).index("by_tokenIdentifier" , ["tokenIdentifier"])
    .index("by_orgsId" , ["orgsId"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 3072,
      filterFields: ["tokenIdentifier"],
    }),
  chats: defineTable({
    documentId: v.id("documents"),
    tokenIdentifier: v.string(),
   text: v.string(),
   isHuman : v.boolean()
   }).index("by_documentId_tokenIdentifier" , ["documentId" ,"tokenIdentifier"]),
   notes: defineTable({
    text: v.string(),
    tokenIdentifier: v.string(),
    orgsId: v.optional(v.string()),
     embedding: v.optional(v.array(v.number())),
   }).index("by_orgsId" , ["orgsId"])
   .index("by_tokenIdentifier" , ["tokenIdentifier"])
   .vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 3072,
    filterFields: ["tokenIdentifier"],
  }),


});