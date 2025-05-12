"use client"


import { useQuery } from "convex/react";
import { api } from "@c/convex/_generated/api";
import { DocumentCard } from "./[documentId]/document-card";
import { UploadDocumentButton } from "./[documentId]/upload-document-button";
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card";



export default function Home() {

  const getDocument = useQuery(api.document.getDocument)


  return (

    <main className="space-y-8">

      <div className="flex justify-between 
      items-center">

        <h1 className="text-4xl font-bold">My Documents</h1>

        <UploadDocumentButton />
      </div>
      {
        getDocument === undefined && (
          <div className="grid grid-cols-4 gap-8">
            {
              new Array(4).fill("").map((_, i) => (
                <Card key={i} className="p-6 flex flex-col">

                  <Skeleton className="h-[40px] rounded" />
                  <Skeleton className="h-[50px] rounded" />
                  <Skeleton className="h-[20px] w-[80px]" />

                </Card>
              ))
            }


          </div>
        )
      }

      {
        getDocument && getDocument.length === 0 && (
          <div className="flex justify-center items-center mt-[10%]">
            You have no uploaded a document
          </div>
        )
      }


      <div className="grid grid-cols-4 gap-4">
        {

          getDocument && getDocument.length > 0 && getDocument?.map(doc => (
            <DocumentCard document={doc} key={doc._id} />
          ))
        }
      </div>


    </main>
  );
}


