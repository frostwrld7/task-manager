"use client";
import { WavyBackground } from "@/components/ui/wavy-background";
import { UserContactForm } from "@/components/ui/user-contact-form";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <link rel="preconnect" href="https://fonts.googleapis.com"></link>
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='anonymous'></link>
<div className="hidden w-full md:flex md:w-auto mt-8 z-50 absolute top-2 items-center" id="navbar-default">
      <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 dark:border-gray-700">
        <li>
          <a href="/" className="block py-2 px-3 text-2xl rounded md:hover:bg-transparent md:border-0 md:p-0 text-white dark:hover:text-[#333] md:dark:hover:bg-transparent" aria-current="page">Home</a>
        </li>
        <li>
          <a href="#" className="block py-2 px-3 text-2xl rounded md:hover:bg-transparent md:border-0 md:p-0 text-white dark:hover:text-[#333] md:dark:hover:bg-transparent">Register</a>
        </li>
        <li>
          <a href="/login" className="block py-2 px-3 text-2xl rounded md:hover:bg-transparent md:border-0 md:p-0 text-white dark:hover:text-[#333] md:dark:hover:bg-transparent">Login</a>
        </li>
        <li>
          <a href="/contact" className="block py-2 px-3 text-2xl rounded md:hover:bg-transparent md:border-0 md:p-0 text-white dark:hover:text-[#333] md:dark:hover:bg-transparent">Contact</a>
        </li>
      </ul>
    </div>
    <WavyBackground className="w-1/2 h-full absolute left-0" />
      <div className="absolute items-center top-80 space-y-8 z-50">
      <h1 className="text-2xl font-semibold tracking-tight text-center text-white">
                How to reach us?
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email and your request below to contact us
              </p>
            <UserContactForm />
            </div>
    </main>
  );
}
