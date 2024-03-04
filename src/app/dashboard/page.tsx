'use client'
import * as React from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { z } from "zod"

import { columns } from "@/components/ui/columns"
import { DataTable } from "@/components/ui/data-table"
import { WavyBackground } from "@/components/ui/wavy-background";

interface Task {
    publicId: string,
    title: string,
    status: string,
    label: string,
    priority: string,
    day: string,
    time: string
}

export default function Home() {
    const [taskName, setTaskName] = React.useState<string>("");
    const [priority, setPriority] = React.useState<string>("low");
    const [tasks, setTasks] = React.useState<Task[]>([])
    const [dayChoosed, setDayChoosed] = React.useState<string>("Monday");
    const [startTime, setStartTime] = React.useState<string>("");
    const [endTime, setEndTime] = React.useState<string>("");
    const [showPopup, setShowPopup] = React.useState<boolean>(false);
    const session = useSession();

    const randomID = (length: number) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
        let result = 'ID-'
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length))
        }
        return result
    }

    React.useEffect(() => {
        if (session.status === 'loading') {
            return;
        } else if (session.status !== 'authenticated') {
            return redirect('/');
        }
    }, [session.status, session.data]);

    React.useEffect(() => {
        if (session?.data?.user?.id) {
            fetch(`/api/tasks/get?userId=${session.data.user.id}`)
                .then(async (response) => {
                    if (response.ok) {
                        const taskArray = await response.json();
                        setTasks(taskArray);
                    } else {
                        console.error("Failed to fetch tasks");
                    }
                })
                .catch(error => console.error("Error fetching tasks:", error));
        }
    }, [session?.data?.user?.id]);

    React.useEffect(() => {
        if (session?.data?.user?.id) {
            document.addEventListener('taskDeleted', function(event: any) {
                fetch(`/api/tasks/get?userId=${session.data.user.id}`)
                .then(async (response) => {
                    if (response.ok) {
                        const taskArray = await response.json();
                        setTasks(taskArray);
                    } else {
                        console.error("Failed to fetch tasks");
                    }
                })
                .catch(error => console.error("Error fetching tasks:", error));             
            });
        }
    }, [session?.data?.user?.id]);

    const handleAddTask = async () => {
        if (!taskName || !startTime || !endTime || !dayChoosed || !priority) {
            alert("Please fill in all fields.");
            return;
        }
        const newTask: Task = {
            publicId: randomID(6),
            title: taskName,
            status: 'todo',
            label: '',
            priority: priority,
            day: dayChoosed,
            time: `From ${startTime} to ${endTime}`
        };
        const response = await fetch('/api/tasks/add', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(newTask)
        })
        if(response.ok) {
            const taskAddResponse = await response.json()
            setTasks([...tasks, newTask]);
            setTaskName("");
            setStartTime("");
            setEndTime("");
            setShowPopup(false);
        }
        setTaskName("");
        setStartTime("");
        setEndTime("");
        setShowPopup(false);
    };

    const handlePopupClose = () => {
        setShowPopup(false);
    };

    return (
        <main className="flex h-screen flex-col items-center justify-between" style={{ height: '100vh' }}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='anonymous' />
            <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap" rel="stylesheet" />
            <div className="hidden w-full md:flex md:w-auto mt-8 z-50 absolute top-2 items-center" id="navbar-default">
      <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 dark:border-gray-700">
        <li>
          <a href="/" className="block py-2 px-3 text-2xl rounded md:hover:bg-transparent md:border-0 md:p-0 text-white dark:hover:text-[#333] md:dark:hover:bg-transparent" aria-current="page">Home</a>
        </li>
        <li>
          <a href="#" className="block py-2 px-3 text-2xl rounded md:hover:bg-transparent md:border-0 md:p-0 text-white dark:hover:text-[#333] md:dark:hover:bg-transparent">Contact</a>
        </li>
        <li>
          <a href="/login" className="block py-2 px-3 text-2xl rounded md:hover:bg-transparent md:border-0 md:p-0 text-white dark:hover:text-[#333] md:dark:hover:bg-transparent">Logout</a>
        </li>
        <li>
          <a href="/contact" className="block py-2 px-3 text-2xl rounded md:hover:bg-transparent md:border-0 md:p-0 text-white dark:hover:text-[#333] md:dark:hover:bg-transparent">Contact</a>
        </li>
      </ul>
    </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <div className="flex items-center space-x-2">
          </div>
        </div>
        <DataTable data={tasks} columns={columns} />
      </div>
      <button onClick={() => setShowPopup(true)} className="shadow-[0_4px_14px_0_rgb(0,0,0,10%)] hover:shadow-[0_6px_20px_rgba(93,93,93,23%)] sm:w-36 sm:h-12 lg:w-36 lg:h-12 xl:w-30 xl:h-12 px-6 py-2 bg-[#fff] text-[#000] rounded-md font-light transition duration-200 ease-linear absolute xl:top-4 right-4 z-50">
  <span className="font-bold">Add task</span>
</button>
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-lg font-semibold mb-4">Add Task</h2>
                        <input
                            type="text"
                            value={taskName}
                            onChange={e => setTaskName(e.target.value)}
                            placeholder="Task name"
                            required={true}
                            className="w-full px-3 py-2 mb-4 rounded-md bg-gray-200 text-gray-800 focus:outline-none"
                        />
                        <select
                            onChange={e => setPriority(e.target.value)}
                            value={priority}
                            required={true}
                            className="w-full px-3 py-2 mb-4 rounded-md bg-gray-200 text-gray-800 focus:outline-none"
                        >
                            <option value='low'>
                                Low
                            </option>
                            <option value='medium'>
                                Medium
                            </option>
                            <option value='high'>
                                High
                            </option>
                        </select>
                        <select
                            onChange={e => setDayChoosed(e.target.value)}
                            value={dayChoosed}
                            required={true}
                            className="w-full px-3 py-2 mb-4 rounded-md bg-gray-200 text-gray-800 focus:outline-none"
                        >
                            <option value='Monday'>
                                Monday
                            </option>
                            <option value='Tuesday'>
                                Tuesday
                            </option>
                            <option value='Wednesday'>
                                Wednesday
                            </option>
                            <option value='Thursday'>
                                Thursday
                            </option>
                            <option value='Friday'>
                                Friday
                            </option>
                            <option value='Saturday'>
                                Saturday
                            </option>
                            <option value='Sunday'>
                                Sunday
                            </option>
                        </select>
                        <div className="flex space-x-4 mb-4">
                            <input
                                type="time"
                                value={startTime}
                                onChange={e => setStartTime(e.target.value)}
                                className="px-3 py-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none"
                            />
                            <span className="self-center">to</span>
                            <input
                                type="time"
                                value={endTime}
                                onChange={e => setEndTime(e.target.value)}
                                className="px-3 py-2 rounded-md bg-gray-200 text-gray-800 focus:outline-none"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={handleAddTask}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                            >
                                Add
                            </button>
                            <button
                                onClick={handlePopupClose}
                                className="ml-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
                <WavyBackground className="w-auto h-full absolute" />
        </main>
    );
}
