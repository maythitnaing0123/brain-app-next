"use client"

import { cn } from "@c/src/lib/utils";
import { File, NotebookTabs, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNav(){

const pathname = usePathname();

    return (
        <nav>
        <ul className="space-y-4">
          {/* one links */}
          <li>
            <Link href="/dashboard/documents" 
            className={cn("flex gap-2 hover:text-cyan-300" , {
              "text-cyan-300" : pathname.endsWith("/documents") || pathname.includes("/documents") 
            })}>
              <File />Dashboard</Link>
          </li>


          {/* one links */}
          <li>
            <Link href="/dashboard/notes"
             className={cn("flex gap-2 hover:text-cyan-300" , {
              "text-cyan-300" : pathname.endsWith("/notes") || pathname.includes("/notes") 
            })}><NotebookTabs />Notes</Link>
          </li>

          {/* one links */}
          <li>
          <Link href="/dashboard/settings"
             className={cn("flex gap-2 hover:text-cyan-300" , {
              "text-cyan-300" : pathname.endsWith("/settings") || pathname.includes("/settings") 
            })}><Settings />Settings</Link>
          </li>

        </ul>
      </nav>
    )
}