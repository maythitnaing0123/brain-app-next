"use client"

import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, AuthLoading, useQuery, useMutation } from "convex/react";

export function HeaderActions() {
    return <> <Unauthenticated>
        <SignInButton />
    </Unauthenticated>
        <Authenticated>
            <div className="flex gap-4">

                <UserButton />

            </div>
        </Authenticated>

        <AuthLoading>
            Loading...
        </AuthLoading>

    </>
}