import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { WebhookEvent } from "@clerk/nextjs/server";


const http = httpRouter();

// Define additional routes
http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text()
    const headerPayload = request.headers;


    console.log("Working...")

    try{

        const result : WebhookEvent = await ctx.runAction(internal.clerk.fulfill , {
            payloadStrings: payloadString,
            headers: {
                "svix-id": headerPayload.get("svix-id")!,
                "svix-timestamp": headerPayload.get("svix-timestamp")!,
                "svix-signature": headerPayload.get("svix-signature")!,
            }
        });

        switch(result.type){
            case "organizationMembership.updated":
            case "organizationMembership.created":
                await ctx.runMutation(internal.memberships.addUserToOrgs , {
                    userId: `${process.env.NEXT_PUBLIC_CLERK_HOSTNAME}|${result.data.public_user_data.user_id}`,
                    orgsId : result.data.organization.id

                });
                break;
                case "organizationMembership.deleted":
                    await ctx.runMutation(internal.memberships.removeUserToOrgs , {
                        userId: `${process.env.NEXT_PUBLIC_CLERK_HOSTNAME}|${result.data.public_user_data.user_id}`,
                        orgsId : result.data.organization.id
                    })
                break;

        }

        return new Response(null , {
            status: 200
        })

    }catch(error){

        return new Response("Webhook Error" , {
            status: 500
        })

    }

   
  })
});

// Define a route using a path prefix

export default http;