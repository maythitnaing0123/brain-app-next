"use client"

import React, { ReactNode } from "react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ThemeProvider } from "@/components/theme-provider"
import { dark } from '@clerk/themes'
import { useTheme } from "next-themes";


const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);


export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <OtherProvider>{children}</OtherProvider>
     
    </ThemeProvider>

  )
}

function OtherProvider({children} : {children: ReactNode}){
  
  const {theme} = useTheme();


  return (
    <ClerkProvider
      appearance={{
      baseTheme: theme === "dark" ? dark : undefined
     
    }}
    publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  </ClerkProvider>
  )
}