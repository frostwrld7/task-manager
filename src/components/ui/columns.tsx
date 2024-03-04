"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { labels, priorities, statuses } from "@/components/ui/data"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

interface Task {
  publicId: string,
  title: string,
  status: string,
  label: string,
  priority: string,
  day: string,
}

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }: any) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }: any) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "publicId",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Task" />
    ),
    cell: ({ row }: any) => <div className="w-[80px]">{row.getValue("publicId")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }: any) => {
      const label = labels.find((label) => label.value === row.original.label)

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "day",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Day" />
    ),
    cell: ({ row }: any) => {
      const label = labels.find((label) => label.value === row.original.label)

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("day")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "time",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Time" />
    ),
    cell: ({ row }: any) => {
      const label = labels.find((label) => label.value === row.original.label)

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("time")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }: any) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row: any, id: any, value: any) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }: any) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }: any) => {
      const priority = priorities.find(
        (priority) => priority.value === row.getValue("priority")
      )

      if (!priority) {
        return null
      }

      return (
        <div className="flex items-center">
          {priority.icon && (
            <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{priority.label}</span>
        </div>
      )
    },
    filterFn: (row: any, id: any, value: any) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ({ row }: any) => <DataTableRowActions row={row} />,
  },
]
