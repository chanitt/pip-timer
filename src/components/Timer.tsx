import { useState, useCallback, useEffect, useRef } from 'react';
import PiPWindow from "../app/pip/PiPWindow";
import { usePiPWindow } from "../app/pip/PiPProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";

function Timer({ setTimesUp }: { setTimesUp: (timesUp: boolean) => void }) {
    const { isSupported, requestPipWindow, pipWindow, closePipWindow } = usePiPWindow();

    const [initialTime, setInitialTime] = useState(300);
    const [time, setTime] = useState(initialTime);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [inputTime, setInputTime] = useState({ minutes: 5, seconds: 0 });
    const [isReset, setIsReset] = useState(true);
    const formattedTime = `${Math.floor(time / 60)}:${time % 60 < 10 ? `0${time % 60}` : time % 60}`;

    const updateInputTime = (field: 'minutes' | 'seconds', value: number) => {
        setInputTime((prev) => ({ ...prev, [field]: value }));
    };

    const startPiP = useCallback(() => {
        requestPipWindow(300, 150);
    }, [requestPipWindow]);

    const handlePiPButton = () => {
        if (!isSupported) {
            alert("Document Picture-in-Picture is not supported in this browser");
        } else if (pipWindow) {
            closePipWindow();
        } else {
            startPiP();
        }
    };

    const handleStartStop = () => {
        setTimesUp(false);
        setIsReset(false);
        if (!isRunning) {
            const totalSeconds = (inputTime.minutes * 60) + inputTime.seconds;
            setInitialTime(totalSeconds);
            setTime(totalSeconds);
        }
        setIsRunning((prevState) => !prevState);
    };

    const handleReset = () => {
        setTimesUp(false);
        setIsReset(true);
        const totalSeconds = (inputTime.minutes * 60) + inputTime.seconds;
        setInitialTime(totalSeconds);
        setTime(totalSeconds);
        setIsRunning(false);
        clearInterval(timerRef.current!);
        timerRef.current = null;
    };

    useEffect(() => {
        if (isRunning && time > 0) {
            timerRef.current = setInterval(() => {
                setTime((prevTime) => Math.max(prevTime - 1, 0));
            }, 1000);
        } else if (time === 0) {
            setIsRunning(false);
            clearInterval(timerRef.current!);
            setTimesUp(true);
        }

        return () => clearInterval(timerRef.current!);
    }, [isRunning, time, setTimesUp]);

    return (
        <Card className="p-6 bg-gray-100 rounded-lg shadow-md flex flex-col items-center">
            <CardHeader className="flex flex-row items-end gap-4">
                <Button variant="outline" size="sm" onClick={() => updateInputTime('minutes', 3)}>3 mins</Button>
                <Button variant="outline" size="sm" onClick={() => updateInputTime('minutes', 5)}>5 mins</Button>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handlePiPButton}
                                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                            >
                                <Image src="/pip.svg" alt="Pip" width={24} height={24} />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className='mb-2'>
                            <p>Click to start Picture-in-Picture mode</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardHeader>

            <CardContent className="text-2xl font-mono mb-6">
                {isReset ? (
                    <div className="flex gap-4 items-center">
                        <div className='flex flex-row gap-2 items-center'>
                            <Input
                                type="number"
                                className="w-24 h-16 text-center border border-gray-300 rounded-md text-2xl"
                                value={isNaN(inputTime.minutes) ? "" : inputTime.minutes}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    updateInputTime('minutes', isNaN(value) || value > 60 ? 0 : value);
                                }}
                                max={60}
                                min={0}
                            />
                            <div className="flex flex-col gap-1">
                                <Button variant="outline" size="icon" className="w-8 h-8 border border-gray-300 rounded-md"
                                    onClick={() => {
                                        const newMinutes = inputTime.minutes + 1;
                                        updateInputTime('minutes', newMinutes > 60 ? 0 : newMinutes);
                                    }}>
                                    +
                                </Button>
                                <Button variant="outline" size="icon" className="w-8 h-8 border border-gray-300 rounded-md"
                                    onClick={() => {
                                        const newMinutes = inputTime.minutes - 1;
                                        updateInputTime('minutes', newMinutes < 0 ? 0 : newMinutes);
                                    }}>
                                    -
                                </Button>
                            </div>
                        </div>

                        <span className="text-xl">:</span>

                        <div className='flex flex-row gap-2 items-center'>
                            <Input
                                type="number"
                                className="w-24 h-16 text-center border border-gray-300 rounded-md text-2xl"
                                value={isNaN(inputTime.seconds) ? "" : inputTime.seconds}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    updateInputTime('seconds', isNaN(value) || value > 59 ? 0 : value);
                                }}
                                max={59}
                                min={0}
                            />
                            <div className="flex flex-col gap-2">
                                <Button variant="outline" size="icon" className="w-8 h-8 border border-gray-300 rounded-md"
                                    onClick={() => {
                                        const newSeconds = inputTime.seconds + 30;
                                        updateInputTime('seconds', newSeconds > 59 ? 0 : newSeconds);
                                        if (newSeconds > 59) updateInputTime('minutes', inputTime.minutes + 1);
                                    }}>
                                    +30
                                </Button>
                                <Button variant="outline" size="icon" className="w-8 h-8 border border-gray-300 rounded-md"
                                    onClick={() => {
                                        const newSeconds = inputTime.seconds - 30;
                                        if (newSeconds < 0) {
                                            if (inputTime.minutes > 0) {
                                                updateInputTime('minutes', inputTime.minutes - 1);
                                                updateInputTime('seconds', 60 + newSeconds);
                                            } else {
                                                updateInputTime('seconds', 0);
                                            }
                                        } else {
                                            updateInputTime('seconds', newSeconds);
                                        }
                                    }}>
                                    -30
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <span className={`text-4xl font-mono ${time < 30 ? 'text-red-500' : ''}`}>
                        {formattedTime}
                    </span>
                )}
            </CardContent>

            <CardFooter className="flex gap-4">
                <Button onClick={handleStartStop} className="px-6 py-2">
                    {isRunning ? "Stop" : "Start"}
                </Button>
                <Button onClick={handleReset} className="px-6 py-2 bg-red-500 text-white hover:bg-red-600">
                    Reset
                </Button>
            </CardFooter>

            {pipWindow && (
                <PiPWindow pipWindow={pipWindow}>
                    <div className={`flex flex-col items-center justify-center font-mono mt-4 ${time < 30 ? 'text-red-500' : ''} ${time === 0 ? 'text-white bg-red-600' : ''}`}>
                        <span className={`text-7xl font-mono text-center justify-center`}
                            style={{ fontSize: 'calc(48px + 10vw)' }}
                        >
                            {formattedTime}
                        </span>
                        <div className='flex flex-row gap-4'>
                            <Button onClick={handleStartStop} className="px-6 py-2">
                                {isRunning ? "Stop" : "Start"}
                            </Button>
                            <Button onClick={handleReset} className="px-6 py-2 bg-red-500 text-white hover:bg-red-600">
                                Reset
                            </Button>
                        </div>
                    </div>
                </PiPWindow>
            )}
        </Card>
    );
}

export default Timer;
