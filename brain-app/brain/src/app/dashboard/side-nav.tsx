"use client"

import { cn } from "@c/src/lib/utils";
import { File, NotebookTabs, Search, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNav(){

const pathname = usePathname();

    return (
        <nav className=" py-14 h-[calc(100vh-72px)] shadow-right-sm dark:bg-slate-900">
        <ul className="space-y-5">

             {/* one links */}
             <li>
            <Link href="/dashboard/search" 
            className={cn("flex gap-2 hover:text-cyan-300 px-10 py-3" , {
              "text-cyan-300 bg-cyan-600 px-10 py-3" : pathname.endsWith("/search") || pathname.includes("/search") 
            })}>
              <Search />Search</Link>
          </li>




          {/* one links */}
          <li>
            <Link href="/dashboard/documents" 
            className={cn("flex gap-2 hover:text-cyan-300 px-10 py-3" , {
              "text-cyan-300 bg-cyan-600 " : pathname.endsWith("/documents") || pathname.includes("/documents") 
            })}>
              <File />Dashboard</Link>
          </li>


          {/* one links */}
          <li>
            <Link href="/dashboard/notes"
             className={cn("flex gap-2 hover:text-cyan-300 px-10 py-3" , {
              "text-cyan-300 bg-cyan-600 " : pathname.endsWith("/notes") || pathname.includes("/notes") 
            })}><NotebookTabs />Notes</Link>
          </li>

          {/* one links */}
          <li>
          <Link href="/dashboard/settings"
             className={cn("flex gap-2 hover:text-cyan-300 px-10 py-3" , {
              "text-cyan-300 bg-cyan-600 " : pathname.endsWith("/settings") || pathname.includes("/settings") 
            })}><Settings />Settings</Link>
          </li>

        </ul>
      </nav>
    )
}