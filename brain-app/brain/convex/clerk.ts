import { v } from "convex/values";
import { internalAction, internalMutation } from "./_generated/server";
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server'


const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || ``;
console.log("CLERK_WEBHOOK_SECRET" ,process.env.CLERK_WEBHOOK_SECRET )

export const fulfill = internalAction({
    args: {payloadStrings : v.string() , headers: v.any()},
    handler: async(ctx , args) => {
        const wh = new Webhook(webhookSecret);
        return wh.verify(args.payloadStrings, args.headers) as WebhookEvent

    }
})