"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
import * as React from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}
export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  let lastTaskDeleted ={
    day: '',
    id: '',
    label: '',
    priority: '',
    publicId: '',
    status: '',
    time: '',
    title: '',
    userId: ''
  }
  let taskData: { [key: string]: string } = {}
  const { toast } = useToast()
  const undeleteTask = async () => {
    if (lastTaskDeleted.publicId === '') return
    const response = await fetch('/api/tasks/add', {
      headers: {
          'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(lastTaskDeleted)
  })
  if (response.ok) {
  const event = new CustomEvent('taskDeleted', {
    detail: { message: 'A task has been deleted.' },
  });
 toast({
    color: '#000',
    title: "Success: Task Added",
    description: "Your task has been successfully added.",
  })
  document.dispatchEvent(event);
} else {
  toast({
    color: '#000',
    title: "Error: Task Errored",
    description: "Please, contact support.",
  })
  console.error("Failed to fetch tasks");
}
  }
  const deleteTask = () => {
    fetch(`/api/tasks/delete?index=${row.index}`)
    .then(async (response) => {
        if (response.ok) {
          const task = await response.json()
          const event = new CustomEvent('taskDeleted', {
            detail: { message: 'A task has been deleted.' },
          });
         toast({
            color: '#000',
            title: "Success: Task Deleted",
            description: "Your task has been successfully deleted.",
            action: (
              <ToastAction onClick={async () => await undeleteTask()} altText="Click here to undo">Undo</ToastAction>
            ),
          })
          lastTaskDeleted = task.taskDeleted
          document.dispatchEvent(event);
        } else {
            console.error("Failed to fetch tasks");
        }
    })
    .catch(error => console.error("Error fetching tasks:", error));  
  }

  const submitEditForm = () => {
    if(taskData?.startTime && taskData?.endTime) {
      taskData['time'] = `From ${taskData?.startTime} to ${taskData?.endTime}`
      delete taskData['startTime']
      delete taskData['endTime']
    }
    const queryString = Object.entries(taskData)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
    fetch(`/api/tasks/set?index=${row.index}&${queryString}`)
    .then(async (response) => {
        if (response.ok) {
          const task = await response.json()
          const event = new CustomEvent('taskDeleted', {
            detail: { message: 'A task has been deleted.' },
          });
         toast({
            color: '#000',
            title: "Success: Task edited",
            description: "Your task has been successfully edited.",
          })
          document.dispatchEvent(event);
        } else {
            console.error("Failed to fetch tasks");
        }
    })
    .catch(error => console.error("Error fetching tasks:", error));  
  }

  const setAsDone = () => {
    fetch(`/api/tasks/set?index=${row.index}&status=done`)
    .then(async (response) => {
        if (response.ok) {
          const task = await response.json()
          const event = new CustomEvent('taskDeleted', {
            detail: { message: 'A task has been deleted.' },
          });
         toast({
            color: '#000',
            title: "Success: Task set as done",
            description: "Your task has been successfully set as done.",
            action: (
              <ToastAction onClick={async () => setAsTodo()} altText="Click here to undo">Undo</ToastAction>
            ),
          })
          document.dispatchEvent(event);
        } else {
            console.error("Failed to fetch tasks");
        }
    })
    .catch(error => console.error("Error fetching tasks:", error));  
  }

  const editData = (key: string, value: string) => {
    taskData[key] = value
  }

  const setAsTodo = () => {
    fetch(`/api/tasks/set?index=${row.index}&status=todo`)
    .then(async (response) => {
        if (response.ok) {
          const task = await response.json()
          const event = new CustomEvent('taskDeleted', {
            detail: { message: 'A task has been deleted.' },
          });
         toast({
            color: '#000',
            title: "Success: Task set as todo",
            description: "Your task has been successfully set as todo.",
          })
          document.dispatchEvent(event);
        } else {
            console.error("Failed to fetch tasks");
        }
    })
    .catch(error => console.error("Error fetching tasks:", error));  
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-black"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
          <Dialog>
      <DialogTrigger asChild>
        <Button className="border-none relative text-left right-2" variant="outline">Edit Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Make changes to your task here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 space-x-1 inset-0">
          <div className="grid grid-cols-4 items-center gap-4 text-center">
            <Label htmlFor="title" className="">
              Title
            </Label>
            <Input onChange={e => editData('title', e.target.value)} id="title" value={taskData['title']} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 text-center">
            <Label htmlFor="day" className="">
              Day
            </Label>


            <Select onValueChange={(e) => editData('day', e)}>
      <SelectTrigger className="col-span-3 relative">
        <SelectValue placeholder="Edit the day" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Day</SelectLabel>
          <SelectItem value="Monday">Monday</SelectItem>
          <SelectItem value="Tuesday">Tuesday</SelectItem>
          <SelectItem value="Wednesday">Wednesday</SelectItem>
          <SelectItem value="Thursday">Thursday</SelectItem>
          <SelectItem value="Friday">Friday</SelectItem>
          <SelectItem value="Saturday">Saturday</SelectItem>
          <SelectItem value="Sunday">Sunday</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>


            <Label htmlFor="priority" className="">
              Priority
            </Label>
    <Select onValueChange={(e) => editData('priority', e)}>
      <SelectTrigger className="col-span-3 relative">
        <SelectValue placeholder="Edit the priority" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Priority</SelectLabel>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <label htmlFor="time">Time</label>
    <input
    type="time"
    id="time"
    value={taskData['startTime']}
    onChange={e => editData('startTime', e.target.value)}
    className="px-3 py-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none w-28"
    />
    <span className="self-center">to</span>
    <input
    type="time"
    value={taskData['endTime']}
    onChange={e => editData('endTime', e.target.value)}
    className="px-3 py-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none w-28 relative right-8"
    />
          </div>
        </div>
        <DialogFooter>
        <DialogClose asChild>
          <Button onClick={submitEditForm} type="submit">Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
        <DropdownMenuItem>Make a copy</DropdownMenuItem>
        <DropdownMenuItem>Favorite</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => deleteTask()}>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setAsDone()}>
          Set as done
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
