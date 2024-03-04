'use client';
import * as React from 'react';
import Image from "next/image";
import Logo from '../../public/4345800.png'
import { TypewriterEffectSmooth } from "../components/ui/typewriter-effect";
import { redirect } from "next/navigation";
import { WavyBackground } from "@/components/ui/wavy-background";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();
  const words = [
    {
      text: "Master",
    },
    {
      text: "your",
    },
    {
      text: "day",
    },
    {
      text: "with",
    },
    {
      text: "TaskManager.",
      className: "text-[#333] dark:text-[#333]",
    },
  ];
  const redirectToLogin = () => {
    redirect('/login')
  }
  return (
    <main className="flex h-screen flex-col items-center justify-between">
      <link rel="preconnect" href="https://fonts.googleapis.com"></link>
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='anonymous'></link>
<div className="hidden w-full md:block md:w-auto mt-8 z-50" id="navbar-default">
  {session.status === 'authenticated' ? (
    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 dark:border-gray-700">
        <li>
          <a href="#" className="block py-2 px-3 text-2xl rounded md:hover:bg-transparent md:border-0 md:p-0 text-white dark:hover:text-[#333] md:dark:hover:bg-transparent" aria-current="page">Home</a>
        </li>
        <li>
          <a href="/dashboard" className="block py-2 px-3 text-2xl rounded md:hover:bg-transparent md:border-0 md:p-0 text-white dark:hover:text-[#333] md:dark:hover:bg-transparent">Dashboard</a>
        </li>
        <li>
          <span onClick={() => signOut()} className="block py-2 px-3 text-2xl rounded md:hover:bg-transparent md:border-0 md:p-0 text-white dark:hover:text-[#333] md:dark:hover:bg-transparent">Logout</span>
        </li>
        <li>
          <a href="/contact" className="block py-2 px-3 text-2xl rounded md:hover:bg-transparent md:border-0 md:p-0 text-white dark:hover:text-[#333] md:dark:hover:bg-transparent">Contact</a>
        </li>
      </ul>
  )
:
(
<ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 dark:border-gray-700">
        <li>
          <a href="#" className="block py-2 px-3 text-2xl rounded md:hover:bg-transparent md:border-0 md:p-0 text-white dark:hover:text-[#333] md:dark:hover:bg-transparent" aria-current="page">Home</a>
        </li>
        <li>
          <a href="/register" className="block py-2 px-3 text-2xl rounded md:hover:bg-transparent md:border-0 md:p-0 text-white dark:hover:text-[#333] md:dark:hover:bg-transparent">Register</a>
        </li>
        <li>
          <a href="/login" className="block z-10 py-2 px-3 text-2xl rounded md:hover:bg-transparent md:border-0 md:p-0 text-white dark:hover:text-[#333] md:dark:hover:bg-transparent">Login</a>
        </li>
        <li>
          <a href="/contact" className="block py-2 px-3 text-2xl rounded md:hover:bg-transparent md:border-0 md:p-0 text-white dark:hover:text-[#333] md:dark:hover:bg-transparent">Contact</a>
        </li>
      </ul>
)}
    </div>
    <WavyBackground className="w-80 h-auto p-0 m-0" />
        <Image className="absolute top-4 left-2" src={Logo} alt="taskLogo" width={45} height={30} />
        <TypewriterEffectSmooth className="absolute top-72 flex justify-center" words={words} />
        <h2 className="text-xs sm:text-base md:text-xs lg:text:xl xl:text-xl absolute top-96 mt-16 text-[#ccc]">Join the global community of trusted users relying on TaskManager to streamline their daily routines. Stay organized effortlessly with a tool <span className="text-[#fff] font-bold md:flex md:justify-center">trusted by millions worldwide.</span></h2>
        <button className="shadow-[0_4px_14px_0_rgb(0,0,0,10%)] hover:shadow-[0_6px_20px_rgba(93,93,93,23%)] sm:w-36 sm:h-12 lg:w-36 lg:h-12 xl:w-36 xl:h-12 px-6 py-2 bg-[#fff] text-[#000] rounded-md font-light transition duration-200 ease-linear absolute bottom-72 xl:top-1/2 xl:mt-32 mr-40">
  <span className="font-bold">Get started</span>
</button>
<button className="shadow-[0_4px_14px_0_rgb(0,0,0,10%)] hover:shadow-[0_6px_20px_rgba(93,93,93,23%)] sm:w-36 sm:h-12 lg:w-32 lg:h-12 xl:w-36 xl:h-12 px-8 py-2 bg-[#333] text-center text-[#fff] rounded-md font-light transition duration-200 ease-linear absolute bottom-72 xl:top-1/2 xl:mt-32 ml-40">
{session.status === 'authenticated' ? (
  <span className="font-bold">Dashboard</span>
)
:
(
<span className="font-bold">Join us!</span>
)}
</button>
    </main>
  );
}
