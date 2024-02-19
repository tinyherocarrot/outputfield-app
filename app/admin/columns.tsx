"use client"

import { NomineeWithId } from "@/ts/interfaces/nominee.interfaces"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updateNomineeFn } from "./page"
import { UpdateNomineeMenu } from "./update-nominee-menu"
/**
 * Server actions must be imported in server components, so we must pass both
 * the updateNomineeFn and generateColumnDef function into DataTable to define
 * columns.
 * https://github.com/vercel/next.js/discussions/57535
 */
export default function generateColumnDef(fn : updateNomineeFn): ColumnDef<NomineeWithId, unknown>[] {
return [{
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "website_url",
    header: "Website",
    cell: ({ row }) => {
        const url = row.getValue("website_url") as string
        return <a className="text-right text-blue-500" href={url} target="_blank">{url}</a>
    },
  },
  {
    accessorKey: "genre",
    header: "Genre",
    cell: ({ row }) => {
        const genre = row.getValue("genre") as string[]
        return (
            <p>{genre.join(', ')}</p>
        )
    }
  },
  {
    accessorKey: "date_created",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    cell: ({ row }) => {
        const date = row.getValue("date_created") as Date
        return date.toDateString()
    }
  },
  {
    accessorKey: "location.description",
    header: "Location",
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const nominee = row.original
      const updateNomineeWithId = fn.bind(null, nominee.id)
 
      return (
        <UpdateNomineeMenu fn={updateNomineeWithId} />
      )
    },
  },
]
}
