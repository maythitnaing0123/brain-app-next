"use client"

import React, { useEffect, useState } from 'react'
import { SearchForm } from './search-form'
import { Doc } from '@c/convex/_generated/dataModel'
import { api } from '@c/convex/_generated/api'
import Link from 'next/link'
import { json } from 'stream/consumers'
import { FileIcon, NotebookPen } from 'lucide-react'

const SearchPage = () => {
    const [records, setRecords] = useState<typeof api.search.searchAction._returnType | null>()

    useEffect(() => {

        const storedResults = localStorage.getItem("SearchResults");
        if (!storedResults) return;
        setRecords(JSON.parse(storedResults))

    }, [])

    return <main className="space-y-8">


        <h1 className="text-4xl font-bold">Search</h1>

        <SearchForm setRecords={(SearchResults) => {
            setRecords(SearchResults);
            localStorage.setItem("SearchResults", JSON.stringify(SearchResults))
        }} />

        <ul className='flex flex-col gap-y-3'>
            {
                records?.map(record => (

                    record.type === "note"
                        ? <Link href={`/dashboard/notes/${record.record._id}`} key={record.record._id}>

                            <li className='bg-slate-800 rounded p-4 space-y-2'>
                                <div className='flex gap-2 text-xl items-center'><NotebookPen />Type: Note </div>

                                <div>Score - {record.score.toFixed(2)}</div>
                                <div>
                                    {
                                        record.record.text?.substring(0, 500) + "..."
                                    }
                                </div>
                            </li>
                        </Link> :
                        <Link href={`/dashboard/documents/${record.record._id}`} key={record.record._id}>

                            <li className='bg-slate-800 rounded p-4 space-y-2'>
                                <div className='flex gap-2 text-xl items-center'><FileIcon />Type: documents </div>

                                <div>Score - {record.score.toFixed(2)}</div>
                                <div>
                                    {
                                        record.record.description?.substring(0, 500) + "..."
                                    }
                                </div>

                            </li>
                        </Link>
                ))
            }

        </ul>

    </main>

}

export default SearchPage
