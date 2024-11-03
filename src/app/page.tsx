"use client";
import { PiPProvider } from "./pip/PiPProvider";
import Timer from './components/Timer';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen font-mono">
      <h1 className='font-bold text-2xl'>
        PiP Timer
      </h1>

      <PiPProvider>
        <Timer />
      </PiPProvider>
    </div>
  )
}
