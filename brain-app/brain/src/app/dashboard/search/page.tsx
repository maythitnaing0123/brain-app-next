"use client"

import React, { useState } from 'react'
import { SearchForm } from './search-form'
import { Doc } from '@c/convex/_generated/dataModel'
import { api } from '@c/convex/_generated/api'
import Link from 'next/link'

const SearchPage = () => {
    const [records, setRecords] = useState<typeof api.search.searchAction._returnType | null>()



    return <main className="space-y-8">


        <h1 className="text-4xl font-bold">Search</h1>

        <SearchForm setRecords={setRecords} />

        <ul className='flex flex-col gap-2'>
            {
                records?.map(record => (

                    record.type === "note"
                        ? <Link href={`/dashboard/notes/${record.record._id}`} key={record.record._id}>

                            <li className='bg-slate-800 rounded p-4'>

                                Type: Note (score - {record.score}){" "}
                                {
                                    record.record.text?.substring(0, 500) + "..."
                                }

                            </li>
                        </Link> :
                        <Link href={`/dashboard/documents/${record.record._id}`} key={record.record._id}>

                            <li className='bg-slate-800 rounded p-4'>

                                  Type: documents (score - {record.score}){" "}
                                {
                                    record.record.description?.substring(0, 500) + "..."
                                }

                            </li>
                        </Link>
                ))
            }

        </ul>

    </main>

}

export default SearchPage
