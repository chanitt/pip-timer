"use client";
import { PiPProvider } from "./pip/PiPProvider";
import Timer from '../components/Timer';
import { useState } from "react";
import Head from "next/head";
export default function Home() {
  const [timesUp, setTimesUp] = useState(false);

  return (
    <>
      <Head>
        <title>PiP Timer - A Simple Timer for Picture-in-Picture Mode</title>
        <meta name="description" content="Use PiP Timer to manage your time effectively with Picture-in-Picture mode." />
        <meta name="keywords" content="timer, picture-in-picture, pip, time management, pitching, pitch" />
        <meta property="og:title" content="PiP Timer" />
        <meta property="og:description" content="A simple timer for Picture-in-Picture mode." />
        <meta property="og:url" content="https://pip-timer.vercel.app" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className={`flex flex-col items-center justify-center min-h-screen mx-auto font-mono ${timesUp ? 'bg-red-600' : ''}`}>
        <h1 className='font-bold text-2xl mb-4 sm:text-3xl md:text-4xl'>
          PiP Timer
        </h1>

        <PiPProvider>
          <Timer setTimesUp={setTimesUp} />
        </PiPProvider>

        <footer className='flex flex-col items-center justify-center text-sm mt-6 p-4 border-t border-gray-300 sm:flex-row sm:justify-between'>
          <span className="mb-2 text-gray-500 sm:mb-0 sm:mr-2">Made by Chanit</span>
          <a href="https://github.com/chanitt/pip-timer" target="_blank" rel="noopener noreferrer" className="hover:opacity-75 transition-opacity">
            <img src="/github.svg" alt="Github" className="w-6 h-6" loading="lazy" />
          </a>
        </footer>

      </div>
    </>
  )
}
