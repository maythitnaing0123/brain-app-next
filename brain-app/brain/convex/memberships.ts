import { v } from "convex/values";
import {  internalMutation, mutation } from "./_generated/server";

export const addUserToOrgs = internalMutation({

    args: {
        userId: v.string() , 
        orgsId : v.string() 
    },
    async handler(ctx , args){
        await ctx.db.insert("memberships" , {
            orgsId: args.orgsId,
            users: args.userId

        })

    }




})

export const removeUserToOrgs = internalMutation({

    args: {
        userId: v.string() , 
        orgsId : v.string() 
    },
    async handler(ctx , args){

        const membership = await ctx.db.query("memberships")
        .withIndex("by_orgsId_by_users" , q => q.eq("orgsId" ,args.orgsId)
        .eq("users" , args.userId)).first();

        if(!membership){
            return null;
        }
        await ctx.db.delete(membership._id)

    }




})