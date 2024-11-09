"use client";
import { PiPProvider } from "./pip/PiPProvider";
import Timer from '../components/Timer';
import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
export default function Home() {
  const [timesUp, setTimesUp] = useState(false);

  return (
    <>
      <Head>
        <title>PiP Timer - Floating Timer for Picture-in-Picture Mode</title>
        <meta name="description" content="PiP Timer helps you stay on track with a floating countdown timer in Picture-in-Picture mode. Perfect for pitching, presentations, and multitasking." />
        <meta name="keywords" content="PiP Timer, Picture-in-Picture Timer, floating countdown timer, online timer, presentation timer, pitching timer, countdown, multitasking timer" />

        <meta property="og:title" content="PiP Timer - Floating Countdown Timer" />
        <meta property="og:description" content="Manage your time effectively with the PiP Timer, a floating timer for Picture-in-Picture mode. Ideal for presentations and pitches." />
        <meta property="og:url" content="https://pip-timer.vercel.app" />
        <meta property="og:type" content="website" />

        <meta name="twitter:title" content="PiP Timer - Floating Countdown Timer" />
        <meta name="twitter:description" content="Use PiP Timer in Picture-in-Picture mode to manage time for pitches and presentations." />
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
            <Image src="/github.svg" alt="Github" className="w-6 h-6" width={24} height={24} loading="lazy" />
          </a>
        </footer>

      </div>
    </>
  )
}
